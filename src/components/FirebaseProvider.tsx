'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase';

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Analytics'i initialize et (sadece client-side)
    void initAnalytics();
  }, []);

  return <>{children}</>;
}
