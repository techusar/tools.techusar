'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function triggerNavigationLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app:navigation-start'));
  }
}

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevRouteRef = useRef({ pathname, search: searchParams?.toString() });

  useEffect(() => {
    const barEl = document.getElementById('global-progress-bar');
    const overlayEl = document.getElementById('global-progress-badge-overlay');
    const badgeEl = document.getElementById('global-progress-badge');
    let intervalId: NodeJS.Timeout | null = null;
    let finishTimeoutId: NodeJS.Timeout | null = null;
    let currentProgress = 0;

    const start = () => {
      if (finishTimeoutId) clearTimeout(finishTimeoutId);
      if (intervalId) clearInterval(intervalId);

      if (barEl) {
        barEl.style.transition = 'width 180ms ease-out, opacity 150ms ease-in';
        barEl.style.opacity = '1';
        currentProgress = 25;
        barEl.style.width = '25%';
      }

      if (overlayEl) {
        overlayEl.style.opacity = '1';
      }
      if (badgeEl) {
        badgeEl.style.transform = 'scale(1)';
      }

      intervalId = setInterval(() => {
        if (currentProgress < 85) {
          const diff = (88 - currentProgress) * 0.2;
          currentProgress = Math.min(85, currentProgress + Math.max(1.5, diff));
          if (barEl) {
            barEl.style.width = `${currentProgress}%`;
          }
        }
      }, 100);

      // Failsafe auto-complete after 7 seconds
      finishTimeoutId = setTimeout(() => {
        complete();
      }, 7000);
    };

    const complete = () => {
      if (intervalId) clearInterval(intervalId);
      if (finishTimeoutId) clearTimeout(finishTimeoutId);

      if (barEl) {
        barEl.style.width = '100%';
      }

      if (overlayEl) {
        overlayEl.style.opacity = '0';
      }
      if (badgeEl) {
        badgeEl.style.transform = 'scale(0.95)';
      }

      finishTimeoutId = setTimeout(() => {
        if (barEl) {
          barEl.style.opacity = '0';
        }
        finishTimeoutId = setTimeout(() => {
          if (barEl) {
            barEl.style.width = '0%';
            currentProgress = 0;
          }
        }, 200);
      }, 180);
    };

    // If pathname or searchParams changed, complete the bar
    const currentSearch = searchParams?.toString();
    if (
      prevRouteRef.current.pathname !== pathname ||
      prevRouteRef.current.search !== currentSearch
    ) {
      prevRouteRef.current = { pathname, search: currentSearch };
      complete();
    }

    // Capture user clicks on internal links
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = (e.target as HTMLElement)?.closest?.('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        target.getAttribute('target') === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      try {
        const targetUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (targetUrl.origin === currentUrl.origin) {
          const isSamePage =
            targetUrl.pathname === currentUrl.pathname &&
            targetUrl.search === currentUrl.search;

          if (!isSamePage) {
            start();
          }
        }
      } catch {
        if (href.startsWith('/') && href !== window.location.pathname) {
          start();
        }
      }
    };

    const handlePopState = () => {
      start();
    };

    const handleCustomStart = () => {
      start();
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('app:navigation-start', handleCustomStart);

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('app:navigation-start', handleCustomStart);
      if (intervalId) clearInterval(intervalId);
      if (finishTimeoutId) clearTimeout(finishTimeoutId);
    };
  }, [pathname, searchParams]);

  return (
    <>
      {/* Sleek Top Progress Bar */}
      <div
        id="global-progress-bar-container"
        className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none"
        aria-hidden="true"
      >
        <div
          id="global-progress-bar"
          className="h-[3px] w-0 opacity-0 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 shadow-[0_0_12px_rgba(6,182,212,0.9)] relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/70 blur-[1px]" />
        </div>
      </div>

      {/* Screen-Center Loading Card with Backdrop */}
      <div
        id="global-progress-badge-overlay"
        className="fixed inset-0 z-[99999] pointer-events-none opacity-0 flex items-center justify-center transition-opacity duration-200 bg-slate-950/20 backdrop-blur-[2px]"
        role="status"
        aria-live="polite"
      >
        <div
          id="global-progress-badge"
          className="flex flex-col items-center gap-3 px-7 py-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-transform duration-200 scale-95"
        >
          <div className="relative flex items-center justify-center w-12 h-12">
            {/* Outer subtle glow */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping opacity-60" />
            {/* Spinning indicator */}
            <div className="w-10 h-10 border-[3px] border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_16px_rgba(6,182,212,0.35)]" />
            {/* Center glowing core dot */}
            <div className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Loading...
            </span>
            <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 mt-0.5">
              Please wait
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}

export default NavigationProgressBar;
