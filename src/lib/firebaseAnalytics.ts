import type { Analytics } from 'firebase/analytics';
import { app } from '@/lib/firebaseApp';

let analytics: Analytics | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (analytics) return analytics;
  if (typeof window === 'undefined') return null;

  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    if (!(await isSupported())) return null;

    analytics = getAnalytics(app);
    return analytics;
  } catch {
    return null;
  }
}
