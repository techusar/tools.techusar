'use client';

import React, { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  targetSelector?: string;
  className?: string;
}

export function ReadingProgressBar({
  targetSelector = '#blog-article-body',
  className = '',
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const calculateProgress = () => {
      // Find the article element or fallback to the main content container
      const targetElement =
        (document.querySelector(targetSelector) as HTMLElement | null) ||
        (document.querySelector('article') as HTMLElement | null);

      const currentScrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Show progress as soon as user begins scrolling down
      setIsVisible(currentScrollY > 15);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const elementTop = currentScrollY + rect.top;
        const elementHeight = targetElement.offsetHeight;

        // Start point: when article top is near the top of the viewport
        const startPoint = Math.max(0, elementTop - 140);
        // End point: when article bottom reaches the lower half of the viewport
        const endPoint = Math.max(startPoint + 100, elementTop + elementHeight - windowHeight);

        if (currentScrollY <= startPoint) {
          // Subtle proportional progress while reading the header/metadata
          const headerPct = startPoint > 0 ? (currentScrollY / startPoint) * 8 : 0;
          setProgress(Math.max(0, Math.min(8, headerPct)));
        } else if (currentScrollY >= endPoint) {
          // Reached or finished the article
          setProgress(100);
        } else {
          // Reading through the article body: smooth 8% to 100%
          const scrollableDistance = endPoint - startPoint;
          const scrolledInside = currentScrollY - startPoint;
          const articlePct = 8 + (scrolledInside / scrollableDistance) * 92;
          setProgress(Math.min(100, Math.max(0, articlePct)));
        }
      } else {
        // Fallback: document scroll
        const docHeight = document.documentElement.scrollHeight - windowHeight;
        const pct = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
        setProgress(Math.min(100, Math.max(0, pct)));
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial run
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetSelector]);

  const roundedPct = Math.round(progress);

  return (
    <>
      {/* 1. Viewport Top Edge Progress Bar (Fixed at top of screen) */}
      <aside
        id="reading-progress-bar"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={roundedPct}
        className={`fixed top-0 left-0 right-0 z-50 h-[3.5px] bg-slate-200/30 dark:bg-slate-800/40 pointer-events-none transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      >
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 dark:from-cyan-400 dark:via-cyan-300 dark:to-blue-500 transition-[width] duration-100 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Subtle glowing bead at leading edge */}
          {progress > 0 && progress < 100 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-cyan-300 dark:bg-white rounded-full shadow-[0_0_10px_#06b6d4] opacity-95 -mr-1" />
          )}
        </div>
      </aside>

      {/* 2. Sub-Navbar Progress Indicator Bar (Directly below sticky header border) */}
      <div
        aria-hidden="true"
        className={`fixed top-16 left-0 right-0 z-40 h-[2px] bg-transparent pointer-events-none transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-cyan-500/80 via-teal-400/80 to-blue-600/80 dark:from-cyan-400/90 dark:via-cyan-300/90 dark:to-blue-400/90 transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}

