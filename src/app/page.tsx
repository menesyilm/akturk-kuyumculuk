'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Circle,
  Fingerprint,
  Gem,
  Package,
  Sparkles,
} from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';

const categories = [
  { name: 'Bileklik', href: '/urunler/bileklik', icon: Circle, detail: 'El işçiliği ve özel örgü modelleri' },
  { name: 'Kolye', href: '/urunler/kolye', icon: Gem, detail: 'Zarif, güçlü ve zamansız tasarımlar' },
  { name: 'Yüzük ve Küpe', href: '/urunler/yuzukvekupe', icon: Sparkles, detail: 'Her ayrıntısı özenle tamamlanan parçalar' },
  { name: 'Set Takım', href: '/urunler/set', icon: Package, detail: 'Birbiriyle uyumlu, eksiksiz koleksiyonlar' },
];

const assurances = [
  {
    number: '01',
    title: 'Kendine özgü üretim',
    description: 'El yapımı her parça, kendi gramı ve fiziksel özellikleriyle tek başına değerlendirilir.',
  },
  {
    number: '02',
    title: 'Şeffaf teknik kayıt',
    description: 'Ayar, gram, ürün içeriği ve satış bilgileri ürüne özel kayıt altında tutulur.',
  },
  {
    number: '03',
    title: 'Doğrulanabilir kimlik',
    description: 'Kazıma kodu ve sertifika kaydı eşleşir; ürün bilgileri internetten doğrulanabilir.',
  },
];

