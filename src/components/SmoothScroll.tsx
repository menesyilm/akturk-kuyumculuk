'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      duration: 1.1,
      stopInertiaOnNavigate: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
