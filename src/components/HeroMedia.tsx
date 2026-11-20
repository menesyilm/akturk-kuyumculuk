'use client';

import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const DESKTOP_VIDEO_QUERY = '(min-width: 768px)';

type ConnectionWithSaveData = {
  saveData?: boolean;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: ConnectionWithSaveData;
};

type HeroMediaProps = {
  videoSrc?: string;
  videoWebmSrc?: string;
  mobileVideoSrc?: string;
  mobileVideoWebmSrc?: string;
  videoPosterSrc?: string;
  fallbackImageSrc?: string;
};

type VideoVariant = 'desktop' | 'mobile';

function playWithoutThrowing(video: HTMLVideoElement) {
  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      // Autoplay can still be rejected by a browser policy. The poster remains visible.
    });
  }
}

export default function HeroMedia({
  videoSrc = '/media/hero/process-to-product-hero.mp4',
  videoWebmSrc = '/media/hero/process-to-product-hero.webm',
  mobileVideoSrc = '/media/hero/mobile-process-to-product-hero.mp4',
  mobileVideoWebmSrc = '/media/hero/mobile-process-to-product-hero.webm',
  videoPosterSrc = '/media/hero/process-to-product-hero.jpg',
  fallbackImageSrc = '/media/hero/process-to-product-hero.jpg',
}: HeroMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIntersectingRef = useRef(true);
  const userPausedRef = useRef(false);
  const [videoVariant, setVideoVariant] = useState<VideoVariant | null>(null);
  const [readyVariant, setReadyVariant] = useState<VideoVariant | null>(null);
  const [failedVariant, setFailedVariant] = useState<VideoVariant | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.(REDUCED_MOTION_QUERY);
    const desktopVideo = window.matchMedia?.(DESKTOP_VIDEO_QUERY);
    const connection = (navigator as NavigatorWithConnection).connection;

    const updateVideoPermission = () => {
      const prefersReducedMotion = reducedMotion?.matches ?? false;
      const isDesktop = desktopVideo?.matches ?? window.innerWidth >= 768;
      const savesData = connection?.saveData ?? false;

      userPausedRef.current = false;
      setVideoVariant(prefersReducedMotion || savesData ? null : isDesktop ? 'desktop' : 'mobile');
    };

    updateVideoPermission();
    reducedMotion?.addEventListener?.('change', updateVideoPermission);
    desktopVideo?.addEventListener?.('change', updateVideoPermission);
    connection?.addEventListener?.('change', updateVideoPermission);

    return () => {
      reducedMotion?.removeEventListener?.('change', updateVideoPermission);
      desktopVideo?.removeEventListener?.('change', updateVideoPermission);
      connection?.removeEventListener?.('change', updateVideoPermission);
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;

    if (!videoVariant || failedVariant === videoVariant || !frame || !video) {
      return;
    }

    const syncPlayback = () => {
      if (document.visibilityState === 'visible' && isIntersectingRef.current && !userPausedRef.current) {
        playWithoutThrowing(video);
      } else {
        video.pause();
      }
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              isIntersectingRef.current = entry?.isIntersecting ?? false;
              syncPlayback();
            },
            { threshold: 0.15 },
          );

    observer?.observe(frame);
    document.addEventListener('visibilitychange', syncPlayback);
    syncPlayback();

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [videoVariant, failedVariant]);

  const videoReady = videoVariant !== null && readyVariant === videoVariant;
  const showVideo = videoVariant !== null && failedVariant !== videoVariant;
  const selectedVideoSrc = videoVariant === 'mobile' ? mobileVideoSrc : videoSrc;
  const selectedVideoWebmSrc = videoVariant === 'mobile' ? mobileVideoWebmSrc : videoWebmSrc;

  const togglePlayback = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (isPlaying) {
      userPausedRef.current = true;
      video.pause();
      return;
    }

    userPausedRef.current = false;
    playWithoutThrowing(video);
  };

  return (
    <div ref={frameRef} className="absolute inset-0">
      <Image
        src={fallbackImageSrc}
        alt="Aktürk Kuyumculuk Trabzon hasırı üretim süreci"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />

      {showVideo ? (
        <video
          key={videoVariant}
          ref={videoRef}
          data-testid="hero-video"
          data-variant={videoVariant}
          poster={videoPosterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onLoadStart={() => setReadyVariant(null)}
          onCanPlay={() => setReadyVariant(videoVariant)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setReadyVariant(null);
            setFailedVariant(videoVariant);
            setIsPlaying(false);
          }}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={selectedVideoWebmSrc} type="video/webm" />
          <source src={selectedVideoSrc} type="video/mp4" />
        </video>
      ) : null}

      {showVideo && videoReady ? (
        <button
          type="button"
          data-testid="hero-playback-toggle"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Videoyu durdur' : 'Videoyu oynat'}
          className="absolute bottom-4 right-4 z-30 grid h-12 w-12 place-items-center border border-white/55 bg-black/20 text-white shadow-[0_8px_30px_rgba(0,0,0,.2)] backdrop-blur-md transition-colors hover:border-white hover:bg-black/38 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 sm:bottom-6 sm:right-6"
        >
          {isPlaying ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="ml-0.5 h-4 w-4" />}
        </button>
      ) : null}
    </div>
  );
}
