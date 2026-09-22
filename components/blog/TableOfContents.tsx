'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  List,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Bookmark,
  Share2,
  Check,
  Hash,
} from 'lucide-react';
import { TocItem } from '@/lib/blog/tableOfContents';

interface TableOfContentsProps {
  items: TocItem[];
  variant?: 'sidebar' | 'mobile';
  className?: string;
  articleTitle?: string;
}

export function TableOfContents({
  items,
  variant = 'sidebar',
  className = '',
  articleTitle,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // IntersectionObserver to detect active heading in viewport
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible heading closest to the top of viewport
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top distance
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: [0, 0.5, 1],
      }
    );

    const elements: HTMLElement[] = [];
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });

    // Also track total reading scroll progress
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(Math.round(progress));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', window.location.pathname);
  };

  const copySectionUrl = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSection(id);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  const activeItem = useMemo(() => {
    return items.find((item) => item.id === activeId) || items[0];
  }, [items, activeId]);

  if (items.length === 0) {
    return null;
  }

  // Mobile / Inline Collapsible Variant
  if (variant === 'mobile') {
    return (
      <div
        className={`bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all ${className}`}
      >
        <button
          onClick={() => setIsOpenMobile((prev) => !prev)}
          className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-[#14171F] transition-colors"
          aria-expanded={isOpenMobile}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <List className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Table of Contents
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  {items.length} sections
                </span>
              </div>
              {activeItem && !isOpenMobile && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  Currently: <span className="text-cyan-600 dark:text-cyan-400 font-medium">{activeItem.text}</span>
                </p>
              )}
            </div>
          </div>
          <span className="text-slate-400 p-1">
            {isOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {isOpenMobile && (
          <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
            <ol className="space-y-1 text-xs sm:text-sm">
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollToHeading(e, item.id)}
                      className={`block py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {item.level === 3 ? (
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        ) : (
                          <Hash className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 opacity-60'}`} />
                        )}
                        <span className="truncate">{item.text}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    );
  }

  // Desktop Sticky Sidebar Variant
  return (
    <aside
      aria-label="Table of Contents"
      className={`sticky top-24 bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-5 transition-all ${className}`}
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <List className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Table of Contents
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {items.length} sections
          </span>
        </div>

        {/* Reading Progress Indicator */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Reading Progress</span>
            <span className="font-mono font-semibold">{scrollProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800" />

      {/* Nav List */}
      <nav className="max-h-[calc(100vh-320px)] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
        <ol className="space-y-1 text-xs">
          {items.map((item) => {
            const isActive = item.id === activeId;
            const isCopied = copiedSection === item.id;

            return (
              <li key={item.id} className={item.level === 3 ? 'pl-3.5' : ''}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToHeading(e, item.id)}
                  className={`group flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  title={item.text}
                >
                  <span className="flex items-center gap-2 min-w-0 pr-1">
                    {item.level === 3 ? (
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          isActive ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400'
                        }`}
                      />
                    ) : (
                      <span
                        className={`w-2 h-2 rounded-xs shrink-0 transition-colors ${
                          isActive ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400'
                        }`}
                      />
                    )}
                    <span className="truncate leading-tight">{item.text}</span>
                  </span>

                  <button
                    onClick={(e) => copySectionUrl(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-opacity"
                    title="Copy direct section link"
                    aria-label={`Copy link for ${item.text}`}
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Share2 className="w-3 h-3" />
                    )}
                  </button>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Footer controls */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium py-1"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Top of Article</span>
        </button>

        <span className="text-[11px] font-mono text-slate-400">
          TechTools Guide
        </span>
      </div>
    </aside>
  );
}
