'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';

const collections = [
  {
    index: '01',
    name: 'Bileklik',
    href: '/urunler/bileklik',
    image: '/images/instagram/model-bracelet.jpg',
    line: 'Hasırın bilekteki güçlü ve dengeli yorumu.',
    card: 'lg:col-span-7',
    ratio: 'aspect-[4/5] sm:aspect-[5/4]',
    position: 'object-center',
  },
  {
    index: '02',
    name: 'Kolye',
    href: '/urunler/kolye',
    image: '/images/instagram/hasir-model.jpg',
    line: 'Boyunda zarif, akışkan ve belirgin bir çizgi.',
    card: 'lg:col-span-5 lg:pt-24',
    ratio: 'aspect-[4/5]',
    position: 'object-[50%_34%]',
  },
  {
    index: '03',
    name: 'Yüzük ve Küpe',
    href: '/urunler/yuzukvekupe',
    image: '/images/instagram/model-ring.jpg',
    line: 'Işığı küçük ayrıntılarda taşıyan tamamlayıcı parçalar.',
    card: 'lg:col-span-5 lg:pt-6',
    ratio: 'aspect-[4/5]',
    position: 'object-center',
  },
  {
    index: '04',
    name: 'Set Takım',
    href: '/urunler/set',
    image: '/images/instagram/model-set-crystal.jpg',
    line: 'Birlikte tasarlanan, kusursuz uyumlu koleksiyonlar.',
    card: 'lg:col-span-7 lg:pt-28',
    ratio: 'aspect-[4/5] sm:aspect-[5/4]',
    position: 'object-[50%_34%]',
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#f4f0e8] text-[#10211e]">
      <section className="relative bg-[#06110f] text-white">
        <div className="mx-auto grid max-w-[118rem] lg:min-h-[100svh] lg:grid-cols-[0.42fr_0.58fr]">
          <div data-testid="hero-visual" className="relative order-1 aspect-[3/4] overflow-hidden bg-[#141815] sm:aspect-[4/5] lg:order-2 lg:aspect-auto lg:min-h-[100svh]">
            <Image
              src="/images/instagram/model-necklace-long.jpg"
              alt="Model üzerinde uzun Aktürk Kuyumculuk hasır kolye"
              fill
              priority
              unoptimized
              sizes="(max-width: 1023px) 100vw, 58vw"
              className="object-cover object-[50%_53%] lg:object-[50%_54%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(3,10,8,.5)_100%)] lg:bg-[linear-gradient(90deg,rgba(3,12,10,.12)_0%,transparent_20%)]" />
            <p className="absolute bottom-6 left-5 border-l border-[#d7bd7c]/70 pl-4 text-[0.58rem] font-semibold uppercase tracking-[0.25em] text-white/72 sm:bottom-9 sm:left-9 lg:bottom-10 lg:left-10">
              Aktürk Hasır Kolye · Trabzon
            </p>
          </div>

          <div className="relative order-2 flex flex-col justify-center bg-[#06110f] px-5 pb-20 pt-16 sm:px-10 sm:pb-24 lg:order-1 lg:min-h-[100svh] lg:px-14 lg:pb-20 lg:pt-36 xl:px-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="max-w-[41rem]"
            >
              <p className="flex items-center gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#d7bd7c]">
                <span className="h-px w-10 bg-[#c5a665]" /> Aktürk Kuyumculuk · Trabzon
              </p>
              <h1 className="mt-8 max-w-[10ch] font-serif text-[3.45rem] font-normal leading-[0.94] tracking-[-0.045em] text-[#fbf8f0] sm:text-[4.75rem] lg:text-[5rem] xl:text-[5.8rem]">
                Altının yaşayan çizgisi.
              </h1>
              <p className="mt-8 max-w-lg text-[0.98rem] leading-8 text-white/68 sm:text-[1.05rem]">
                Trabzon hasırının köklü tekniği, bugünün oranları ve seçkin ayrıntılarıyla yeniden yorumlanır.
              </p>
              <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                <Link
                  href="/urunler/bileklik"
                  className="group inline-flex min-h-13 w-fit items-center justify-center gap-4 bg-[#f3eee4] px-7 py-3.5 text-[0.69rem] font-bold uppercase tracking-[0.2em] text-[#10211e] transition-colors hover:bg-[#d6bb78]"
                >
                  Koleksiyonları Keşfet
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link href="/iletisim" className="group inline-flex w-fit items-center gap-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.19em] text-white/72 transition-colors hover:text-[#e2cb94]">
                  Bize Ulaşın
                  <span className="block h-px w-8 bg-white/35 transition-all group-hover:w-12 group-hover:bg-[#d6bb78]" />
                </Link>
              </div>
            </motion.div>

            <div className="mt-16 flex items-end justify-between border-t border-white/16 pt-5 lg:absolute lg:inset-x-14 lg:bottom-8 lg:mt-0 xl:inset-x-20">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.25em] text-white/46">El İşçiliği · Zamansız Tasarım</p>
              <span className="hidden items-center gap-3 text-[0.58rem] uppercase tracking-[0.24em] text-white/42 sm:flex">
                Keşfet <ArrowDown aria-hidden="true" className="h-4 w-4 animate-bounce" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9b8050]/25 px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-20">
          <p className="pt-2 text-[0.66rem] font-bold uppercase tracking-[0.3em] text-[#876d3e]">Trabzon Hasırı</p>
          <div>
            <h2 className="max-w-[13ch] font-serif text-[2.9rem] leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5.4rem]">
              Gelenekten kalan ritim, bugüne ait bir duruş.
            </h2>
            <div className="mt-10 grid gap-8 border-t border-[#9b8050]/32 pt-7 md:grid-cols-[1fr_auto] md:items-start">
              <p className="max-w-2xl text-[0.98rem] leading-8 text-[#10211e]/62">
                Her koleksiyon; hasırın karakterini koruyan oranlar, dengeli detaylar ve zamansız bir kullanım anlayışıyla biçimlenir.
              </p>
              <Link href="/neden-akturk-kuyumculuk" className="group inline-flex w-fit items-center gap-3 text-[0.67rem] font-bold uppercase tracking-[0.18em] text-[#6f552b]">
                Aktürk’ü Tanıyın
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto max-w-[96rem]">
          <div className="mb-16 flex flex-col gap-6 border-b border-[#9b8050]/30 pb-8 sm:mb-24 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.3em] text-[#876d3e]">Koleksiyonlar</p>
              <h2 className="mt-4 font-serif text-5xl tracking-[-0.035em] sm:text-6xl">Dört yorum. Tek imza.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#10211e]/56">Gündelik kullanımdan özel anlara uzanan, birbiriyle uyumlu altın seçkiler.</p>
          </div>

          <div className="grid gap-x-6 gap-y-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28">
            {collections.map((collection) => (
              <Link key={collection.name} href={collection.href} className={`group block ${collection.card}`}>
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
                <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-[#9b8050]/28 pb-6">
                  <span className="pt-2 font-serif text-sm italic text-[#94743b]">{collection.index}</span>
                  <div>
                    <h3 className="font-serif text-[2rem] leading-none tracking-[-0.025em] sm:text-[2.5rem]">{collection.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#10211e]/55">{collection.line}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" className="mt-1 h-5 w-5 text-[#755a2e] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
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
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.3em] text-[#d7bd7c]">Set Koleksiyonu</p>
              <h2 className="mt-6 max-w-[10ch] font-serif text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.7rem]">Birlikte tamamlanan çizgi.</h2>
              <p className="mt-7 max-w-lg text-[0.98rem] leading-8 text-white/60">
                Kolye, bileklik, yüzük ve küpede aynı ritmi sürdüren setler; görünümü kalabalıklaştırmadan güçlü bir bütünlük kurar.
              </p>
              <Link href="/urunler/set" className="group mt-10 inline-flex min-h-13 items-center gap-4 border border-[#d7bd7c]/65 px-7 py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.19em] text-[#e4ce98] transition-colors hover:bg-[#d7bd7c] hover:text-[#0a1714]">
                Setleri İnceleyin
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9b8050]/24 bg-[#f4f0e8] px-5 py-12 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[96rem] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.61rem] font-bold uppercase tracking-[0.25em] text-[#876d3e]">Ürün Kaydı</p>
            <p className="mt-2 font-serif text-2xl text-[#10211e] sm:text-3xl">Aktürk ürününüzü koduyla doğrulayın.</p>
          </div>
          <Link href="/sertifika" className="group inline-flex w-fit items-center gap-3 text-[0.67rem] font-bold uppercase tracking-[0.18em] text-[#6f552b]">
            Ürün Kaydını Doğrula
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
