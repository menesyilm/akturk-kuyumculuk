'use client';

import { useState } from 'react';
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

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav aria-label="Mobil menü" className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#080a09]/90 text-white shadow-lg backdrop-blur-xl lg:hidden">
        <div className="flex h-[4.5rem] items-center justify-between px-4 sm:px-7">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Aktürk Kuyumculuk ana sayfa">
            <span className="relative h-11 w-11">
              <Image src="/images/logo-no-background.png" alt="" fill sizes="44px" className="object-contain" priority />
            </span>
            <span>
              <span className="block font-serif text-base tracking-[0.08em] text-[#e2c77f]">AKTÜRK</span>
              <span className="block text-[0.44rem] uppercase tracking-[0.3em] text-white/45">Kuyumculuk</span>
            </span>
          </Link>
          <button
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
        id="mobil-yan-menu"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-[60] bg-[#0a0d0b] text-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[4.5rem] items-center justify-between border-b border-white/12 px-4 sm:px-7">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#e0c482]">Menü</span>
            <button type="button" onClick={closeMenu} className="grid h-11 w-11 place-items-center border border-white/20 text-[#e0c482]" aria-label="Menüyü kapat">
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-white/12 px-5 py-5 sm:px-8">
            <SearchBox alwaysOpen onResultClick={closeMenu} />
          </div>

          <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-7 sm:px-8">
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
            <Link href="/sertifika" onClick={closeMenu} className="mt-5 block text-center text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/42 transition-colors hover:text-white/70">
              Ürün kaydını doğrula
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
