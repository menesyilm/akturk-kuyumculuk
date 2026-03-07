'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

const panelVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen lg:min-h-[calc(125vh-7.5rem)] bg-brand-black flex items-center">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 pt-5 lg:pt-10 pb-5 lg:pb-10">
        {/* İki Sütun Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 lg:items-stretch">

          {/* Sol: Harita */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col"
          >
            <div className="relative z-0 w-full h-[280px] sm:h-[380px] lg:h-[55vh] ring-2 ring-brand-gold overflow-hidden rounded-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1str!2str!4v1761934374301!5m2!1str!2str!6m8!1m7!1s0xgzFnIueSh2jJgg3B_kAQ!2m2!1d41.00639157716616!2d39.72607529600786!3f188.43383259017082!4f-16.690193043676757!5f0.43279263888731334"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </motion.div>

          {/* Sağ: Adres Bilgileri */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col justify-center gap-6"
          >
            {/* Konum Başlığı */}
            <div className="flex items-center gap-4">
              <div className="w-1 self-stretch bg-brand-gold rounded-full" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                Trabzon, Ortahisar
              </h2>
            </div>

            {/* Adres */}
            <div className="flex items-start gap-3 text-brand-light-gray text-sm md:text-base lg:text-lg">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-brand-gold" />
              <span>
                Kemerkaya Mah. Kunduracılar Cad. Çarşı Sok.<br />
                Çarşı Han Kat:2 Ortahisar / Trabzon
              </span>
            </div>

            {/* Telefon */}
            <div className="flex items-center gap-3 text-brand-light-gray text-sm md:text-base lg:text-lg">
              <Phone className="w-5 h-5 flex-shrink-0 text-brand-gold" />
              <a
                href="tel:+905312831934"
                className="hover:text-brand-gold transition-colors"
              >
                +90 531 283 19 34
              </a>
              </div>

            {/* Telefon */}
            <div className="flex items-center gap-3 text-brand-light-gray text-sm md:text-base lg:text-lg">
              <Phone className="w-5 h-5 flex-shrink-0 text-brand-gold" />
              <a
                href="tel:+904623210668"
                className="hover:text-brand-gold transition-colors"
              >
                +90 462 321 06 68
              </a>
            </div>

            {/* E-posta */}
            <div className="flex items-center gap-3 text-brand-light-gray text-sm md:text-base lg:text-lg">
              <Mail className="w-5 h-5 flex-shrink-0 text-brand-gold" />
              <a
                href="mailto:official@akturkkuyumculuk.com"
                className="hover:text-brand-gold transition-colors"
              >
                official@akturkkuyumculuk.com
              </a>
            </div>

            {/* Yol Tarifi */}
            <div className="mt-2">
              <a
                href="https://maps.google.com/?q=Kemerkaya+Mah.+Kunduraci%C4%B1lar+Cad.+%C3%87ar%C5%9F%C4%B1+Sok.+%C3%87ar%C5%9F%C4%B1+Han+Ortahisar+Trabzon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-brand-gold text-white font-semibold px-6 py-2.5 hover:bg-brand-gold hover:text-black transition-colors rounded-sm text-sm md:text-base"
              >
                Yol Tarifi Al
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
