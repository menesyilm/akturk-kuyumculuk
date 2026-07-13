"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

const HAREM_SOCKET_URL = "wss://hrmsocketonly.haremaltin.com:443";

const MARKET_DEFINITIONS = [
  { code: "ALTIN", name: "HAS ALTIN", decimals: 2 },
  { code: "ONS", name: "ONS", decimals: 1 },
  { code: "USDKG", name: "USD/KG", decimals: 0 },
  { code: "EURKG", name: "EUR/KG", decimals: 0 },
  { code: "AYAR22", name: "22 AYAR", decimals: 2 },
  { code: "KULCEALTIN", name: "GRAM ALTIN", decimals: 2 },
  { code: "XAUXAG", name: "ALTIN GÜMÜŞ", decimals: 2 },
  { code: "CEYREK_YENI", name: "YENİ ÇEYREK", decimals: 0 },
  { code: "CEYREK_ESKI", name: "ESKİ ÇEYREK", decimals: 0 },
  { code: "YARIM_YENI", name: "YENİ YARIM", decimals: 0 },
  { code: "YARIM_ESKI", name: "ESKİ YARIM", decimals: 0 },
  { code: "TEK_YENI", name: "YENİ TAM", decimals: 0 },
  { code: "TEK_ESKI", name: "ESKİ TAM", decimals: 0 },
  { code: "ATA_YENI", name: "YENİ ATA", decimals: 0 },
  { code: "ATA_ESKI", name: "ESKİ ATA", decimals: 0 },
  { code: "ATA5_YENI", name: "YENİ ATA5", decimals: 0 },
  { code: "ATA5_ESKI", name: "ESKİ ATA5", decimals: 0 },
  { code: "GREMESE_YENI", name: "YENİ GREMSE", decimals: 0 },
  { code: "GREMESE_ESKI", name: "ESKİ GREMSE", decimals: 0 },
  { code: "AYAR14", name: "14 AYAR", decimals: 2 },
  { code: "GUMUSTRY", name: "GÜMÜŞ TL", decimals: 3 },
  { code: "XAGUSD", name: "GÜMÜŞ ONS", decimals: 2 },
  { code: "GUMUSUSD", name: "GÜMÜŞ USD", decimals: 2 },
  { code: "XPTUSD", name: "PLATİN ONS", decimals: 2 },
  { code: "XPDUSD", name: "PALADYUM ONS", decimals: 2 },
  { code: "PLATIN", name: "PLATİN/USD", decimals: 0 },
  { code: "PALADYUM", name: "PALADYUM/USD", decimals: 0 },
] as const;

interface HaremPrice {
  code: string;
  alis: number | string;
  satis: number | string;
  kapanis: number | string;
  tarih?: string;
  dir?: { alis_dir?: "up" | "down"; satis_dir?: "up" | "down" };
}

interface PriceChangedMessage {
  data?: Record<string, HaremPrice>;
  meta?: { time?: number };
}

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";
type PriceFlash = { direction: "up" | "down"; tick: number };

function toNumber(value: number | string | undefined) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const normalized = value.includes(",")
    ? value.replace(/\./g, "").replace(",", ".")
    : value;
  return Number.parseFloat(normalized) || 0;
}

function formatPrice(value: number | string | undefined, decimals: number) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(toNumber(value));
}

function getChange(price?: HaremPrice) {
  if (!price) return 0;
  const close = toNumber(price.kapanis);
  return close > 0 ? ((toNumber(price.satis) - close) / close) * 100 : 0;
}

