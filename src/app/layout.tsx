import { ChannelIO } from '@/third-parties/Channelio';
import Clarity from '@/third-parties/Clarity';
import { GoogleAnalytics } from '@next/third-parties/google'
import { GA_MEASUREMENT_ID } from './gtag';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { AuthProvider } from '@/components/auth/auth-provider';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MATH.LAB | 상위 1%로 향하는 수학 알고리즘',
  description:
    '1:1 오답 클리닉과 데이터 기반 학습 관리로 성적 상승을 설계하는 수학학원 MATH.LAB. 강사진, 실적, 레벨 진단을 확인하고 방문 상담을 예약하세요.',
  openGraph: {
    title: 'MATH.LAB | 상위 1%로 향하는 수학 알고리즘',
    description:
      '평균 1.5등급 상승, 명문대 합격률 94%. 개인별 맞춤 수학 성장의 기준, MATH.LAB.',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <ChannelIO />
      <body className={`${montserrat.variable} font-sans antialiased`}>
    <Clarity />
  {/* Google Analytics */}
  <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        <Providers><AuthProvider>{children}</AuthProvider></Providers>
      </body>
    </html>
  );
}
