'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  Code2,
  Image as ImageIcon,
  Calculator,
  AlignLeft,
  FileText,
  Layers,
  Zap,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { INITIAL_TOOLS } from '@/lib/data/initial-data';
import { trackClientEvent } from '@/lib/analytics/tracker';

const CATEGORY_ICON_MAP: Record<string, any> = {
  'developer-tools': Code2,
  'image-tools': ImageIcon,
  calculators: Calculator,
  'text-tools': AlignLeft,
  'pdf-tools': FileText,
  'ai-tools': Sparkles,
};

interface NavbarSearchBarProps {
  tools?: ToolItem[];
  className?: string;
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function NavbarSearchBar({
  tools = INITIAL_TOOLS,
  className = '',
  isMobile = false,
  onNavigate,
}: NavbarSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Guarantee tools list is non-empty
  const toolList = useMemo(() => {
    return tools && tools.length > 0 ? tools : INITIAL_TOOLS;
  }, [tools]);

  // Configure Fuse.js fuzzy search engine
  const fuse = useMemo(() => {
    return new Fuse(toolList, {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'aliases', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'description', weight: 0.2 },
        { name: 'categoryName', weight: 0.1 },
      ],
      threshold: 0.4, // Balanced tolerance for typos while keeping relevant hits
      distance: 100,
      ignoreLocation: true,
      minMatchCharLength: 1,
      includeScore: true,
    });
  }, [toolList]);

  // Compute search results using fuzzy search + fallback substring
  const searchResults: ToolItem[] = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Default to curated popular/featured tools when query is empty
      return toolList.filter((t) => t.popular || t.featured).slice(0, 7);
    }

    const fuseHits = fuse.search(trimmed);
    const fuzzyTools = fuseHits.map((hit) => hit.item);

    // Also check direct case-insensitive substring to guarantee zero false-negatives
    const lower = trimmed.toLowerCase();
    const directHits = toolList.filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.categoryName.toLowerCase().includes(lower) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(lower)) ||
        t.aliases?.some((a) => a.toLowerCase().includes(lower))
    );

    // Merge without duplicates, preserving ranking from Fuse
    const seen = new Set<string>();
    const combined: ToolItem[] = [];

    for (const item of fuzzyTools) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }

    for (const item of directHits) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }

    return combined.slice(0, 8);
  }, [query, fuse, toolList]);

  const safeIndex = searchResults.length > 0 ? Math.min(selectedIndex, searchResults.length - 1) : 0;

  // Scroll active item into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-index="${safeIndex}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [safeIndex, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Global keyboard shortcuts (Cmd+K, Ctrl+K, or / to focus search)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Don't trigger if user is already typing in an input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleSelectTool = (tool: ToolItem) => {
    trackClientEvent('search_result_click', {
      toolSlug: tool.slug,
      toolName: tool.name,
      metadata: { query, source: 'navbar_search_bar' },
    });
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
    if (onNavigate) {
      onNavigate();
    }
    router.push(`/tools/${tool.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[safeIndex]) {
        handleSelectTool(searchResults[safeIndex]);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400 transition-colors" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={isMobile ? 'Search tools by name, description...' : 'Search tools by name or description...'}
          className="w-full pl-9 pr-16 py-2 bg-slate-100/90 hover:bg-slate-200/60 dark:bg-[#12151D] dark:hover:bg-[#161A23] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-[#0D0F14] focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner font-sans"
          aria-label="Global Tool Search"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Clear Button or Keyboard Shortcut Pill */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            !isMobile && (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1A1D26] border border-slate-200 dark:border-slate-700/80 rounded shadow-xs select-none">
                ⌘K
              </kbd>
            )
          )}
        </div>
      </div>

      {/* Dropdown Results Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 mt-2 z-50 rounded-2xl bg-white dark:bg-[#11141A] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn ${
            isMobile ? 'w-full' : 'sm:min-w-[480px] lg:min-w-[540px]'
          }`}
        >
          {/* Dropdown Header */}
          <div className="px-3.5 py-2.5 bg-slate-50/90 dark:bg-[#171B24]/90 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {query.trim() ? (
                <>
                  <span>Matching Tools</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-[10px]">
                    {searchResults.length}
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Popular & Recommended Tools</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {query.trim() ? 'Fuzzy search active' : `${toolList.length} total tools`}
            </span>
          </div>

          {/* Results List */}
          <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-850">
            {searchResults.length > 0 ? (
              searchResults.map((tool, idx) => {
                const isSelected = idx === safeIndex;
                const CategoryIcon = CATEGORY_ICON_MAP[tool.category] || (tool.type === 'ai' ? Sparkles : Layers);

                return (
                  <div
                    key={tool.id || tool.slug}
                    data-index={idx}
                    onClick={() => handleSelectTool(tool)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`pt-1 first:pt-0 cursor-pointer`}
                  >
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-950 dark:text-white'
                          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            tool.type === 'ai'
                              ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                              : isSelected
                              ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <CategoryIcon className="w-4 h-4" />
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {tool.name}
                            </span>
                            {tool.type === 'ai' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                                AI
                              </span>
                            )}
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                              {tool.categoryName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Indicator */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isSelected && (
                          <span className="hidden sm:flex items-center gap-1 text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
                            <span>Open</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        )}
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isSelected
                              ? 'text-cyan-600 dark:text-cyan-400 translate-x-0.5'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 px-4 text-center">
                <Search className="w-6 h-6 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  No tools found matching &quot;{query}&quot;
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Try searching for keywords like &quot;PNG&quot;, &quot;GST&quot;, &quot;JSON&quot;, &quot;Counter&quot;, or &quot;WebP&quot;.
                </p>
              </div>
            )}
          </div>

          {/* Dropdown Footer Shortcuts */}
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-[#0E1015] border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[9px] mr-1">↑↓</kbd>
                navigate
              </span>
              <span>
                <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[9px] mr-1">↵</kbd>
                open
              </span>
              <span>
                <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[9px] mr-1">esc</kbd>
                close
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/tools');
              }}
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-sans font-medium"
            >
              Browse all {toolList.length} tools →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
