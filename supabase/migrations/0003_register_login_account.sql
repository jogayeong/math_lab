-- login_account 회원가입
-- 비밀번호는 이 함수 안에서 bcrypt 해시로 바꾼 뒤 저장한다.
-- 재실행해도 오류 없이 통과하도록 작성했다.

BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS login_account_login_id_lower_unique
  ON public.login_account (lower(login_id));

CREATE UNIQUE INDEX IF NOT EXISTS login_account_email_lower_unique
  ON public.login_account (lower(email));

CREATE OR REPLACE FUNCTION public.register_login_account(
  p_login_id text,
  p_password text,
  p_name text,
  p_email text
)
RETURNS TABLE (
  result_code text,
  id uuid,
  name text,
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  normalized_login_id text := btrim(p_login_id);
  normalized_name text := btrim(p_name);
  normalized_email text := lower(btrim(p_email));
  created_account public.login_account%ROWTYPE;
  violated_constraint text;
BEGIN
  IF p_login_id IS NULL
    OR p_password IS NULL
    OR p_name IS NULL
    OR p_email IS NULL
    OR normalized_login_id !~ '^[a-zA-Z0-9_]{4,30}$'
    OR char_length(p_password) < 8
    OR octet_length(p_password) > 72
    OR char_length(normalized_name) = 0
    OR char_length(normalized_name) > 50
    OR normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  THEN
    RETURN QUERY
    SELECT 'invalid_input'::text, NULL::uuid, NULL::text, NULL::text;
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.login_account AS account
    WHERE lower(account.login_id) = lower(normalized_login_id)
  ) THEN
    RETURN QUERY
    SELECT 'duplicate_login_id'::text, NULL::uuid, NULL::text, NULL::text;
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.login_account AS account
    WHERE lower(account.email) = normalized_email
  ) THEN
    RETURN QUERY
    SELECT 'duplicate_email'::text, NULL::uuid, NULL::text, NULL::text;
    RETURN;
  END IF;

  BEGIN
    INSERT INTO public.login_account (login_id, password_hash, name, email)
    VALUES (
      normalized_login_id,
      extensions.crypt(p_password, extensions.gen_salt('bf')),
      normalized_name,
      normalized_email
    )
    RETURNING * INTO created_account;

    RETURN QUERY
    SELECT
      'created'::text,
      created_account.id,
      created_account.name,
      created_account.email;
  EXCEPTION
    WHEN unique_violation THEN
      GET STACKED DIAGNOSTICS violated_constraint = CONSTRAINT_NAME;

      IF violated_constraint LIKE '%login_id%' THEN
        RETURN QUERY
        SELECT 'duplicate_login_id'::text, NULL::uuid, NULL::text, NULL::text;
      ELSE
        RETURN QUERY
        SELECT 'duplicate_email'::text, NULL::uuid, NULL::text, NULL::text;
      END IF;
  END;
END;
$$;

COMMENT ON FUNCTION public.register_login_account(text, text, text, text) IS
  '로그인 계정을 만들고 비밀번호는 bcrypt 해시로 저장한다.';

REVOKE ALL ON FUNCTION public.register_login_account(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_login_account(text, text, text, text) TO anon, authenticated, service_role;

COMMIT;
