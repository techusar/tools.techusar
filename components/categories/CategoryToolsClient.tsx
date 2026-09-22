'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Layers, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { ToolItem, ToolCategory } from '@/lib/types';
import { ToolCard } from '@/components/tools/ToolCard';
import { useUser } from '@/components/auth/UserContext';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

interface CategoryToolsClientProps {
  category: ToolCategory;
  tools: ToolItem[];
}

export function CategoryToolsClient({ category, tools }: CategoryToolsClientProps) {
  const { isFavorite, toggleFavorite } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      return (
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [tools, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {/* Breadcrumb Navigation & Category Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            { label: category.name, current: true },
          ]}
        />
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Categories</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Category Hub • {tools.length} Utilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Search inside this category */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${category.name}...`}
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tools List */}
      {filteredTools.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 px-1 flex items-center justify-between">
            <span>
              Showing <strong>{filteredTools.length}</strong> utilities in this collection
            </span>
            <Link href="/tools" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
              View all utilities →
            </Link>
          </div>

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

          {/* Ad Placement: Bottom of category directory */}
          <AdWrapper slot="categoryBottom" placement="category-bottom" />
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 space-y-3 max-w-md mx-auto">
          <Search className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            No tools match &quot;{searchQuery}&quot;
          </h3>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
          >
            Clear Search Filter
          </button>
        </div>
      )}
    </div>
  );
}
