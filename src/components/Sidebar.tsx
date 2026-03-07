'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import SearchBox from './SearchBox';

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'BİLEKLİK', href: '/urunler/bileklik' },
    { name: 'KOLYE', href: '/urunler/kolye' },
    { name: 'YÜZÜK VE KÜPE', href: '/urunler/yuzukvekupe' },
    { name: 'SET', href: '/urunler/set' },
    { name: 'ALTIN FİYATLARI', href: '/altin-fiyatlari' },
    { name: 'SERTİFİKA', href: '/sertifika' },
  ];

  return (
    <>
      {/* Mobile Navbar - Sadece mobilde görünür */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 bg-brand-dark-gray border-b-2 border-brand-gold z-50 shadow-2xl shadow-brand-light-gray/50 overflow-hidden">
          {/* Orta Kısım - Logo ve Butonlar */}
        <div className="border-b border-brand-medium-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo (sol) */}
              <Link href="/" className="flex items-center">
                <div className="relative h-16 w-16">
                  <Image
                    src="/images/logo-no-background.png"
                    alt="Aktürk Kuyumculuk"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              

              {/* Caption - Sadece Tablet */}
              <div className="hidden sm:flex flex-1 justify-center overflow-hidden">
                <div className="relative h-88 w-full max-w-88">
                  <Image
                    src="/images/caption-2.png"
                    alt="Caption"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Bize Ulaşın + Hamburger Menu Button (sağ) */}
              <div className="flex items-center gap-2">
                <a
                  href="/iletisim"
                  className="text-xs block btn-primary text-brand-black px-1.5 py-1.5"
                >
                  Bize Ulaşın
                </a>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-brand-gold hover:bg-brand-medium-gray/20 transition-colors"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Menü - Sağdan Açılır */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-full sm:w-80 bg-brand-black border-l-2 border-brand-gold transform transition-transform duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-brand-gold">
            <h2 className="text-brand-gold font-bold text-md">Menü</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-brand-gold hover:bg-brand-medium-gray/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Arama */}
          <div className="px-4 py-3 border-b border-brand-medium-gray">
            <SearchBox
              alwaysOpen
              onResultClick={() => setMobileMenuOpen(false)}
            />
          </div>
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-brand-light-gray hover:text-brand-gold hover:bg-brand-dark-gray  transition-colors font-semibold text-xs"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
