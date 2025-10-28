import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SettingPageButton from "../../components/SettingPageButton";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "シフトカレンダー",
  description: "シフト管理とプライベートの予定管理を統合したWebアプリケーションです。ユーザーは勤務先の設定、シフトの登録、プライベートの予定をこのWebアプリケーション1つで管理できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/calendar" className="flex items-center gap-2">
            <h1 className="header text-3xl sm:text-4xl">シフトカレンダー</h1>
          </Link>
          <nav className="flex items-center"><SettingPageButton /></nav>
        </header>
        {children}
      </body>
    </html>
  );
}
