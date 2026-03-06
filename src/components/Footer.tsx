'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Clock, Instagram } from 'lucide-react';

export default function Footer() {
  const panelVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
  };

  return (
    <footer className="bg-brand-dark-gray">
      <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-10 border-t-2 border-brand-gold">

        {/* Ana Layout: Sol sütun + Sağ sütun */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 md:items-stretch">

          {/* SOL SÜTUN: Logo → Çalışma+Bize Ulaşın → Linkler */}
          <div className="flex flex-col justify-between flex-1">

            {/* Logo + Mobil Sosyal İkonlar (aynı satır) */}
            <motion.div variants={panelVariants} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "100px" }}
              className="flex items-center justify-between md:justify-start"
            >
              <Link href="/">
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                  <Image src="/images/logo-no-background.png" alt="Aktürk Kuyumculuk" fill className="object-contain" />
                </div>
              </Link>

              {/* Sosyal İkonlar - Sadece Mobil/Tablet */}
              <div className="flex md:hidden gap-3">
                <a href="https://www.instagram.com/akturk_kuyumculuk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-brand-dark-gray hover:bg-brand-gold hover:text-brand-black transition-colors rounded-sm">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://wa.me/905312831934" target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-brand-dark-gray hover:bg-brand-gold hover:text-brand-black transition-colors rounded-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Çalışma Saatleri + Bize Ulaşın */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 lg:gap-14">
              <motion.div variants={panelVariants} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "100px" }} className="space-y-1.5">
                <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-brand-gold">Çalışma Saatleri</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-brand-light-gray text-[10px] sm:text-xs lg:text-sm">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span><strong className="text-brand-gold">Hafta İçi:</strong> 09:00 - 17:00</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-brand-light-gray text-[10px] sm:text-xs lg:text-sm">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span><strong className="text-brand-gold">Cumartesi:</strong> 10:00 - 16:00</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-brand-light-gray text-[10px] sm:text-xs lg:text-sm">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span><strong className="text-brand-gold">Pazar:</strong> Kapalı</span>
                  </div>
                </div>
              </motion.div>


            </div>

            {/* Neden Aktürk + Üretim */}
            <motion.div variants={panelVariants} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "100px" }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-6 my-3"
            >
              <Link href="/neden-akturk-kuyumculuk" className="text-brand-gold hover:opacity-75 transition-opacity text-xs sm:text-sm lg:text-base xl:text-lg font-bold">
                Neden Aktürk Kuyumculuk?
              </Link>
              <Link href="/uretim" className="text-brand-gold hover:opacity-75 transition-opacity text-xs sm:text-sm lg:text-base xl:text-lg font-bold">
                Üretim
              </Link>
            </motion.div>

          </div>

          {/* SAĞ SÜTUN: Sosyal ikonlar üstte + Harita altta (justify-between) */}
          <div className="flex flex-col justify-between gap-3 w-full md:w-[280px] lg:w-[320px] xl:w-[380px] md:self-stretch">

            {/* Sosyal İkonlar - Sadece Desktop */}
            <motion.div variants={panelVariants} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "100px" }}
              className="hidden md:flex justify-end gap-3 sm:gap-4"
            >
              <a href="https://www.instagram.com/akturk_kuyumculuk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
                className="p-2 sm:p-2.5 lg:p-3 bg-brand-dark-gray hover:bg-brand-gold hover:text-brand-black transition-colors rounded-sm">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              </a>
              <a href="https://wa.me/905312831934" target="_blank" rel="noopener noreferrer"
                className="p-2 sm:p-2.5 lg:p-3 bg-brand-dark-gray hover:bg-brand-gold hover:text-brand-black transition-colors rounded-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </motion.div>

            {/* Harita */}
            <motion.div variants={panelVariants} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "100px" }}
              className="flex flex-col gap-1.5 flex-1"
            >
              <div className="relative z-0 flex-1 min-h-[130px] sm:min-h-[150px] ring-2 ring-brand-gold overflow-hidden rounded-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!3m2!1str!2str!4v1761934374301!5m2!1str!2str!6m8!1m7!1s0xgzFnIueSh2jJgg3B_kAQ!2m2!1d41.00639157716616!2d39.72607529600786!3f188.43383259017082!4f-16.690193043676757!5f0.43279263888731334"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0"
                />
              </div>
              <div className="flex items-start gap-1.5 text-brand-light-gray text-[10px] sm:text-xs lg:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                <span>Kemerkaya Mah. Kunduracılar Cad. Çarşı Sok. Çarşı Han Kat:2 Ortahisar / Trabzon</span>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Alt Kısım - Copyright */}
        <div className="border-t border-brand-gold/30 mt-6 sm:mt-8 lg:mt-10 xl:mt-12 pt-4 sm:pt-6 lg:pt-8 text-center">
          <p className="text-brand-light-gray text-[10px] sm:text-xs lg:text-sm xl:text-base">
            © {new Date().getFullYear()} Aktürk Kuyumculuk. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
