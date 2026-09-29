'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Star,
  ArrowRight,
  Trash2,
  Sparkles,
  Search,
  Layers,
  Shield,
  Download,
} from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { ToolCard } from '@/components/tools/ToolCard';
import { useUser } from '@/components/auth/UserContext';

export function FavoritesClient({ allTools }: { allTools: ToolItem[] }) {
  const { favorites, isFavorite, toggleFavorite, recentTools } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const favoriteTools = useMemo(() => {
    return allTools.filter((t) => favorites.includes(t.id) || favorites.includes(t.slug));
  }, [allTools, favorites]);

  const recentToolItems = useMemo(() => {
    return allTools.filter((t) => recentTools.includes(t.id) || recentTools.includes(t.slug));
  }, [allTools, recentTools]);

  const filteredFavorites = useMemo(() => {
    return favoriteTools.filter((t) => {
      return (
        searchQuery.trim() === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [favoriteTools, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Personal Bookmarks & Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Bookmarked Tools
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Quickly access your pinned utilities, calculators, and AI assistants stored client-side in your local browser session.
          </p>
        </div>

        {favoriteTools.length > 0 && (
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your bookmarks..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Favorites list */}
      {favoriteTools.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Pinned Utilities ({filteredFavorites.length})</span>
            </h2>
            <Link
              href="/tools"
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Browse more tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFavorites.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isBookmarked={true}
                onToggleBookmark={() => toggleFavorite(tool.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-14 text-center rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Bookmarked Tools Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Click the heart or star icon on any tool card across the directory to pin your most-used utilities here for instant one-click access.
          </p>
          <div className="pt-2">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md shadow-cyan-600/20 transition-all"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Recently Used Tools Section */}
      {recentToolItems.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recently Used Tools in this Browser
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {recentToolItems.length} active sessions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentToolItems.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isBookmarked={isFavorite(tool.id)}
                onToggleBookmark={() => toggleFavorite(tool.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
