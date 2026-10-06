-- 방문 상담에 레벨 진단, 유형 진단 결과 문장을 함께 저장한다.
-- 결과 화면의 글을 그대로 남기므로 별도 코드 컬럼은 두지 않는다.
-- 재실행해도 오류 없이 통과하도록 작성했다.

BEGIN;

ALTER TABLE public.consultation_reservation
  ADD COLUMN IF NOT EXISTS level_test_result text;

ALTER TABLE public.consultation_reservation
  ADD COLUMN IF NOT EXISTS style_test_result text;

COMMENT ON COLUMN public.consultation_reservation.level_test_result IS '레벨 진단 결과 문장';
COMMENT ON COLUMN public.consultation_reservation.style_test_result IS '유형 진단 결과 문장';

ALTER TABLE public.consultation_reservation
  DROP CONSTRAINT IF EXISTS consultation_reservation_level_test_result_length;

ALTER TABLE public.consultation_reservation
  ADD CONSTRAINT consultation_reservation_level_test_result_length CHECK (
    level_test_result IS NULL OR char_length(level_test_result) BETWEEN 1 AND 2000
  );

ALTER TABLE public.consultation_reservation
  DROP CONSTRAINT IF EXISTS consultation_reservation_style_test_result_length;

ALTER TABLE public.consultation_reservation
  ADD CONSTRAINT consultation_reservation_style_test_result_length CHECK (
    style_test_result IS NULL OR char_length(style_test_result) BETWEEN 1 AND 4000
  );

DROP FUNCTION IF EXISTS public.create_consultation_reservation(text, text, text, timestamptz);
DROP FUNCTION IF EXISTS public.create_consultation_reservation(text, text, text, timestamptz, text, text);

CREATE OR REPLACE FUNCTION public.create_consultation_reservation(
  p_student_name text,
  p_grade text,
  p_parent_phone text,
  p_preferred_at timestamptz,
  p_level_test_result text DEFAULT NULL,
  p_style_test_result text DEFAULT NULL
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
  normalized_level text := nullif(btrim(coalesce(p_level_test_result, '')), '');
  normalized_style text := nullif(btrim(coalesce(p_style_test_result, '')), '');
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
    OR (normalized_level IS NOT NULL AND char_length(normalized_level) > 2000)
    OR (normalized_style IS NOT NULL AND char_length(normalized_style) > 4000)
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
    preferred_at,
    level_test_result,
    style_test_result
  )
  VALUES (
    normalized_name,
    p_grade::public.consultation_grade,
    normalized_phone,
    p_preferred_at,
    normalized_level,
    normalized_style
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

COMMENT ON FUNCTION public.create_consultation_reservation(text, text, text, timestamptz, text, text) IS
  '방문 상담 예약과 진단 결과 문장을 저장한다. 연락처는 이 함수로만 들어온다.';

REVOKE ALL ON FUNCTION public.create_consultation_reservation(text, text, text, timestamptz, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_consultation_reservation(text, text, text, timestamptz, text, text) TO anon, authenticated, service_role;

COMMIT;
