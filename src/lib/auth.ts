import { NextAuthOptions } from "next-auth";
import type { Account, Profile, User } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { match } from "ts-pattern";
import { z } from "zod";
import { createPureClient } from "@/lib/supabase/server";

const loginCredentialsSchema = z.object({
  id: z.string().trim().min(1),
  password: z.string().min(1),
});

type AuthenticatedLoginAccount = {
  id: string;
  name: string;
  email: string;
};

type KakaoAccountRow = {
  result_code: string;
  id: string | null;
  name: string | null;
  email: string | null;
  profile_image_url: string | null;
};

type SavedKakaoAccount = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
};

type KakaoUserProfile = Profile & {
  id?: number | string;
  kakao_account?: {
    email?: string | null;
    profile?: {
      nickname?: string | null;
      profile_image_url?: string | null;
    } | null;
  } | null;
  properties?: {
    nickname?: string | null;
    profile_image?: string | null;
  } | null;
};

const optionalText = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * 카카오 프로필에서 회원번호와 표시용 정보를 고른다.
 * 회원번호는 숫자 문자열이 아니면 저장하지 않는다.
 */
function readKakaoIdentity(
  user: User,
  account: Account | null,
  profile: Profile | undefined,
): { kakaoId: string; name: string | null; email: string | null; profileImageUrl: string | null } | null {
  const kakaoProfile = profile as KakaoUserProfile | undefined;
  const kakaoId = account?.providerAccountId || (kakaoProfile?.id != null ? String(kakaoProfile.id) : user.id);

  if (!/^\d{1,32}$/.test(kakaoId)) {
    return null;
  }

  return {
    kakaoId,
    name: optionalText(
      user.name ??
        kakaoProfile?.kakao_account?.profile?.nickname ??
        kakaoProfile?.properties?.nickname,
    ),
    email: optionalText(user.email ?? kakaoProfile?.kakao_account?.email),
    profileImageUrl: optionalText(
      user.image ??
        kakaoProfile?.kakao_account?.profile?.profile_image_url ??
        kakaoProfile?.properties?.profile_image,
    ),
  };
}

/**
 * kakao_account에 카카오 회원을 만들거나 프로필을 갱신한다.
 * 세션 식별자는 카카오 회원번호가 아니라 이 테이블의 id를 쓴다.
 */
async function upsertKakaoAccount(identity: {
  kakaoId: string;
  name: string | null;
  email: string | null;
  profileImageUrl: string | null;
}): Promise<SavedKakaoAccount | null> {
  const supabase = await createPureClient();
  const { data, error } = await supabase.rpc("upsert_kakao_account", {
    p_kakao_id: identity.kakaoId,
    p_name: identity.name,
    p_email: identity.email,
    p_profile_image_url: identity.profileImageUrl,
  });

  if (error) {
    console.error("kakao_account 저장에 실패했습니다.", error.message);
    const message = error.message.includes("upsert_kakao_account")
      ? "카카오 계정 함수가 데이터베이스에 없습니다. Supabase SQL Editor에서 0005 마이그레이션을 실행해 주세요."
      : "카카오 계정을 저장하지 못했습니다.";
    throw new Error(message);
  }

  const account = (Array.isArray(data) ? data[0] : data) as KakaoAccountRow | null;
  if (!account?.id || !account.name) {
    return null;
  }

  return match(account.result_code)
    .with("saved", () => ({
      id: account.id as string,
      name: account.name as string,
      email: account.email,
      image: account.profile_image_url,
    }))
    .otherwise(() => null);
}

/**
 * login_account 테이블의 bcrypt 해시와 비밀번호를 데이터베이스에서 비교한다.
 * 해시 원문은 애플리케이션으로 가져오지 않는다.
 */
async function findLoginAccount(
  loginId: string,
  password: string,
): Promise<AuthenticatedLoginAccount | null> {
  const supabase = await createPureClient();
  const { data, error } = await supabase.rpc("authenticate_login_account", {
    p_login_id: loginId,
    p_password: password,
  });

  if (error) {
    console.error("login_account 조회에 실패했습니다.", error.message);
    return null;
  }

  const account = Array.isArray(data) ? data[0] : data;
  if (!account?.id || !account.name || !account.email) {
    return null;
  }

  return {
    id: account.id,
    name: account.name,
    email: account.email,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" }
      },
      async authorize(credentials) {
        const parsed = loginCredentialsSchema.safeParse({
          id: credentials?.id,
          password: credentials?.password,
        });

        if (!parsed.success) {
          return null;
        }

        return findLoginAccount(parsed.data.id, parsed.data.password);
      }
    }),
    // 제공자를 여기에 추가할 수 있습니다.
  ],
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "kakao") {
        return true;
      }

      const identity = readKakaoIdentity(user, account, profile);
      if (!identity) {
        return false;
      }

      const saved = await upsertKakaoAccount(identity);
      if (!saved) {
        return false;
      }

      user.id = saved.id;
      user.name = saved.name;
      user.email = saved.email;
      user.image = saved.image;
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      session.user.name = typeof token.name === "string" ? token.name : null;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
