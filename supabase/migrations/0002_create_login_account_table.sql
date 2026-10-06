-- 아이디/비밀번호 로그인 계정
-- 비밀번호는 pgcrypto bcrypt 해시만 저장한다.
-- 재실행해도 오류 없이 통과하도록 작성했다.

BEGIN;

DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
  WHEN OTHERS THEN
    RAISE;
END
$$;

CREATE TABLE IF NOT EXISTS public.login_account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  login_id text NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT login_account_login_id_not_blank CHECK (char_length(btrim(login_id)) > 0),
  CONSTRAINT login_account_login_id_unique UNIQUE (login_id),
  CONSTRAINT login_account_password_hash_bcrypt CHECK (password_hash ~ '^\$2[aby]\$'),
  CONSTRAINT login_account_name_not_blank CHECK (char_length(btrim(name)) > 0),
  CONSTRAINT login_account_email_not_blank CHECK (char_length(btrim(email)) > 0),
  CONSTRAINT login_account_email_format CHECK (
    email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  CONSTRAINT login_account_email_unique UNIQUE (email)
);

COMMENT ON TABLE public.login_account IS '아이디/비밀번호 로그인 계정';
COMMENT ON COLUMN public.login_account.id IS '계정 식별자';
COMMENT ON COLUMN public.login_account.login_id IS '로그인 아이디';
COMMENT ON COLUMN public.login_account.password_hash IS 'bcrypt 비밀번호 해시';
COMMENT ON COLUMN public.login_account.name IS '이름';
COMMENT ON COLUMN public.login_account.email IS '이메일';
COMMENT ON COLUMN public.login_account.created_at IS '생성 시각';
COMMENT ON COLUMN public.login_account.updated_at IS '마지막 수정 시각';

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

DROP TRIGGER IF EXISTS login_account_set_updated_at ON public.login_account;

CREATE TRIGGER login_account_set_updated_at
  BEFORE UPDATE ON public.login_account
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 해시 비교는 데이터베이스에서만 수행한다.
-- 일치하는 계정의 식별 정보만 반환하고, 비밀번호 해시는 반환하지 않는다.
CREATE OR REPLACE FUNCTION public.authenticate_login_account(
  p_login_id text,
  p_password text
)
RETURNS TABLE (
  id uuid,
  name text,
  email text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT
    account.id,
    account.name,
    account.email
  FROM public.login_account AS account
  WHERE account.login_id = p_login_id
    AND account.password_hash = extensions.crypt(p_password, account.password_hash);
$$;

COMMENT ON FUNCTION public.authenticate_login_account(text, text) IS
  'login_id와 비밀번호가 일치하는 로그인 계정을 반환한다.';

REVOKE ALL ON FUNCTION public.authenticate_login_account(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.authenticate_login_account(text, text) TO anon, authenticated, service_role;

ALTER TABLE public.login_account ENABLE ROW LEVEL SECURITY;

-- 비밀번호 해시가 담긴 테이블은 공개 API로 열지 않는다.
-- 조회와 변경은 service role 키만 가능하다.
REVOKE ALL ON TABLE public.login_account FROM anon, authenticated;
GRANT ALL ON TABLE public.login_account TO service_role;

-- 기존 로그인 화면의 테스트 계정을 해시로 넣는다.
-- 이미 같은 login_id가 있으면 비밀번호를 다시 쓰지 않는다.
INSERT INTO public.login_account (login_id, password_hash, name, email)
SELECT
  seed.login_id,
  extensions.crypt(seed.password, extensions.gen_salt('bf')),
  seed.name,
  seed.email
FROM (
  VALUES
    ('admin', 'admin1234', '관리자', 'admin@example.com'),
    ('user', 'user1234', '일반사용자', 'user@example.com')
) AS seed(login_id, password, name, email)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.login_account AS existing
  WHERE existing.login_id = seed.login_id
);

COMMIT;
