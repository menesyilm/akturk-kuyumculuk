"use client";

import { useCallback, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface CurrencyData {
  buying: number;
  selling: number;
  change: number;
}

interface GoldData {
  dolar: CurrencyData;
  euro: CurrencyData;
  gramAltin: CurrencyData;
  ingilizSterlini: CurrencyData;
  euroDolar: CurrencyData;
  onsAltin: CurrencyData;
  gumus: CurrencyData;
  altinGumus: CurrencyData;
}

// Cache yapılandırmasını bileşen dışında tanımlayarak
// değişmeyen sabitleri dependency dizilerinden çıkarıyoruz
const CACHE_KEY = 'gold_prices_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 saat (3.600.000 ms)

export default function AltinFiyatlari() {
  const [goldData, setGoldData] = useState<GoldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoldPrices = useCallback(async (forceRefresh = false) => {
    try {
      // Cache kontrolü - forceRefresh yoksa cache'i kontrol et
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = new Date().getTime();
          
          // Cache 1 saatten yeniyse, API'ye istek atmadan cache'i kullan
          if (now - timestamp < CACHE_DURATION) {
            console.log('Using cached gold data');
            setGoldData(data);
            setLoading(false);
            return;
          }
        }
      }

      // Cache yoksa veya eski ise API'den çek
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gold-prices');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Fiyatlar yüklenemedi');
      }
      
      const data = await response.json();
      console.log('Fetched fresh gold data from API');
      
      // Veriyi state'e kaydet
      setGoldData(data);
      const now = new Date();
      
      // localStorage'a kaydet
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: now.getTime()
      }));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoldPrices();
    const interval = setInterval(() => fetchGoldPrices(true), CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchGoldPrices]);

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '0.00';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercentage = (percent: number) => {
    if (!percent || isNaN(percent)) return '%0.00';
    return `%${percent > 0 ? '+' : ''}${percent.toFixed(2)}`;
  };

  return (
    <div className="bg-brand-black pt-5 pt-10 lg:pt-15 pb-8 sm:pb-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Başlık */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          className="text-xl sm:text-xl lg:text-3xl xl:text-4xl font-bold text-brand-gold text-center mb-6 sm:mb-8"
        >
          ALTIN FİYATLARI
        </motion.h1>

        {/* Fiyat Tablosu - Boş */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <div className="bg-brand-dark-gray border border-brand-medium-gray overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-gold/20 to-brand-gold/10 border-b border-brand-gold/30 p-4">
              <div className="grid grid-cols-4 gap-4 text-xs sm:text-sm font-semibold text-brand-light-gray">
                <div>PİYASA ÖZETİ</div>
                <div className="text-center">ALIŞ</div>
                <div className="text-center">SATIŞ</div>
                <div className="text-center">DEĞIŞIM</div>
              </div>
            </div>

            {/* İçerik */}
            <div className="divide-y divide-brand-medium-gray/30">
              {loading && !goldData ? (
                <div className="p-8 text-center text-brand-medium-gray">
                  <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p>Fiyatlar yükleniyor...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-400">
                  <p className="mb-2">{error}</p>
                  <button
                    onClick={() => fetchGoldPrices(true)}
                    className="mt-4 px-4 py-2 bg-brand-gold text-brand-black rounded hover:bg-brand-gold/80 transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              ) : goldData ? (
                <>
                  {/* DOLAR */}
                  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-brand-medium-gray/10 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-light-gray text-sm sm:text-base">DOLAR</div>
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.dolar.buying)}
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.dolar.selling)}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
                        goldData.dolar.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {goldData.dolar.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercentage(goldData.dolar.change)}
                      </span>
                    </div>
                  </div>

                  {/* EURO */}
                  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-brand-medium-gray/10 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-light-gray text-sm sm:text-base">EURO</div>
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.euro.buying)}
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.euro.selling)}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
                        goldData.euro.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {goldData.euro.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercentage(goldData.euro.change)}
                      </span>
                    </div>
                  </div>

                  {/* GRAM ALTIN */}
                  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-brand-medium-gray/10 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-light-gray text-sm sm:text-base">GRAM ALTIN</div>
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.gramAltin.buying)}
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.gramAltin.selling)}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
                        goldData.gramAltin.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {goldData.gramAltin.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercentage(goldData.gramAltin.change)}
                      </span>
                    </div>
                  </div>

                  {/* İNGİLİZ STERLİNİ */}
                  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-brand-medium-gray/10 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-light-gray text-sm sm:text-base">İNGİLİZ STERLİNİ</div>
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.ingilizSterlini.buying)}
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.ingilizSterlini.selling)}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
                        goldData.ingilizSterlini.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {goldData.ingilizSterlini.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercentage(goldData.ingilizSterlini.change)}
                      </span>
                    </div>
                  </div>

                  {/* EURO DOLAR */}
                  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-brand-medium-gray/10 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-light-gray text-sm sm:text-base">EURO DOLAR</div>
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ${formatPrice(goldData.euroDolar.buying)}
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ${formatPrice(goldData.euroDolar.selling)}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
                        goldData.euroDolar.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {goldData.euroDolar.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercentage(goldData.euroDolar.change)}
                      </span>
                    </div>
                  </div>

                  {/* ONS ALTIN */}
                  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-brand-medium-gray/10 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-light-gray text-sm sm:text-base">ONS ALTIN</div>
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.onsAltin.buying)}
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.onsAltin.selling)}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
                        goldData.onsAltin.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {goldData.onsAltin.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercentage(goldData.onsAltin.change)}
                      </span>
                    </div>
                  </div>

                  {/* GÜMÜŞ */}
                  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-brand-medium-gray/10 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-light-gray text-sm sm:text-base">GÜMÜŞ</div>
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.gumus.buying)}
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.gumus.selling)}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
                        goldData.gumus.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {goldData.gumus.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercentage(goldData.gumus.change)}
                      </span>
                    </div>
                  </div>

                  {/* ALTIN GÜMÜŞ */}
                  <div className="grid grid-cols-4 gap-4 p-4 hover:bg-brand-medium-gray/10 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-light-gray text-sm sm:text-base">ALTIN GÜMÜŞ</div>
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.altinGumus.buying)}
                    </div>
                    <div className="text-center font-mono text-brand-light-gray text-sm sm:text-base">
                      ₺{formatPrice(goldData.altinGumus.selling)}
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1 text-sm sm:text-base font-semibold ${
                        goldData.altinGumus.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {goldData.altinGumus.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercentage(goldData.altinGumus.change)}
                      </span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
        
        {/* Bilgi Notu */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 bg-brand-gold/30 border border-brand-gold p-4 rounded"
        >
          <p className="text-xs text-white leading-relaxed">
            <span className="font-semibold text-brand-gold">Not:
              </span> Bu sayfadaki fiyatlar anlık piyasa verilerine dayanmaktadır. 
            Gerçek alış-satış fiyatları için mağazamızı ziyaret edebilir veya bizimle iletişime geçebilirsiniz.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
