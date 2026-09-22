'use client';

import React, { useEffect, useRef } from 'react';
import { AD_CONFIG, AdSlotKey } from '@/lib/ad-config';

export type AdPlacementType =
  | 'tool-workspace-below'
  | 'tool-content-bottom'
  | 'blog-mid'
  | 'blog-bottom'
  | 'category-bottom'
  | 'in-feed'
  | 'custom';

export interface AdWrapperProps {
  slot: AdSlotKey;
  placement?: AdPlacementType;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
  minHeight?: string;
  showPlaceholder?: boolean;
}

const PLACEMENT_STYLES: Record<AdPlacementType, { container: string; inner: string; defaultMinHeight: string }> = {
  'tool-workspace-below': {
    container: 'w-full my-6 sm:my-8 clear-both',
    inner: 'min-h-[100px] sm:min-h-[120px] max-w-4xl mx-auto',
    defaultMinHeight: 'min-h-[100px]',
  },
  'tool-content-bottom': {
    container: 'w-full my-8 pt-4 clear-both',
    inner: 'min-h-[120px] sm:min-h-[140px] max-w-4xl mx-auto',
    defaultMinHeight: 'min-h-[120px]',
  },
  'blog-mid': {
    container: 'w-full my-8 py-2 clear-both',
    inner: 'min-h-[120px] sm:min-h-[140px] max-w-3xl mx-auto',
    defaultMinHeight: 'min-h-[120px]',
  },
  'blog-bottom': {
    container: 'w-full my-8 pt-4 clear-both',
    inner: 'min-h-[120px] sm:min-h-[140px] max-w-3xl mx-auto',
    defaultMinHeight: 'min-h-[120px]',
  },
  'category-bottom': {
    container: 'w-full my-10 clear-both',
    inner: 'min-h-[100px] sm:min-h-[120px] max-w-5xl mx-auto',
    defaultMinHeight: 'min-h-[100px]',
  },
  'in-feed': {
    container: 'w-full my-6 clear-both',
    inner: 'min-h-[100px] max-w-5xl mx-auto',
    defaultMinHeight: 'min-h-[100px]',
  },
  'custom': {
    container: 'w-full my-4 clear-both',
    inner: 'min-h-[90px] w-full',
    defaultMinHeight: 'min-h-[90px]',
  },
};

/**
 * AdWrapper - Modular container for display ad placeholders & active AdSense units.
 * Engineered for safety & zero interference with core tool utilities and reader layout:
 * - Isolated stacking context (z-index & pointer-events isolation)
 * - Layout containment to prevent Cumulative Layout Shift (CLS)
 * - Safe fallback handling when AdSense client is unconfigured or blocked
 * - Compliant semantic labeling per AdSense guidelines
 */
export function AdWrapper({
  slot,
  placement = 'custom',
  format = 'auto',
  className = '',
  label = 'Advertisement',
  minHeight,
  showPlaceholder = true,
}: AdWrapperProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  const slotId = AD_CONFIG.slots[slot];
  const isAdActive = Boolean(AD_CONFIG.enabled && AD_CONFIG.client && slotId);

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
      console.warn('AdWrapper script push notice:', e);
    }
  }, [isAdActive]);

  // If ads are not active and placeholder is explicitly disabled, collapse cleanly without occupying space
  if (!isAdActive && !showPlaceholder) {
    return null;
  }

  const placementConfig = PLACEMENT_STYLES[placement] || PLACEMENT_STYLES.custom;
  const heightClass = minHeight || placementConfig.defaultMinHeight;

  return (
    <aside
      className={`relative isolate select-none transition-all ${placementConfig.container} ${className}`}
      aria-label={label}
      role="complementary"
    >
      {/* Visual boundary header to satisfy AdSense compliance & clarify non-tool status */}
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <span className="h-px bg-slate-200 dark:bg-slate-800/80 flex-1 max-w-[80px]" />
        <span className="text-[10px] tracking-wider uppercase text-slate-400 dark:text-slate-500 font-mono">
          {label}
        </span>
        <span className="h-px bg-slate-200 dark:bg-slate-800/80 flex-1 max-w-[80px]" />
      </div>

      {/* Sandboxed inner ad slot with layout containment */}
      <div
        className={`w-full ${heightClass} ${placementConfig.inner} flex items-center justify-center rounded-2xl bg-slate-50/70 dark:bg-[#111318]/60 border border-slate-200/80 dark:border-slate-800/80 p-3 overflow-hidden pointer-events-auto`}
        style={{ contain: 'paint' }}
      >
        {isAdActive ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', minWidth: '250px', width: '100%' }}
            data-ad-client={AD_CONFIG.client}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        ) : (
          /* Safe, clean non-intrusive placeholder box */
          <div className="flex flex-col items-center justify-center text-center p-4 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
              Sponsored Display Area
            </span>
            <span className="text-[10px] text-slate-400/80 dark:text-slate-600">
              Reserved placeholder slot ({slot})
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AdWrapper;
