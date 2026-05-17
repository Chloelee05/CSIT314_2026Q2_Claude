'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes

async function isSessionValid(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/check', { method: 'GET' });
    return res.ok;
  } catch {
    return true; // network error — don't redirect on flaky connections
  }
}

export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const valid = await isSessionValid();
      if (!valid) {
        router.push('/login');
      }
    }

    // Check when user returns to tab after being away
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        check();
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    const interval = setInterval(check, CHECK_INTERVAL_MS);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(interval);
    };
  }, [router]);

  return null;
}
