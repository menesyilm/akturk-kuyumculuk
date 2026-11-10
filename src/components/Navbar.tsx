'use client';

import Image from 'next/image';
import Link from 'next/link';
import SearchBox from './SearchBox';

const menuItems = [
  { name: 'Bileklik', href: '/urunler/bileklik' },
  { name: 'Kolye', href: '/urunler/kolye' },
  { name: 'Yüzük & Küpe', href: '/urunler/yuzukvekupe' },
  { name: 'Set', href: '/urunler/set' },
  { name: 'Altın Fiyatları', href: '/altin-fiyatlari' },
];

export default function Navbar() {
  return (
    <nav aria-label="Ana menü" className="fixed inset-x-0 top-0 z-50 hidden border-b border-white/15 bg-[#080a09]/88 text-white shadow-[0_12px_40px_rgba(0,0,0,.18)] backdrop-blur-xl lg:block">
      <div className="mx-auto grid h-[5.25rem] max-w-[96rem] grid-cols-[15rem_1fr_17rem] items-center gap-6 px-8 xl:px-12">
        <Link href="/" className="flex w-fit items-center gap-3" aria-label="Aktürk Kuyumculuk ana sayfa">
          <span className="relative h-12 w-12 flex-none">
            <Image src="/images/logo-no-background.png" alt="" fill sizes="48px" className="object-contain" priority />
          </span>
          <span>
            <span className="block font-serif text-[1.05rem] tracking-[0.08em] text-[#e4c982]">AKTÜRK</span>
            <span className="mt-0.5 block text-[0.5rem] uppercase tracking-[0.32em] text-white/45">Kuyumculuk</span>
          </span>
        </Link>

        <div className="flex items-center justify-center gap-5 xl:gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative py-2 text-[0.64rem] font-semibold uppercase tracking-[0.17em] text-white/72 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-[#d8ba74] after:transition-transform hover:text-white hover:after:origin-left hover:after:scale-x-100 xl:text-[0.68rem]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/sertifika" className="text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-white/42 transition-colors hover:text-white/80">
            Ürün Doğrulama
          </Link>
          <SearchBox inputWidth="w-52" iconSize="h-[1.1rem] w-[1.1rem]" />
          <Link
            href="/iletisim"
            className="inline-flex min-h-10 items-center border border-white/28 px-4 py-2 text-[0.58rem] font-bold uppercase tracking-[0.15em] text-white/78 transition-colors hover:border-[#d8ba74] hover:text-[#e3ca8d]"
          >
            İletişim
          </Link>
        </div>
      </div>
    </nav>
  );
}
