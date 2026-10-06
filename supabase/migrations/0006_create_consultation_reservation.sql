-- 방문 상담 예약
-- 학부모 연락처가 있으므로 테이블 조회는 열지 않는다.
-- 접수는 SECURITY DEFINER 함수로만 받는다.
-- 재실행해도 오류 없이 통과하도록 작성했다.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type AS type
    JOIN pg_namespace AS namespace ON namespace.oid = type.typnamespace
    WHERE type.typname = 'consultation_grade'
      AND namespace.nspname = 'public'
  ) THEN
    CREATE TYPE public.consultation_grade AS ENUM ('중1', '중2', '중3', '고1', '고2', '고3');
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
  WHEN OTHERS THEN
    RAISE;
END
$$;

CREATE TABLE IF NOT EXISTS public.consultation_reservation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  grade public.consultation_grade NOT NULL,
  parent_phone text NOT NULL,
  preferred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT consultation_reservation_student_name_length CHECK (
    char_length(btrim(student_name)) BETWEEN 2 AND 20
  ),
  CONSTRAINT consultation_reservation_parent_phone_format CHECK (
    parent_phone ~ '^01[016789]-?\d{3,4}-?\d{4}$'
  )
);

COMMENT ON TYPE public.consultation_grade IS '상담 학생 학년';
COMMENT ON TABLE public.consultation_reservation IS '방문 상담 예약';
COMMENT ON COLUMN public.consultation_reservation.id IS '예약 식별자';
COMMENT ON COLUMN public.consultation_reservation.student_name IS '학생 이름';
COMMENT ON COLUMN public.consultation_reservation.grade IS '학년';
COMMENT ON COLUMN public.consultation_reservation.parent_phone IS '학부모 연락처';
COMMENT ON COLUMN public.consultation_reservation.preferred_at IS '희망 상담 일시';
COMMENT ON COLUMN public.consultation_reservation.created_at IS '생성 시각';
COMMENT ON COLUMN public.consultation_reservation.updated_at IS '마지막 수정 시각';

CREATE INDEX IF NOT EXISTS consultation_reservation_preferred_at_idx
  ON public.consultation_reservation (preferred_at);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS consultation_reservation_set_updated_at ON public.consultation_reservation;

CREATE TRIGGER consultation_reservation_set_updated_at
  BEFORE UPDATE ON public.consultation_reservation
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.consultation_reservation ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.consultation_reservation FROM anon, authenticated;
GRANT ALL ON TABLE public.consultation_reservation TO service_role;

CREATE OR REPLACE FUNCTION public.create_consultation_reservation(
  p_student_name text,
  p_grade text,
  p_parent_phone text,
  p_preferred_at timestamptz
)
RETURNS TABLE (
  result_code text,
  id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_name text := btrim(p_student_name);
  normalized_phone text := btrim(p_parent_phone);
  created_reservation public.consultation_reservation%ROWTYPE;
BEGIN
  IF p_student_name IS NULL
    OR p_grade IS NULL
    OR p_parent_phone IS NULL
    OR p_preferred_at IS NULL
    OR char_length(normalized_name) < 2
    OR char_length(normalized_name) > 20
    OR p_grade NOT IN ('중1', '중2', '중3', '고1', '고2', '고3')
    OR normalized_phone !~ '^01[016789]-?\d{3,4}-?\d{4}$'
  THEN
    RETURN QUERY
    SELECT 'invalid_input'::text, NULL::uuid;
    RETURN;
  END IF;

  -- 제출 순간의 시각 차이는 1분까지 허용한다.
  IF p_preferred_at <= now() - interval '1 minute' THEN
    RETURN QUERY
    SELECT 'past_datetime'::text, NULL::uuid;
    RETURN;
  END IF;

  INSERT INTO public.consultation_reservation (
    student_name,
    grade,
    parent_phone,
    preferred_at
  )
  VALUES (
    normalized_name,
    p_grade::public.consultation_grade,
    normalized_phone,
    p_preferred_at
  )
  RETURNING * INTO created_reservation;

  RETURN QUERY
  SELECT 'created'::text, created_reservation.id;
EXCEPTION
  WHEN check_violation OR invalid_text_representation THEN
    RETURN QUERY
    SELECT 'invalid_input'::text, NULL::uuid;
END;
$$;

COMMENT ON FUNCTION public.create_consultation_reservation(text, text, text, timestamptz) IS
  '방문 상담 예약을 저장한다. 연락처는 이 함수로만 들어온다.';

REVOKE ALL ON FUNCTION public.create_consultation_reservation(text, text, text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_consultation_reservation(text, text, text, timestamptz) TO anon, authenticated, service_role;

COMMIT;
