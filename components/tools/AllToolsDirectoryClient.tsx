'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Sparkles,
  Shield,
  Layers,
  Star,
  Check,
  Zap,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import { ToolItem, ToolCategory } from '@/lib/types';
import { ToolCard } from '@/components/tools/ToolCard';
import { useUser } from '@/components/auth/UserContext';

interface AllToolsDirectoryClientProps {
  initialTools: ToolItem[];
  categories: ToolCategory[];
}

export function AllToolsDirectoryClient({
  initialTools,
  categories,
}: AllToolsDirectoryClientProps) {
  const { isFavorite, toggleFavorite } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'ai' | 'client'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'newest'>('popular');

  const filteredTools = useMemo(() => {
    let result = [...initialTools];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Filter by Type (AI vs Client)
    if (filterType === 'ai') {
      result = result.filter((t) => t.type === 'ai');
    } else if (filterType === 'client') {
      result = result.filter((t) => t.type !== 'ai');
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.categoryName.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [initialTools, selectedCategory, filterType, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400">
            Complete Directory
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {initialTools.length} Utilities Available
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            100% Free & Ad-Free
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          All Online Tools & AI Utilities
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Search, filter, and discover our complete suite of browser-native web utilities, cryptographic tools, image processors, financial calculators, and Gemini AI assistants.
        </p>

        {/* Search Bar & Fast Filters */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, keyword, tag, or function (e.g., 'json', 'compress', 'qr', 'emi', 'sql')..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 focus:border-cyan-500 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="name">Sort: Alphabetical (A-Z)</option>
                <option value="newest">Sort: Newly Added</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Categories ({initialTools.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.name} ({cat.toolCount})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#14171F] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#20242E] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('ai')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filterType === 'ai'
                  ? 'bg-white dark:bg-[#20242E] text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>AI Tools</span>
            </button>
            <button
              onClick={() => setFilterType('client')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filterType === 'client'
                  ? 'bg-white dark:bg-[#20242E] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Private Browser</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredTools.length}</strong> of{' '}
            {initialTools.length} total utilities
          </span>
          {(selectedCategory !== 'all' || filterType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setFilterType('all');
                setSearchQuery('');
              }}
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Tool Cards */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isBookmarked={isFavorite(tool.id)}
              onToggleBookmark={() => toggleFavorite(tool.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 space-y-4 max-w-md mx-auto p-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No tools found matching your criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Try adjusting your search query, selecting another category, or clearing active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterType('all');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Footer Informational Callout */}
      <div className="bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Can&apos;t find the specific tool you need?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            We build and ship new developer, image, and AI utilities weekly based on community feedback.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs transition-all shrink-0"
        >
          Request a Custom Tool →
        </Link>
      </div>
    </div>
  );
}
