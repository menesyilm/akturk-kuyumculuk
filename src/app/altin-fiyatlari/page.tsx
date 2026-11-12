"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
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
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const startTableDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !tableScrollRef.current) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: tableScrollRef.current.scrollLeft,
    };
    tableScrollRef.current.setPointerCapture(event.pointerId);
  };

  const moveTableDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !tableScrollRef.current) return;
    tableScrollRef.current.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.startX);
  };

  const stopTableDrag = () => {
    dragState.current.active = false;
  };

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
    <div className="min-h-screen bg-[#f4f0e8] pb-20 text-[#10211e] lg:pb-28">
      <header className="border-b border-[#9b8050]/25 px-5 py-16 sm:px-9 sm:py-20 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-[96rem]">
          <p className="text-[0.64rem] font-bold uppercase tracking-[0.3em] text-[#876d3e]">Canlı Piyasa</p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <h1 className="font-serif text-[3.5rem] leading-none tracking-[-0.04em] sm:text-7xl lg:text-[5.8rem]">Altın fiyatları</h1>
            <p className="max-w-xl text-sm leading-7 text-[#10211e]/58 sm:text-base sm:leading-8 lg:justify-self-end">Piyasa verilerini canlı olarak takip edin. Ürüne özel satış fiyatı için bizimle iletişime geçin.</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[96rem] px-5 pt-10 sm:px-9 sm:pt-14 lg:px-14">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden border border-[#9b8050]/30 bg-brand-dark-gray"
        >
          <div className="flex flex-col gap-2 bg-[#0a1714] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h2 className="text-[0.67rem] font-bold uppercase tracking-[0.22em] text-[#d7bd7c]">
              Canlı fiyat tablosu
            </h2>
            <div className="flex items-center gap-2 text-[10px] sm:gap-3 sm:text-xs lg:text-sm">
              <span className={`flex items-center gap-1.5 font-semibold ${status.color}`}>
                <Radio className={connectionState === "connected" ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
                {status.label}
              </span>
              <span className="text-brand-medium-gray">
                {updatedAt ? `Son güncelleme: ${updatedAt.toLocaleTimeString("tr-TR")}` : "Veri bekleniyor"}
              </span>
            </div>
          </div>

          <div
            ref={tableScrollRef}
            onPointerDown={startTableDrag}
            onPointerMove={moveTableDrag}
            onPointerUp={stopTableDrag}
            onPointerCancel={stopTableDrag}
            className="cursor-grab select-none overflow-x-auto overscroll-x-contain active:cursor-grabbing"
          >
            <div className="min-w-[700px] sm:min-w-[760px]">
              <div className="grid grid-cols-[150px_1fr_1fr_0.8fr] gap-3 border-b border-brand-gold/30 bg-[#4b4842] px-3 py-3 text-[10px] font-semibold text-brand-light-gray sm:grid-cols-[190px_1fr_1fr_0.8fr] sm:px-4 sm:text-xs lg:grid-cols-[1.4fr_1fr_1fr_0.8fr] lg:text-sm">
                <div className="sticky left-0 z-40 -my-3 -ml-3 flex items-center border-r-2 border-brand-dark-gray bg-[#4b4842] pl-3 shadow-[6px_0_10px_rgba(0,0,0,0.28)] sm:-ml-4 sm:pl-4">PİYASA</div>
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
                  const rowStartColor = "rgba(62, 62, 62, 1)";

                  return (
                    <motion.div
                      key={`${definition.code}-${flash?.tick ?? 0}`}
                      initial={{ backgroundColor: rowStartColor }}
                      animate={{
                        backgroundColor: flash
                          ? [rowStartColor, "rgba(62, 62, 62, 1)"]
                          : "rgba(62, 62, 62, 1)",
                      }}
                      transition={flash
                        ? { duration: 1.2, ease: "easeOut" }
                        : { duration: 0 }}
                      className="isolate grid grid-cols-[150px_1fr_1fr_0.8fr] items-center gap-3 px-3 py-3 hover:bg-brand-gold/5 sm:grid-cols-[190px_1fr_1fr_0.8fr] sm:px-4 sm:py-4 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]"
                    >
                      <motion.div
                        initial={{ backgroundColor: rowStartColor }}
                        animate={{
                          backgroundColor: flash
                            ? [rowStartColor, "rgba(62, 62, 62, 1)"]
                            : "rgba(62, 62, 62, 1)",
                        }}
                        transition={flash
                          ? { duration: 1.2, ease: "easeOut" }
                          : { duration: 0 }}
                        className="sticky left-0 z-40 -my-3 -ml-3 flex h-[calc(100%+1.5rem)] flex-col justify-center border-r-2 border-brand-dark-gray pl-3 shadow-[6px_0_10px_rgba(0,0,0,0.28)] sm:-my-4 sm:-ml-4 sm:h-[calc(100%+2rem)] sm:pl-4"
                      >
                        <div className="text-xs font-bold text-brand-light-gray sm:text-sm lg:text-base">{definition.name}</div>
                        <div className="text-[9px] text-brand-medium-gray sm:text-[10px] lg:text-xs">{definition.name}</div>
                      </motion.div>
                      <div className="text-right font-mono text-xs text-brand-light-gray sm:text-sm lg:text-base">
                        {price ? formatPrice(price.alis, definition.decimals) : "—"}
                      </div>
                      <div className="text-right font-mono text-xs text-brand-light-gray sm:text-sm lg:text-base">
                        {price ? formatPrice(price.satis, definition.decimals) : "—"}
                      </div>
                      <div className={`flex items-center justify-end gap-1 text-xs font-semibold sm:text-sm lg:text-base ${isUp ? "text-emerald-400" : "text-red-400"}`}>
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

        <div className="mt-6 border border-[#9b8050]/30 bg-[#eee7dc] p-5">
          <p className="text-xs leading-6 text-[#10211e]/62 sm:text-sm">
            <span className="font-semibold text-[#765a2d]">Bilgilendirme: </span>
            Fiyatlar canlı piyasa yayınından anlık olarak gösterilir ve bilgi amaçlıdır. Gerçek alış-satış fiyatları için mağazamızı ziyaret edebilir veya bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
