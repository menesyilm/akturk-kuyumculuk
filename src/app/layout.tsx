import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FirebaseProvider from "@/components/FirebaseProvider";
import LayoutContent from "@/components/LayoutContent";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aktürk Kuyumculuk",
  description: "Kuyumculuk ve mücevherat",
  icons: {
    icon: '/images/logo-no-background.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FirebaseProvider>
          <SmoothScroll />
          <LayoutContent>{children}</LayoutContent>
        </FirebaseProvider>
      </body>
    </html>
  );
}
