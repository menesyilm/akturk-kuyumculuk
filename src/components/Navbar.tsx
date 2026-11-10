'use client';

import Image from 'next/image';
import Link from 'next/link';
import SearchBox from './SearchBox';

const menuItems = [
  { name: 'Bileklik', href: '/urunler/bileklik' },
  { name: 'Kolye', href: '/urunler/kolye' },
  { name: 'Yüzük & Küpe', href: '/urunler/yuzukvekupe' },
  { name: 'Set Takım', href: '/urunler/set' },
];

export default function Navbar() {
  return (
    <nav aria-label="Ana menü" className="fixed inset-x-0 top-0 z-50 hidden border-b border-white/12 bg-[#06100e]/90 text-white backdrop-blur-xl lg:block">
      <div className="mx-auto grid h-24 max-w-[104rem] grid-cols-[1fr_auto_1fr] items-center gap-8 px-10 xl:px-16">
        <Link href="/" className="flex w-fit items-center gap-3" aria-label="Aktürk Kuyumculuk ana sayfa">
          <span className="relative h-12 w-12 flex-none">
            <Image src="/images/logo-no-background.png" alt="" fill sizes="48px" className="object-contain" priority />
          </span>
          <span>
            <span className="block font-serif text-[1.05rem] tracking-[0.08em] text-[#e4c982]">AKTÜRK</span>
            <span className="mt-0.5 block text-[0.5rem] uppercase tracking-[0.32em] text-white/45">Kuyumculuk</span>
          </span>
        </Link>

        <div className="flex items-center justify-center gap-7 xl:gap-10">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative py-2 text-[0.69rem] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-[#d8ba74] after:transition-transform hover:text-white hover:after:origin-left hover:after:scale-x-100"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-5">
          <Link href="/altin-fiyatlari" className="text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-white/52 transition-colors hover:text-white/85">
            Altın Fiyatları
          </Link>
          <SearchBox inputWidth="w-52" iconSize="h-5 w-5" />
          <Link
            href="/iletisim"
            className="inline-flex min-h-11 items-center border border-white/24 px-5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.17em] text-white/78 transition-colors hover:border-[#d8ba74] hover:text-[#e3ca8d]"
          >
            İletişim
          </Link>
        </div>
      </div>
    </nav>
  );
}
