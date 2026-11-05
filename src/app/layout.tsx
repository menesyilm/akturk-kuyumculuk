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
  metadataBase: new URL("https://www.akturkkuyumculuk.com"),
  title: {
    default: "Aktürk Kuyumculuk | El İşçiliği Altın Takılar",
    template: "%s | Aktürk Kuyumculuk",
  },
  description: "El işçiliği altın bileklik, kolye, yüzük, küpe ve set koleksiyonları. Ürün sertifikanızı internetten doğrulayın.",
  keywords: ["Aktürk Kuyumculuk", "altın takı", "el işçiliği", "bileklik", "kolye", "yüzük", "küpe", "altın set"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Aktürk Kuyumculuk",
    title: "Aktürk Kuyumculuk | El İşçiliği Altın Takılar",
    description: "El işçiliği altın takı koleksiyonlarını inceleyin ve ürün sertifikanızı doğrulayın.",
    images: [{ url: "/images/logo-with-name.png", alt: "Aktürk Kuyumculuk" }],
  },
  robots: {
    index: true,
    follow: true,
  },
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