function GoldWeave({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 760 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="gold-thread-flow" d="M-20 352C133 88 258 66 400 224C505 341 601 326 792 48" stroke="url(#thread-a)" strokeWidth="2" />
      <path className="gold-thread-flow gold-thread-flow-delay" d="M-38 393C120 116 264 92 403 248C514 372 628 338 806 90" stroke="url(#thread-b)" strokeWidth="1.25" />
      <path d="M22 432C164 151 276 138 411 278C520 391 643 365 738 199" stroke="#AB8C4E" strokeOpacity="0.2" strokeWidth="0.8" />
      <circle cx="402" cy="247" r="7" fill="#AB8C4E" />
      <circle cx="402" cy="247" r="18" stroke="#AB8C4E" strokeOpacity="0.45" />
      <defs>
        <linearGradient id="thread-a" x1="20" y1="400" x2="740" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AB8C4E" stopOpacity="0" />
          <stop offset="0.48" stopColor="#D9BD80" />
          <stop offset="1" stopColor="#AB8C4E" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="thread-b" x1="15" y1="428" x2="728" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AB8C4E" stopOpacity="0" />
          <stop offset="0.52" stopColor="#AB8C4E" />
          <stop offset="1" stopColor="#AB8C4E" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#080808] text-white">
      <section className="relative isolate min-h-[680px] overflow-hidden border-b border-brand-gold/30 sm:min-h-[720px] lg:min-h-[calc(100vh-8.5rem)]">
        <div className="absolute inset-0">
          <ProductGallery className="h-full min-h-[680px] sm:min-h-[720px] lg:min-h-[calc(100vh-8.5rem)]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.82)_32%,rgba(0,0,0,0.28)_68%,rgba(0,0,0,0.62)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.92)_0%,transparent_45%,rgba(0,0,0,0.18)_100%)]" />
        <GoldWeave className="pointer-events-none absolute -bottom-12 right-[-18rem] z-[1] w-[48rem] opacity-45 sm:right-[-10rem] lg:right-[-2rem]" />

        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-5 pb-36 pt-16 sm:min-h-[720px] sm:px-8 lg:min-h-[calc(100vh-8.5rem)] lg:px-12 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 border border-brand-gold/70 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold backdrop-blur-sm sm:text-sm">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Gelenekten geleceğe altın işçiliği
            </div>
            <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.025em] text-white sm:text-6xl lg:text-7xl xl:text-[6.5rem]">
              El işçiliğinin{' '}
              <span className="mt-2 block text-brand-gold">altın hâli.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8 lg:text-xl">
              Her parça; gramı, ayarı ve kendine özgü detaylarıyla atölyemizde hazırlanır, kayıt altına alınır ve sertifikalandırılır.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/urunler/bileklik"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-brand-gold px-6 py-3 font-bold text-brand-black transition-transform hover:-translate-y-0.5 hover:bg-[#c9aa69]"
              >
                Koleksiyonları İncele <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
              <Link
                href="/sertifika"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/35 px-6 py-3 font-bold text-white backdrop-blur-sm transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                <BadgeCheck aria-hidden="true" className="h-5 w-5" /> Sertifika Doğrula
              </Link>
            </div>
          </motion.div>

          <div className="absolute inset-x-5 bottom-7 grid grid-cols-1 gap-2 sm:inset-x-8 sm:grid-cols-3 sm:gap-3 lg:inset-x-12 lg:max-w-3xl">
            {['El yapımı üretim', 'Kişiye özel kayıt', 'Kodla doğrulanabilir'].map((item) => (
              <div key={item} className="flex items-center gap-2 border border-white/15 bg-black/55 px-4 py-3 text-sm text-white/85 backdrop-blur-md">
                <BadgeCheck aria-hidden="true" className="h-4 w-4 flex-none text-brand-gold" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0d0d] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">Koleksiyonlar</p>
              <h2 className="font-serif text-4xl leading-tight tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">Kendini taşıyan tasarımlar.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-white/55">Her koleksiyon, gösterişli olmaktan önce karakter sahibi olmak için tasarlanır.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <div key={category.name}>
                <Link
                  href={category.href}
                  className="group relative flex min-h-64 flex-col justify-between overflow-hidden border border-white/10 bg-[#151515] p-6 transition-all hover:-translate-y-1 hover:border-brand-gold/80 hover:bg-[#191919]"
                >
                  <span className="absolute right-3 top-0 font-serif text-7xl text-white/[0.035] transition-colors group-hover:text-brand-gold/10">0{index + 1}</span>
                  <category.icon aria-hidden="true" className="relative h-9 w-9 text-brand-gold transition-transform group-hover:scale-110" />
                  <div className="relative">
                    <h3 className="font-serif text-3xl text-white">{category.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">{category.detail}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold">
                      Koleksiyona Git <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="golden-trace-title" className="relative bg-[#f0ece4] px-5 py-20 text-[#15130f] sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <GoldWeave className="pointer-events-none absolute -right-48 top-0 w-[52rem] opacity-35 lg:right-[-5rem]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#80652f]">Aktürk imzası</p>
              <h2 id="golden-trace-title" className="max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-8xl">Altının izi, ürünün kimliği.</h2>
            </div>
            <p className="max-w-2xl border-l border-[#80652f]/35 pl-6 text-lg leading-8 text-black/60 lg:ml-auto lg:text-xl lg:leading-9">
              Bir tasarım yalnızca görünüşüyle değil, nasıl üretildiği ve nasıl kayıt altında tutulduğuyla değer kazanır. Biz her parçanın atölyeden sahibine uzanan izini koruyoruz.
            </p>
          </div>

          <div data-testid="craft-journey" className="mt-16 grid gap-5 lg:mt-24 lg:grid-cols-12 lg:items-stretch">
            <article className="group relative min-h-[460px] overflow-hidden bg-black lg:col-span-5 lg:min-h-[620px]">
              <Image src="/images/gallery/2.jpg" alt="Aktürk Kuyumculuk tasarım aşaması" fill sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <span className="text-sm font-bold tracking-[0.25em] text-brand-gold">01 — TASARIM</span>
                <h3 className="mt-4 font-serif text-4xl">Önce karakteri çizilir.</h3>
                <p className="mt-3 max-w-md leading-7 text-white/70">Modelin oranı, örgüsü ve kullanım dengesi üretimden önce şekillenir.</p>
              </div>
            </article>

            <article className="group relative min-h-[460px] overflow-hidden bg-black lg:col-span-4 lg:mt-20 lg:min-h-[540px]">
              <Image src="/images/gallery/5.jpg" alt="Aktürk Kuyumculuk el işçiliği aşaması" fill sizes="(max-width: 1023px) 100vw, 34vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <span className="text-sm font-bold tracking-[0.25em] text-brand-gold">02 — USTALIK</span>
                <h3 className="mt-4 font-serif text-4xl">Sonra elle tamamlanır.</h3>
                <p className="mt-3 leading-7 text-white/70">Her parça, kendi gramı ve ölçüsüyle ustanın elinden geçer.</p>
              </div>
            </article>

            <article className="relative overflow-hidden border border-[#80652f]/30 bg-[#171510] p-7 text-white sm:p-9 lg:col-span-3 lg:mb-20">
              <Fingerprint aria-hidden="true" className="absolute -right-10 -top-8 h-52 w-52 text-brand-gold/[0.08]" strokeWidth={0.8} />
              <div className="relative flex h-full min-h-[410px] flex-col">
                <span className="text-sm font-bold tracking-[0.25em] text-brand-gold">03 — KİMLİK</span>
                <h3 className="mt-4 font-serif text-4xl leading-tight">Ve yalnızca ona ait bir kayıt oluşur.</h3>
                <div className="my-8 h-px bg-gradient-to-r from-brand-gold to-transparent" />
                <dl className="space-y-5 text-sm">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-white/40">Ürün bilgisi</dt>
                    <dd className="mt-1.5 text-base text-white/90">Gram · Ayar · Ürün içeriği</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-white/40">Fiziksel eşleşme</dt>
                    <dd className="mt-1.5 text-base text-white/90">Ürüne özel kazıma kodu</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-white/40">Dijital doğrulama</dt>
                    <dd className="mt-1.5 flex items-center gap-2 text-base text-white/90"><BadgeCheck aria-hidden="true" className="h-5 w-5 text-brand-gold" /> Sertifika kaydıyla eşleşir</dd>
                  </div>
                </dl>
                <Link href="/sertifika" className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-brand-gold hover:text-white">
                  Ürün kimliğini doğrula <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="assurance-title" className="border-y border-white/10 bg-[#090909] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">Güvence katmanları</p>
              <h2 id="assurance-title" className="font-serif text-4xl leading-tight text-white sm:text-5xl">Değer, ayrıntıda korunur.</h2>
              <p className="mt-5 max-w-md leading-7 text-white/55">Üretimden doğrulamaya kadar bilgiler birbirini tamamlar; sözlü beyan yerine kayıtlı ürün kimliği esas alınır.</p>
            </div>
            <div data-testid="assurance-list" className="border-t border-white/15">
              {assurances.map((item) => (
                <article key={item.number} className="grid gap-3 border-b border-white/15 py-7 sm:grid-cols-[4rem_1fr_1.25fr] sm:items-start sm:gap-6 sm:py-8">
                  <span className="font-serif text-2xl text-brand-gold">{item.number}</span>
                  <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                  <p className="leading-7 text-white/55">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-gold px-5 py-16 text-brand-black sm:px-8 sm:py-20 lg:px-12">
        <Fingerprint aria-hidden="true" className="absolute -bottom-28 -right-16 h-[30rem] w-[30rem] text-black/[0.06]" strokeWidth={0.6} />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em]">
              <BadgeCheck aria-hidden="true" className="h-5 w-5" /> Dijital ürün kimliği
            </div>
            <h2 className="font-serif text-4xl leading-tight tracking-[-0.02em] sm:text-5xl lg:text-6xl">Sertifikanızı saniyeler içinde doğrulayın.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-black/70">Ürün, sertifika, takip veya kazıma kodunu girerek teknik bilgilere ve parça dökümüne ulaşın.</p>
          </div>
          <Link href="/sertifika" className="inline-flex min-h-14 flex-none items-center justify-center gap-2 bg-brand-black px-7 py-4 font-bold text-white transition-transform hover:-translate-y-0.5">
            Sertifika Doğrulamaya Git <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
