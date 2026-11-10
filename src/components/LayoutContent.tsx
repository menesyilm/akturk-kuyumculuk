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
  const isHomePage = pathname === '/';

  return (
    <>
      {!hideNavigation && (
        <a href="#ana-icerik" className="skip-link">
          Ana içeriğe geç
        </a>
      )}
      {!hideNavigation && (
        <>
          {/* Desktop: Navbar */}
          <Navbar />
          {/* Mobile: Sidebar */}
          <Sidebar />
        </>
      )}
      <main
        id="ana-icerik"
        tabIndex={-1}
        className={hideNavigation || isHomePage ? '' : 'pt-[4.5rem] lg:pt-[5.25rem]'}
      >
        {children}
      </main>
      {!hideNavigation && <Footer />}
    </>
  );
}
