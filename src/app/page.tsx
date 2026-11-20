'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroMedia from '@/components/HeroMedia';

const collections = [
  {
    name: 'Bileklik',
    href: '/urunler/bileklik',
    image: '/images/instagram/model-bracelet.jpg',
    line: 'Sıra ve ölçü seçiminize göre hazırlanan, bileğe dengeli oturan hasır bileklikler.',
    card: 'lg:col-span-7',
    ratio: 'aspect-[4/5] sm:aspect-[5/4]',
    position: 'object-center',
  },
  {
    name: 'Kolye',
    href: '/urunler/kolye',
    image: '/images/instagram/hasir-model.jpg',
    line: 'Örgünün akışını boyunda taşıyan; tek başına veya setle tamamlanan hasır kolyeler.',
    card: 'lg:col-span-5 lg:pt-24',
    ratio: 'aspect-[4/5]',
    position: 'object-[50%_34%]',
  },
  {
    name: 'Yüzük ve Küpe',
    href: '/urunler/yuzukvekupe',
    image: '/images/instagram/model-ring.jpg',
    line: 'Örgünün karakterini küçük ölçekte sürdüren yüzük ve küpeler.',
    card: 'lg:col-span-5 lg:pt-6',
    ratio: 'aspect-[4/5]',
    position: 'object-center',
  },
  {
    name: 'Set Takım',
    href: '/urunler/set',
    image: '/images/instagram/model-set-crystal.jpg',
    line: 'Aynı örgü ve renk bütünlüğünde bir araya getirilen, içeriği seçilebilir takımlar.',
    card: 'lg:col-span-7 lg:pt-28',
    ratio: 'aspect-[4/5] sm:aspect-[5/4]',
    position: 'object-[50%_34%]',
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#f4f0e8] text-[#10211e]">
      <section
        data-testid="home-hero"
        className="relative flex min-h-[100svh] items-end justify-center overflow-hidden bg-[#071310] text-white"
      >
        <div data-testid="hero-visual" className="absolute inset-0 bg-[#111714]">
          <HeroMedia />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,7,.42)_0%,rgba(2,9,7,.08)_34%,rgba(2,9,7,.18)_56%,rgba(2,9,7,.82)_100%)]" />

        <motion.div
          data-testid="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="relative z-10 mx-auto flex w-full max-w-[62rem] flex-col items-center px-5 pb-16 pt-36 text-center sm:px-10 sm:pb-20 lg:pb-[7vh] lg:pt-44"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ead69f]">
            Trabzon Hasırı · El İşçiliği
          </p>
          <h1 className="mt-5 max-w-[18ch] text-balance font-serif text-[3.15rem] font-normal leading-[0.96] tracking-[-0.04em] text-[#fffdf7] drop-shadow-[0_2px_24px_rgba(0,0,0,.28)] sm:text-[4.5rem] lg:text-[clamp(4.8rem,6vw,7rem)]">
            Güvenle takılır,
            <br />
            nesillerce aktarılır.
          </h1>
          <p className="mt-5 max-w-[38rem] text-base leading-7 text-white/82 sm:text-[1.05rem] sm:leading-8">
            Trabzon hasırını ölçü, sıra ve gram tercihinize göre; elde ve size özel hazırlıyoruz.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-3">
            <Link
              href="/urunler/bileklik"
              className="inline-flex min-h-12 min-w-56 items-center justify-center bg-[#f8f5ee] px-7 py-3 text-sm font-semibold tracking-[0.02em] text-[#0a1714] transition-colors hover:bg-white"
            >
              Koleksiyonları Keşfedin
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex min-h-12 min-w-44 items-center justify-center border border-white/55 bg-black/10 px-7 py-3 text-sm font-semibold tracking-[0.02em] text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/24"
            >
              Bizimle Görüşün
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="border-b border-[#9b8050]/25 px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-20">
          <p className="pt-2 text-sm font-bold uppercase tracking-[0.2em] text-[#876d3e]">El İşçiliği</p>
          <div>
            <h2 className="max-w-[13ch] font-serif text-[2.9rem] leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5.4rem]">
              Her sıra, ustasının elinden geçer.
            </h2>
            <div className="mt-10 grid gap-8 border-t border-[#9b8050]/32 pt-7 md:grid-cols-[1fr_auto] md:items-start">
              <p className="max-w-2xl text-[0.98rem] leading-8 text-[#10211e]/62">
                İnce altın teller, seçilen sıra ve ölçüye göre elde örülür; formu ve dengesi usta eliyle tamamlanır. Bu yüzden her parça, sahibine özgü küçük izler taşır.
              </p>
              <Link href="/uretim" className="inline-flex min-h-11 w-fit items-center border-b border-[#9b8050]/55 text-sm font-bold uppercase tracking-[0.12em] text-[#6f552b] transition-colors hover:border-[#6f552b]">
                Üretim Sürecini Görün
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto max-w-[96rem]">
          <div className="mb-16 flex flex-col gap-6 border-b border-[#9b8050]/30 pb-8 sm:mb-24 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#876d3e]">Koleksiyonlar</p>
              <h2 className="mt-4 font-serif text-5xl tracking-[-0.035em] sm:text-6xl">Aynı miras, farklı ifadeler.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#10211e]/56">Trabzon hasırının bileklikten set takıma uzanan farklı biçimleri.</p>
          </div>

          <div className="grid gap-x-6 gap-y-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28">
            {collections.map((collection) => (
              <Link
                key={collection.name}
                href={collection.href}
                aria-label={`${collection.name} koleksiyonunu inceleyin`}
                className={`group block ${collection.card}`}
              >
                <div className={`relative overflow-hidden bg-[#d9cebd] ${collection.ratio}`}>
                  <Image
                    src={collection.image}
                    alt={`Model üzerinde Aktürk Kuyumculuk ${collection.name} koleksiyonu`}
                    fill
                    quality={90}
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className={`object-cover transition-transform duration-[1300ms] ease-out group-hover:scale-[1.02] ${collection.position}`}
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/8" />
                </div>
                <div className="mt-6 border-b border-[#9b8050]/28 pb-6">
                  <div className="max-w-xl">
                    <h3 className="font-serif text-[2rem] leading-none tracking-[-0.025em] sm:text-[2.5rem]">{collection.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#10211e]/55">{collection.line}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a1714] text-white">
        <div className="mx-auto grid max-w-[118rem] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative aspect-[4/5] min-h-[30rem] overflow-hidden bg-[#1b211e] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[48rem]">
            <Image
              src="/images/instagram/model-set-classic.jpg"
              alt="Model üzerinde Aktürk Kuyumculuk uyumlu kolye, bileklik, yüzük ve küpe seti"
              fill
              quality={90}
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="object-cover object-[50%_48%]"
            />
          </div>
          <div className="flex items-center px-5 py-20 sm:px-12 sm:py-24 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d7bd7c]">Set Takımları</p>
              <h2 className="mt-6 max-w-[11ch] font-serif text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.7rem]">Aynı örgü, eksiksiz bir bütün.</h2>
              <p className="mt-7 max-w-lg text-[0.98rem] leading-8 text-white/60">
                Kolye, bileklik, yüzük ve küpe; aynı örgü, ton ve işçilik çizgisinde bir araya gelir. Set içeriğini tercihinize göre oluşturabilirsiniz.
              </p>
              <Link href="/urunler/set" className="mt-10 inline-flex min-h-13 items-center border border-[#d7bd7c]/65 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.13em] text-[#e4ce98] transition-colors hover:bg-[#d7bd7c] hover:text-[#0a1714]">
                Set Koleksiyonunu İnceleyin
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9b8050]/24 bg-[#f4f0e8] px-5 py-12 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[96rem] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#876d3e]">Ürün Kimliği</p>
            <p className="mt-2 font-serif text-2xl text-[#10211e] sm:text-3xl">Her parçanın kendine ait bir kaydı var.</p>
            <p className="mt-2 text-sm leading-6 text-[#10211e]/56">Ürün kodu üzerinden ayar, gram, üretim tarihi ve sertifika bilgileri doğrulanabilir.</p>
          </div>
          <Link href="/sertifika" className="inline-flex min-h-11 w-fit items-center border-b border-[#9b8050]/55 text-sm font-bold uppercase tracking-[0.12em] text-[#6f552b] transition-colors hover:border-[#6f552b]">
            Ürün Kaydını Sorgulayın
          </Link>
        </div>
      </section>
    </div>
  );
}
