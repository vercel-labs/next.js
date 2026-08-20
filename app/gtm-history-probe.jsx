'use client';

import { useEffect, useState } from 'react';

/**
 * Stand-in for Google Tag Manager's "History Change" trigger.
 *
 * gtm.js implements that trigger by monkey-patching window.history.pushState /
 * replaceState. Because gtm.js is loaded asynchronously, it wraps those methods
 * AFTER the Next.js app-router client bundle has been evaluated - which is the
 * exact condition that broke in Next.js 14.0.3.
 */
export default function GtmHistoryProbe() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Delay to emulate the async load of gtm.js.
    const t = setTimeout(() => {
      if (window.__gtmProbeInstalled) return;
      window.__gtmProbeInstalled = true;
      window.dataLayer = window.dataLayer || [];
      window.__gtmHistoryChanges = 0;
      for (const name of ['pushState', 'replaceState']) {
        const original = window.history[name];
        window.history[name] = function () {
          const result = original.apply(this, arguments);
          window.__gtmHistoryChanges++;
          window.dataLayer.push({
            event: 'gtm.historyChange',
            'gtm.historyChangeSource': name,
            'gtm.newUrl': location.href,
          });
          console.log(`[gtm.historyChange] ${name} -> ${location.href}`);
          window.dispatchEvent(new Event('gtm-history-change'));
          return result;
        };
      }
      console.log('[gtm probe] history patched (emulates async gtm.js)');
    }, 300);

    const onChange = () => setCount(window.__gtmHistoryChanges || 0);
    window.addEventListener('gtm-history-change', onChange);
    return () => {
      clearTimeout(t);
      window.removeEventListener('gtm-history-change', onChange);
    };
  }, []);

  return (
    <p>
      gtm.historyChange events: <b id="count">{count}</b>
    </p>
  );
}
