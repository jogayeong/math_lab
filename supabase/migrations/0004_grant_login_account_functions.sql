-- 이미 적용된 로그인 함수를 publishable 키(anon)에서도 호출할 수 있게 연다.
-- 테이블 자체는 계속 닫아 두고, 비밀번호 해시는 함수 밖으로 나가지 않는다.
-- 재실행해도 오류 없이 통과하도록 작성했다.

BEGIN;

GRANT EXECUTE ON FUNCTION public.authenticate_login_account(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.register_login_account(text, text, text, text) TO anon, authenticated, service_role;

COMMIT;
