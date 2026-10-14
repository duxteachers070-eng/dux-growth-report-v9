export const metadata = {
  title: "DUX 성장 리포트 v9",
  description: "학생의 성장과 다음 학습 계획을 정리하고 학부모와 공유하는 DUX 성장 리포트",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/app-icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
