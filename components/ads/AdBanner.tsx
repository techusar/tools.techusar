'use client';

import React, { useEffect, useRef } from 'react';
import { AD_CONFIG, AdSlotKey } from '@/lib/ad-config';

interface AdBannerProps {
  slot: AdSlotKey;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  const slotId = AD_CONFIG.slots[slot];
  const isAdActive = AD_CONFIG.enabled && AD_CONFIG.client && slotId;

  useEffect(() => {
    if (!isAdActive || pushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = adsbygoogle;
        pushedRef.current = true;
      }
    } catch (e) {
      console.warn('AdSense push notice:', e);
    }
  }, [isAdActive]);

  // If monetization is not active or slot ID is missing, collapse cleanly
  if (!isAdActive) {
    return null;
  }

  return (
    <div
      className={`w-full my-6 text-center overflow-hidden transition-all ${className}`}
      aria-label="Advertisement"
    >
      <div className="text-[10px] tracking-wider uppercase text-slate-400 dark:text-slate-500 font-mono mb-1.5 select-none">
        Advertisement
      </div>
      <div className="min-h-[90px] sm:min-h-[100px] flex items-center justify-center bg-slate-50/50 dark:bg-[#111318]/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-2">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px', width: '100%' }}
          data-ad-client={AD_CONFIG.client}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
