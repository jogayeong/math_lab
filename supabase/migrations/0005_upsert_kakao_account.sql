-- 카카오 로그인 계정
-- 카카오 회원번호로 찾거나 만들고, 닉네임·이메일·프로필 사진을 갱신한다.
-- 테이블은 공개 API로 열지 않고, 저장은 이 함수로만 한다.
-- 재실행해도 오류 없이 통과하도록 작성했다.

BEGIN;

CREATE TABLE IF NOT EXISTS public.kakao_account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kakao_id text NOT NULL,
  name text NOT NULL,
  email text,
  profile_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kakao_account_kakao_id_not_blank CHECK (char_length(btrim(kakao_id)) > 0),
  CONSTRAINT kakao_account_kakao_id_unique UNIQUE (kakao_id),
  CONSTRAINT kakao_account_kakao_id_digits CHECK (kakao_id ~ '^[0-9]{1,32}$'),
  CONSTRAINT kakao_account_name_not_blank CHECK (char_length(btrim(name)) > 0),
  CONSTRAINT kakao_account_email_format CHECK (
    email IS NULL
    OR email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  CONSTRAINT kakao_account_profile_image_url_https CHECK (
    profile_image_url IS NULL
    OR (
      char_length(profile_image_url) <= 2000
      AND profile_image_url ~ '^https://'
    )
  )
);

COMMENT ON TABLE public.kakao_account IS '카카오 로그인 계정';
COMMENT ON COLUMN public.kakao_account.id IS '계정 식별자';
COMMENT ON COLUMN public.kakao_account.kakao_id IS '카카오 회원번호';
COMMENT ON COLUMN public.kakao_account.name IS '카카오 닉네임';
COMMENT ON COLUMN public.kakao_account.email IS '카카오 이메일. 동의하지 않으면 비어 있다';
COMMENT ON COLUMN public.kakao_account.profile_image_url IS '카카오 프로필 이미지 주소';
COMMENT ON COLUMN public.kakao_account.created_at IS '생성 시각';
COMMENT ON COLUMN public.kakao_account.updated_at IS '마지막 수정 시각';

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

DROP TRIGGER IF EXISTS kakao_account_set_updated_at ON public.kakao_account;

CREATE TRIGGER kakao_account_set_updated_at
  BEFORE UPDATE ON public.kakao_account
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 같은 카카오 회원번호가 있으면 프로필만 갱신한다.
-- 이메일을 다시 받지 못하면 기존 이메일을 유지한다.
CREATE OR REPLACE FUNCTION public.upsert_kakao_account(
  p_kakao_id text,
  p_name text,
  p_email text,
  p_profile_image_url text
)
RETURNS TABLE (
  result_code text,
  id uuid,
  name text,
  email text,
  profile_image_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_kakao_id text := btrim(COALESCE(p_kakao_id, ''));
  normalized_name text := btrim(COALESCE(p_name, ''));
  normalized_email text := NULL;
  normalized_image text := NULL;
BEGIN
  IF normalized_kakao_id !~ '^[0-9]{1,32}$' THEN
    RETURN QUERY
    SELECT 'invalid_input'::text, NULL::uuid, NULL::text, NULL::text, NULL::text;
    RETURN;
  END IF;

  IF char_length(normalized_name) = 0 THEN
    normalized_name := '카카오 사용자';
  ELSIF char_length(normalized_name) > 80 THEN
    normalized_name := left(normalized_name, 80);
  END IF;

  IF p_email IS NOT NULL
    AND char_length(btrim(p_email)) BETWEEN 1 AND 320
    AND lower(btrim(p_email)) ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  THEN
    normalized_email := lower(btrim(p_email));
  END IF;

  IF p_profile_image_url IS NOT NULL
    AND char_length(btrim(p_profile_image_url)) BETWEEN 1 AND 2000
    AND btrim(p_profile_image_url) ~ '^https://'
  THEN
    normalized_image := btrim(p_profile_image_url);
  END IF;

  RETURN QUERY
  WITH upserted AS (
    INSERT INTO public.kakao_account AS account (
      kakao_id,
      name,
      email,
      profile_image_url
    )
    VALUES (
      normalized_kakao_id,
      normalized_name,
      normalized_email,
      normalized_image
    )
    ON CONFLICT (kakao_id) DO UPDATE
    SET
      name = EXCLUDED.name,
      email = COALESCE(EXCLUDED.email, account.email),
      profile_image_url = COALESCE(EXCLUDED.profile_image_url, account.profile_image_url)
    RETURNING
      account.id,
      account.name,
      account.email,
      account.profile_image_url
  )
  SELECT
    'saved'::text,
    upserted.id,
    upserted.name,
    upserted.email,
    upserted.profile_image_url
  FROM upserted;
END;
$$;

COMMENT ON FUNCTION public.upsert_kakao_account(text, text, text, text) IS
  '카카오 회원번호로 계정을 만들거나 프로필을 갱신한다.';

REVOKE ALL ON FUNCTION public.upsert_kakao_account(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_kakao_account(text, text, text, text) TO anon, authenticated, service_role;

ALTER TABLE public.kakao_account ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.kakao_account FROM anon, authenticated;
GRANT ALL ON TABLE public.kakao_account TO service_role;

COMMIT;