export default function AltinFiyatlari() {
  const [prices, setPrices] = useState<Record<string, HaremPrice>>({});
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [priceFlashes, setPriceFlashes] = useState<Record<string, PriceFlash>>({});

  useEffect(() => {
    const socket = io(HAREM_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
    });

    socket.on("connect", () => setConnectionState("connected"));
    socket.on("disconnect", () => setConnectionState("disconnected"));
    socket.on("connect_error", () => setConnectionState("error"));
    socket.on("price_changed", (message: PriceChangedMessage) => {
      if (!message?.data) return;
      setPrices((current) => ({ ...current, ...message.data }));
      setPriceFlashes((current) => {
        const next = { ...current };
        const tick = Date.now();

        Object.values(message.data ?? {}).forEach((price, index) => {
          const direction = price.dir?.satis_dir;
          if (direction === "up" || direction === "down") {
            next[price.code] = { direction, tick: tick + index };
          }
        });

        return next;
      });
      const sourceTime = message.meta?.time;
      setUpdatedAt(sourceTime ? new Date(sourceTime < 10_000_000_000 ? sourceTime * 1000 : sourceTime) : new Date());
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const status = useMemo(() => {
    if (connectionState === "connected") return { label: "Canlı", color: "text-emerald-400" };
    if (connectionState === "connecting") return { label: "Bağlanıyor", color: "text-amber-400" };
    return { label: "Bağlantı kesildi · yeniden deneniyor", color: "text-red-400" };
  }, [connectionState]);

  return (
    <main className="min-h-screen bg-brand-black pb-12 pt-10 lg:pb-16 lg:pt-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden border border-brand-medium-gray bg-brand-dark-gray shadow-2xl"
        >
          <div className="flex flex-col gap-2 bg-brand-black px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <h1 className="text-lg font-bold text-brand-gold sm:text-xl lg:text-2xl">
              ALTIN FİYATLARI
            </h1>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className={`flex items-center gap-1.5 font-semibold ${status.color}`}>
                <Radio className={connectionState === "connected" ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
                {status.label}
              </span>
              <span className="text-brand-medium-gray">
                {updatedAt ? `Son güncelleme: ${updatedAt.toLocaleTimeString("tr-TR")}` : "Veri bekleniyor"}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-3 border-b border-brand-gold/30 bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 px-4 py-3 text-xs font-semibold text-brand-light-gray sm:text-sm">
                <div>PİYASA</div>
                <div className="text-right">ALIŞ</div>
                <div className="text-right">SATIŞ</div>
                <div className="text-right">FARK</div>
              </div>

              <div className="divide-y divide-brand-medium-gray/30">
                {MARKET_DEFINITIONS.map((definition) => {
                  const price = prices[definition.code];
                  const change = getChange(price);
                  const isUp = change >= 0;
                  const flash = priceFlashes[definition.code];

                  return (
                    <motion.div
                      key={`${definition.code}-${flash?.tick ?? 0}`}
                      initial={flash ? {
                        backgroundColor: flash.direction === "up"
                          ? "rgba(16, 185, 129, 0.42)"
                          : "rgba(239, 68, 68, 0.42)",
                      } : { backgroundColor: "rgba(0, 0, 0, 0)" }}
                      animate={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] items-center gap-3 px-4 py-3 hover:bg-brand-gold/5 sm:py-4"
                    >
                      <div>
                        <div className="text-sm font-bold text-brand-light-gray sm:text-base">{definition.name}</div>
                        <div className="text-[10px] text-brand-medium-gray sm:text-xs">{definition.name}</div>
                      </div>
                      <div className="text-right font-mono text-sm text-brand-light-gray sm:text-base">
                        {price ? formatPrice(price.alis, definition.decimals) : "—"}
                      </div>
                      <div className="text-right font-mono text-sm text-brand-light-gray sm:text-base">
                        {price ? formatPrice(price.satis, definition.decimals) : "—"}
                      </div>
                      <div className={`flex items-center justify-end gap-1 text-sm font-semibold sm:text-base ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                        {price ? (
                          <>
                            {isUp ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                            %{change.toFixed(2)}
                          </>
                        ) : "—"}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-6 border border-brand-gold bg-brand-gold/20 p-4">
          <p className="text-xs leading-relaxed text-white">
            <span className="font-semibold text-brand-gold">Not: </span>
            Fiyatlar canlı piyasa yayınından anlık olarak gösterilir ve bilgi amaçlıdır. Gerçek alış-satış fiyatları için mağazamızı ziyaret edebilir veya bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}
