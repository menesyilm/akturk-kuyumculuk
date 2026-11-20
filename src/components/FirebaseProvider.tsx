'use client';

import { useEffect } from 'react';

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Keep Firestore and Auth out of public pages that only need analytics.
    void import('@/lib/firebaseAnalytics')
      .then(({ initAnalytics }) => initAnalytics())
      .catch(() => undefined);
  }, []);

  return <>{children}</>;
}
