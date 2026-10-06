-- 사용자 계정 테이블
-- 재실행해도 오류 없이 통과하도록 작성했다.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type AS type
    JOIN pg_namespace AS namespace ON namespace.oid = type.typnamespace
    WHERE type.typname = 'account_gender'
      AND namespace.nspname = 'public'
  ) THEN
    CREATE TYPE public.account_gender AS ENUM ('male', 'female', 'other');
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
  WHEN OTHERS THEN
    RAISE;
END
$$;

CREATE TABLE IF NOT EXISTS public.account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  nickname text NOT NULL,
  gender public.account_gender NOT NULL,
  email text NOT NULL,
  birth_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT account_name_not_blank CHECK (char_length(btrim(name)) > 0),
  CONSTRAINT account_nickname_not_blank CHECK (char_length(btrim(nickname)) > 0),
  CONSTRAINT account_nickname_unique UNIQUE (nickname),
  CONSTRAINT account_email_not_blank CHECK (char_length(btrim(email)) > 0),
  CONSTRAINT account_email_format CHECK (
    email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  CONSTRAINT account_email_unique UNIQUE (email),
  CONSTRAINT account_birth_date_not_future CHECK (birth_date <= CURRENT_DATE)
);

COMMENT ON TYPE public.account_gender IS '성별. male: 남성, female: 여성, other: 기타';
COMMENT ON TABLE public.account IS '사용자 계정';
COMMENT ON COLUMN public.account.id IS '계정 식별자';
COMMENT ON COLUMN public.account.name IS '이름';
COMMENT ON COLUMN public.account.nickname IS '닉네임';
COMMENT ON COLUMN public.account.gender IS '성별';
COMMENT ON COLUMN public.account.email IS '이메일';
COMMENT ON COLUMN public.account.birth_date IS '생년월일';
COMMENT ON COLUMN public.account.created_at IS '생성 시각';
COMMENT ON COLUMN public.account.updated_at IS '마지막 수정 시각';

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

DROP TRIGGER IF EXISTS account_set_updated_at ON public.account;

CREATE TRIGGER account_set_updated_at
  BEFORE UPDATE ON public.account
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;

-- 조회는 비로그인(anon)과 로그인(authenticated) 사용자 모두에게 연다.
-- 생성, 수정, 삭제는 service role 키만 가능하다.
REVOKE ALL ON TABLE public.account FROM anon, authenticated;
GRANT SELECT ON TABLE public.account TO anon, authenticated;
GRANT ALL ON TABLE public.account TO service_role;

DROP POLICY IF EXISTS account_select_public ON public.account;

CREATE POLICY account_select_public
  ON public.account
  FOR SELECT
  TO anon, authenticated
  USING (true);

COMMIT;
