'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProductGallery from '@/components/ProductGallery';
import { Award, Shield, Clock, Gem, Calculator, Package } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Award,
      title: 'Kalite Garantisi',
      description: 'Tüm ürünlerimiz, yüksek saflıkta altın ve titizlikle seçilmiş malzemeler kullanılarak üretilmiştir.',
    },
    {
      icon: Shield,
      title: 'Güvenilir Hizmet',
      description: 'Uzun yıllara dayanan tecrübemizle, güvenilir ve şeffaf hizmet anlayışı sunuyoruz.',
    },
    {
      icon: Clock,
      title: 'Uzman Ekip',
      description: 'Alanında uzman ustalarımızla, her detayda kusursuz işçilik sağlıyoruz.',
    },
    {
      icon: Gem,
      title: 'Özel Tasarım',
      description: 'Hayalinizdeki tasarımları, size özel ölçü ve detaylarla uzman ekibimiz ve tasarım atölyemiz sayesinde gerçeğe dönüştürüyoruz.',
    },
    {
      icon: Calculator,
      title: 'Şeffaf Fiyatlandırma',
      description: 'Güncel altın fiyatlarına esas alınarak, net ve şeffaf fiyatlandırma yapılır.',
    },
    {
      icon: Package,
      title: 'El İşçiliği',
      description: 'Tüm ürünlerimiz, geleneksel el işçiliği ve modern tekniklerin birleşimiyle özenle hazırlanır.',
    },
  ];

  return (
    <div className="flex flex-col bg-brand-black h-[calc(125vh-5rem)] sm:h-[calc(125vh-6rem)] lg:h-[calc(125vh-7.5rem)] overflow-hidden">
      {/* Ürün Galerisi */}
      <ProductGallery className="flex-1 min-h-0" />

      {/* Özellikler */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.05, margin: "100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-14 py-3 sm:py-4 lg:py-5"
      >
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-4 xl:gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.05, margin: "100px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-brand-gold mb-2 sm:mb-3 lg:mb-4" />
              <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-serif text-white mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm lg:text-base text-brand-light-gray">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
