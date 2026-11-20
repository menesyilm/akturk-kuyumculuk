'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let frameId: number | null = null;

    const stopAnimationFrame = () => {
      if (frameId === null) return;
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    const runAnimationFrame = (time: number) => {
      lenis?.raf(time);
      frameId = requestAnimationFrame(runAnimationFrame);
    };

    const startAnimationFrame = () => {
      if (!lenis || frameId !== null || document.hidden) return;
      frameId = requestAnimationFrame(runAnimationFrame);
    };

    const createLenis = () => {
      if (reducedMotion.matches || lenis) return;
      lenis = new Lenis({
        autoRaf: false,
        anchors: true,
        duration: 1.1,
        stopInertiaOnNavigate: true,
      });
      startAnimationFrame();
    };

    const destroyLenis = () => {
      stopAnimationFrame();
      lenis?.destroy();
      lenis = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimationFrame();
      } else {
        startAnimationFrame();
      }
    };

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        destroyLenis();
      } else {
        createLenis();
      }
    };

    createLenis();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotion.addEventListener('change', handleMotionPreference);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.removeEventListener('change', handleMotionPreference);
      destroyLenis();
    };
  }, []);

  return null;
}
