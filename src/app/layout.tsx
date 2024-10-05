import type { Metadata } from "next";
import MainWrap from '@/components/layouts/mainWrap/MainWrap';
import '@style/globals.scss';
import { AuthProvider } from '@/contexts/auth/AuthContext';


export async function generateMetadata(): Promise<Metadata> {
  const title = "Minz"
  const description = "장황민 프론트엔드 개발자 포트폴리오 사이트입니다."

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    // alternates: {
    //   canonical: "https://aboutmin.info",
    // },
    // icons: {
    //   icon: "/favicon.png",
    // },
    // openGraph: {
    //   title,
    //   description,
    //   url: "https://aboutmin.info", 
    //   siteName: title,
    //   images: [
    //     {
    //       url: `https://aboutmin.info/api/og?title=${encodeURIComponent(title)}`,
    //       width: 1200,
    //       height: 630,
    //     },
    //   ],
    //   locale: 'ko_KR',
    //   type: 'website',
    // },
    // twitter: {
    //   card: 'summary_large_image',
    //   title,
    //   description,
    //   images: [`https://aboutmin.info/api/og?title=${encodeURIComponent(title)}`],
    // },
    // keywords: ["portfolio", "AboutMin", "portfolio site", "포트폴리오", "포트폴리오 사이트", "프론트엔드 포트폴리오", "어바웃민"],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <MainWrap>
              {children}
          </MainWrap>
        </AuthProvider>
      </body>
    </html>
  );
}
