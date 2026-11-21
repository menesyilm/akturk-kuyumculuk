'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import SearchBox from './SearchBox';

const menuItems = [
  { name: 'Bileklik', href: '/urunler/bileklik' },
  { name: 'Kolye', href: '/urunler/kolye' },
  { name: 'Yüzük ve Küpe', href: '/urunler/yuzukvekupe' },
  { name: 'Set Takım', href: '/urunler/set' },
  { name: 'Altın Fiyatları', href: '/altin-fiyatlari' },
];

type SidebarProps = {
  overlay?: boolean;
};

export default function Sidebar({ overlay = false }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    requestAnimationFrame(() => menuTriggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(
        menuPanelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, mobileMenuOpen]);

  return (
    <>
      <nav aria-label="Mobil menü" className={`${overlay ? 'absolute bg-gradient-to-b from-black/60 to-transparent' : 'fixed border-b border-white/15 bg-[#080a09]/90 shadow-lg backdrop-blur-xl'} inset-x-0 top-0 z-50 text-white lg:hidden`}>
        <div className="flex h-[4.5rem] items-center justify-between px-4 sm:px-7">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Aktürk Kuyumculuk ana sayfa">
            <span className="relative h-11 w-11">
              <Image src="/images/logo-mark.webp" alt="" fill sizes="44px" className="object-contain" />
            </span>
            <span>
              <span className="block font-serif text-base tracking-[0.08em] text-[#e2c77f]">AKTÜRK</span>
              <span className="block text-xs uppercase tracking-[0.22em] text-white/62">Kuyumculuk</span>
            </span>
          </Link>
          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="grid h-11 w-11 place-items-center border border-white/20 text-[#e2c77f] transition-colors hover:border-[#e2c77f]"
            aria-label="Menüyü aç"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobil-yan-menu"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <div
        ref={menuPanelRef}
        id="mobil-yan-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobil-menu-baslik"
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        className={`fixed inset-0 z-[60] bg-[#0a0d0b] text-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[4.5rem] items-center justify-between border-b border-white/12 px-4 sm:px-7">
            <span id="mobil-menu-baslik" className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e0c482]">Menü</span>
            <button ref={closeButtonRef} type="button" onClick={closeMenu} className="grid h-11 w-11 place-items-center border border-white/20 text-[#e0c482]" aria-label="Menüyü kapat">
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-white/12 px-5 py-5 sm:px-8">
            <SearchBox alwaysOpen onResultClick={closeMenu} />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8">
            <div className="divide-y divide-white/12 border-y border-white/12">
              {menuItems.map((item, index) => (
                <Link key={item.name} href={item.href} onClick={closeMenu} className="group flex items-center justify-between py-5">
                  <span className="flex items-baseline gap-4">
                    <span className="font-serif text-sm italic text-[#b7934d]">0{index + 1}</span>
                    <span className="font-serif text-3xl text-white/92 sm:text-4xl">{item.name}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/35 transition-colors group-hover:text-[#e0c482]" />
                </Link>
              ))}
            </div>

            <Link href="/iletisim" onClick={closeMenu} className="mt-7 flex items-center justify-center bg-[#d8ba74] px-5 py-4 text-xs font-bold uppercase tracking-[0.17em] text-[#111411]">
              Bize Ulaşın
            </Link>
            <Link href="/sertifika" onClick={closeMenu} className="mt-5 block text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-white">
              Ürün kaydını doğrula
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
