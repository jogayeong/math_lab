const serviceRoleKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

/** JWT(eyJ) 또는 신규 secret 키만 서버 전용 키로 쓴다. */
function isServiceRoleKey(key: string | undefined): key is string {
  if (!key) {
    return false;
  }

  if (key.startsWith("your-") || key.includes("://")) {
    return false;
  }

  return key.startsWith("eyJ") || key.startsWith("sb_secret_");
}

export function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL이 없습니다.");
  }

  return url;
}

export function getSupabasePublishableKey() {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!key) {
    throw new Error("Supabase publishable key가 없습니다.");
  }

  return key;
}

/**
 * 서비스 롤 키가 올바른 값일 때만 그 키를 쓴다.
 * 현재 .env.local 값은 URL이라 publishable 키로 대신 접속한다.
 */
export function getSupabaseServerKey() {
  const key = serviceRoleKey();

  if (isServiceRoleKey(key)) {
    return key;
  }

  return getSupabasePublishableKey();
}
