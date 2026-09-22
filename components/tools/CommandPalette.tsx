'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft, Tag, Layers } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { trackClientEvent } from '@/lib/analytics/tracker';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
}

export function CommandPalette({ isOpen, onClose, tools }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Global keyboard listener for hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event if closed
          window.dispatchEvent(new CustomEvent('techtools:open-search'));
        }
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('techtools:open-search'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTools = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : tools.filter((t) => t.popular || t.featured).slice(0, 8);

  const handleSelect = (tool: ToolItem) => {
    trackClientEvent('search_result_click', {
      toolSlug: tool.slug,
      toolName: tool.name,
      metadata: { query },
    });
    onClose();
    router.push(`/tools/${tool.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 md:pt-20 p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[85dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#171A21]/60 shrink-0">
          <Search className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mr-2.5 sm:mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 40+ utilities (JSON, QR, PDF, compress, hash)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
              if (e.target.value.length > 2) {
                trackClientEvent('search', { metadata: { query: e.target.value } });
              }
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1.5" aria-label="Clear search">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded text-[11px] font-mono bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40 flex-1">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>{query ? 'Matching Tools' : 'Popular Utilities'}</span>
                <span>{filteredTools.length} tools</span>
              </div>
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={tool.id}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-950 dark:text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          tool.type === 'ai'
                            ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                            : 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20'
                        }`}
                      >
                        {tool.type === 'ai' ? <Sparkles className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-semibold text-xs sm:text-sm truncate text-slate-900 dark:text-white">{tool.name}</span>
                          {tool.type === 'ai' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                              AI
                            </span>
                          )}
                          <span className="hidden xs:inline-block px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                            {tool.categoryName}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{tool.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {isSelected && (
                        <div className="hidden sm:flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">
                          <span>Open</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 sm:py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
              <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">No tools found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for &quot;JSON&quot;, &quot;Image&quot;, &quot;Base64&quot;, or &quot;EMI&quot;</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3.5 sm:px-4 py-2.5 bg-slate-50 dark:bg-[#0D0F13] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline">
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">↵</kbd> Select
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px]">TechTools by TechUsar</span>
        </div>
      </div>
    </div>
  );
}
