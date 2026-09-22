'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  ArrowRight,
  TrendingUp,
  Layers,
  Star,
  CheckCircle2,
  HelpCircle,
  Code2,
  Lock,
} from 'lucide-react';
import { ToolItem, ToolCategory } from '@/lib/types';
import { ToolCard } from '@/components/tools/ToolCard';
import { CategoryCard } from '@/components/tools/CategoryCard';
import { useUser } from '@/components/auth/UserContext';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { Hero3DTypography } from '@/components/home/Hero3DTypography';

interface HomeClientProps {
  initialTools: ToolItem[];
  categories: ToolCategory[];
  featuredTools: ToolItem[];
}

export function HomeClient({ initialTools, categories, featuredTools }: HomeClientProps) {
  const { isFavorite, toggleFavorite, recentTools } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');

  // Filter tools
  const filteredTools = useMemo(() => {
    return initialTools.filter((tool) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesTag =
        filterTag === 'all' ||
        (filterTag === 'ai' && (tool.aiPowered || tool.type === 'ai')) ||
        (filterTag === 'popular' && (tool.popular || tool.isPopular)) ||
        (filterTag === 'new' && (tool.isNew || tool.trending));

      return matchesSearch && matchesCat && matchesTag;
    });
  }, [initialTools, searchQuery, selectedCategory, filterTag]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 3D Interactive Mouse-Parallax Hero Section */}
      <Hero3DTypography
        toolsCount={initialTools.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Featured Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Popular & Trending Tools</h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTools.slice(0, 8).map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isBookmarked={isFavorite(tool.id)}
              onToggleBookmark={() => toggleFavorite(tool.id)}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid (Strictly max 5 per row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Browse by Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Ad Placement: Middle of Home between categories and tools directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdWrapper slot="homeMiddle" placement="in-feed" />
      </div>

      {/* Full Tools Directory with Live Filtering */}
      <section id="all-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">All Tools Directory</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Showing {filteredTools.length} of {initialTools.length} utilities
              </p>
            </div>

            {/* Filter tags */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Tools' },
                { id: 'ai', label: '✨ AI Tools' },
                { id: 'popular', label: '🔥 Most Popular' },
                { id: 'new', label: '🆕 New Additions' },
              ].map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setFilterTag(tag.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filterTag === tag.id
                      ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-[#1E232E] text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-700 dark:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#14171F] dark:hover:bg-[#1A1E27] text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Categories ({initialTools.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-slate-900 text-white dark:bg-slate-700 dark:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#14171F] dark:hover:bg-[#1A1E27] text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.name} ({cat.toolCount})
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
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
            <div className="text-center py-16 space-y-3">
              <Search className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">No tools found matching your criteria</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search keyword or active filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFilterTag('all');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why TechTools Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-100/80 dark:bg-gradient-to-b dark:from-[#14171F] dark:to-[#0D0F13] border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Engineered for Speed, Privacy & Precision
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Why thousands of developers and professionals choose TechTools over traditional ad-cluttered sites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Server Data Logging</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Images, JSON objects, passwords, and private tokens are processed in your browser memory. We never store or inspect your payloads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Clean & High-Speed Execution</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No disruptive modal popups, countdown blockers, or sneaky paywalls. Launch any tool and get immediate results.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Next-Gen AI Capabilities</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                State-of-the-art Gemini 2.5 Flash models integrated for SQL query generation, grammar fixing, copy generation, and prompt optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Everything you need to know about using TechTools</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Is TechTools completely free to use?',
              a: 'Yes, all standard tools (JSON formatting, password generation, image compression, calculators, etc.) are 100% free with unlimited usage. AI-powered tools include 5 free daily credits with optional free registration for 50 daily uses.',
            },
            {
              q: 'Does TechTools upload or store my files or data?',
              a: 'No. Almost all tools operate entirely on the client side using WebAssembly and Web APIs. Your images, JSON data, passwords, and cryptographic keys never leave your machine.',
            },
            {
              q: 'Can I bookmark my favorite tools for quick access?',
              a: 'Yes! Click the star icon on any tool card to add it to your Favorites tab. Your favorites are synced securely to your local browser storage and user profile.',
            },
            {
              q: 'How does TechTools differ from other online tool websites?',
              a: 'TechTools is built by TechUsar with a modern, distraction-free interface, zero advertising popups, keyboard shortcuts (⌘K), and instant execution without rate-limiting paywalls.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{item.q}</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
