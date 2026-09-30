'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowLeft,
  Layers,
  Sparkles,
  Shield,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  BookOpen,
  Zap,
} from 'lucide-react';
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  const faqs = [
    {
      question: `Are all utilities in ${category.name} completely free?`,
      answer: `Yes, every utility in the ${category.name} collection is 100% free to use. There are no paywalls, mandatory credit card prompts, or hidden fees for standard browser usage.`,
    },
    {
      question: `Is my data private and secure when using ${category.name}?`,
      answer: `Yes. TechTools is engineered with a strict zero-data-retention privacy architecture. All conversions, formatting, calculations, and data processing execute locally in your web browser sandbox using JavaScript and Web APIs. Your input payloads never leave your computer.`,
    },
    {
      question: `Can I use these tools offline?`,
      answer: `Most non-AI utilities in this category function completely offline once the page has loaded in your browser. You can bookmark your favorites for instant access even without an active internet connection.`,
    },
    {
      question: `How frequently are tools in ${category.name} updated?`,
      answer: `Our engineering team continually maintains, benchmarks, and updates all algorithms against the latest web specifications, RFC standards, and modern browser engine performance updates.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 sm:space-y-12">
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
        <section aria-label={`${category.name} Tool Catalog`} className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 px-1 flex items-center justify-between">
            <span>
              Showing <strong>{filteredTools.length}</strong> utilities in this collection
            </span>
            <Link href="/tools" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
              View all 70+ utilities →
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
        </section>
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

      {/* Deep SEO Content Section for Category Hub */}
      <section className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-8">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Why Choose TechTools for {category.name}?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            High-Speed, Privacy-Centric {category.name} for Professionals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Every utility in the {category.name} suite is built from the ground up to solve daily technical challenges with zero friction. We eliminate bloated software installs, intrusive advertisements, and server-side tracking by running computation directly inside your browser engine. Whether you are validating production data structures, debugging code payloads, or crunching financial metrics, our tools deliver mathematical accuracy and instant feedback.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Latency Execution</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculations and transformations occur locally with zero roundtrip delay. Enjoy real-time updates as you type or configure inputs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% In-Browser Privacy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your sensitive tokens, customer details, and business numbers never leave your device or enter external database caches.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Installation & Free</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No npm packages to install, no command-line setup, and no credit card required. Works across all modern browsers and devices.
            </p>
          </div>
        </div>

        {/* Category FAQ Accordion */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions About {category.name}
            </h3>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#14171F]/60 hover:bg-slate-100 dark:hover:bg-[#171A21] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-cyan-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#111318] border-t border-slate-100 dark:border-slate-800">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cross-linking to Developer Blog */}
        <div className="p-5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-500/5 border border-cyan-200/80 dark:border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Want in-depth technical guides, tutorials, and performance benchmarks?</span>
          </div>
          <Link
            href="/blog"
            className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore Engineering Blog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
