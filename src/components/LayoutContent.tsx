'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Admin paneli ve login sayfalarında navbar/sidebar/footer gösterme
  const hideNavigation = pathname?.startsWith('/admin') || pathname?.startsWith('/giris');

  return (
    <>
      {!hideNavigation && (
        <>
          {/* Desktop: Navbar */}
          <Navbar />
          {/* Mobile: Sidebar */}
          <Sidebar />
        </>
      )}
      <main className={hideNavigation ? "" : "pt-20 sm:pt-24 lg:pt-30"}>
        {children}
      </main>
      {!hideNavigation && <Footer />}
    </>
  );
}
