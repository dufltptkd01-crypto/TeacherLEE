import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Teacher.Lee — AI 강사와 함께 배우는 언어 & 코딩",
  description:
    "한국어, 영어, 일본어, 중국어, 프로그래밍을 AI 강사와 실시간으로 배우세요. 맞춤형 피드백, 음성 대화, 코드 리뷰를 제공하는 혁신적 교육 플랫폼.",
  keywords: [
    "AI tutor",
    "Korean learning",
    "TOPIK",
    "JLPT",
    "HSK",
    "learn Korean",
    "AI coding",
    "language learning",
  ],
  openGraph: {
    title: "Teacher.Lee — Your Personal AI Teacher",
    description:
      "Learn Korean, English, Japanese, Chinese & Programming with AI. Anytime, Anywhere.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
