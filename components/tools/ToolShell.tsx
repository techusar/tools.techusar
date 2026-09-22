'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Shield,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Check,
  Share2,
  Copy,
  Info,
  Maximize2,
  Minimize2,
  BookOpen,
  Zap,
  Briefcase,
  Layers,
  ChevronDown,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { ToolItem, ToolCategory } from '@/lib/types';
import { useUser } from '../auth/UserContext';
import { ToolCard } from './ToolCard';
import { copyToClipboard } from '@/lib/utils';
import { getEnrichedToolSEO } from '@/lib/seo/toolSeoHelper';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

interface ToolShellProps {
  tool: ToolItem;
  category?: ToolCategory;
  relatedTools?: ToolItem[];
  relatedToolsList?: ToolItem[];
  children: React.ReactNode;
  onReset?: () => void;
  outputToCopy?: string;
}

export function ToolShell({
  tool,
  category,
  relatedTools,
  relatedToolsList = [],
  children,
  onReset,
  outputToCopy,
}: ToolShellProps) {
  const actualRelatedTools = relatedTools || relatedToolsList;
  const { isFavorited, toggleFavorite, recordRecentTool } = useUser();
  const favorited = isFavorited(tool.slug);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shared, setShared] = useState(false);

  // Record tool history into UserContext & Neon DB
  useEffect(() => {
    if (tool?.slug) {
      recordRecentTool(tool.slug, tool.name, tool.categoryName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.slug]);

  // SEO Content enrichment matching the 600-1200 words structural SEO blueprint
  const seo = getEnrichedToolSEO(tool, category);

  // FAQ open/close state tracking
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCopy = async () => {
    if (!outputToCopy) return;
    const ok = await copyToClipboard(outputToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    await copyToClipboard(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div
      className={`w-full ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-50 dark:bg-[#0A0C10] overflow-y-auto p-3 sm:p-6 md:p-8'
          : 'py-4 sm:py-8 md:py-10'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section 0: Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            { label: tool.categoryName, href: `/categories/${tool.category}` },
            { label: tool.name, current: true },
          ]}
        />

        {/* Section 1: Tool Title + Short Intro (30-60 words) */}
        <header className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-7 md:p-8 shadow-xs dark:shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 sm:gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/categories/${tool.category}`}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400 hover:opacity-80 transition-opacity"
                >
                  {tool.categoryName}
                </Link>

                {tool.type === 'ai' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    Gemini AI Powered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    100% In-Browser Private
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-[#171A21] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  {tool.unlimited ? 'Unlimited Free' : `Free Quota: ${tool.anonymousLimit} uses`}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {tool.name}
              </h1>

              {/* Short intro (30-60 words) */}
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {seo.shortIntro}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 shrink-0 self-start pt-1 sm:pt-0">
              <button
                onClick={() => toggleFavorite(tool.slug)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
                  favorited
                    ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-500 dark:text-rose-400'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
                title={favorited ? 'Remove from favorites' : 'Save to favorites'}
                aria-label="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 dark:fill-rose-400' : ''}`} />
                <span className="hidden sm:inline">{favorited ? 'Favorited' : 'Favorite'}</span>
              </button>

              <button
                onClick={handleShare}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 transition-colors text-xs font-medium flex items-center gap-1.5"
                title="Share tool"
                aria-label="Share tool link"
              >
                {shared ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{shared ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 transition-colors text-xs font-medium flex items-center gap-1.5"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Tool'}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Section 2: Actual Tool UI (Main Focus) */}
        <section aria-label={`${tool.name} Workspace`} className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs dark:shadow-2xl overflow-hidden">
          {children}
        </section>

        {/* Ad Placement: Safely isolated directly below tool workspace */}
        <AdWrapper slot="toolBelow" placement="tool-workspace-below" />

        {/* Section 3: What is this tool? (100-150 words) */}
        <section className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              What is {tool.name}?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {seo.whatIsThis}
          </p>
        </section>

        {/* Section 4 & 5: How to use it (100-200 words) & Key Features/Benefits (100-200 words) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* How to use */}
          <section className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Info className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  How to Use {tool.name}
                </h2>
              </div>
              <ol className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
                {seo.howToUseSteps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">
                    <span className="text-slate-800 dark:text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tip: All keyboard shortcuts and copy functions work offline.</span>
            </div>
          </section>

          {/* Features / Benefits */}
          <section className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Features & Technical Benefits
              </h2>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm">
              {seo.featuresBenefits.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">{item.title}:</strong>{' '}
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Section 6: Examples / Use Cases (100-200 words) */}
        <section className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 md:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Practical Examples & Real-World Use Cases
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How professionals leverage {tool.name} in their daily engineering and production workflows.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {seo.useCases.map((uc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                  <span>{uc.title}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-4">
                  {uc.scenario}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: FAQ (4-8 questions, ~250-500 words) */}
        {seo.faqs.length > 0 && (
          <section className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 md:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprehensive answers regarding {tool.name}, security, limits, and compatibility.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#171A21] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                {seo.faqs.length} FAQs
              </span>
            </div>

            <div className="space-y-3">
              {seo.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#14171F]/60 hover:bg-slate-100 dark:hover:bg-[#171A21] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-cyan-500' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#111318] border-t border-slate-100 dark:border-slate-800/80">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Ad Placement: Bottom of tool content */}
        <AdWrapper slot="toolBottom" placement="tool-content-bottom" />

        {/* Section 8: Related Tools (with Short Descriptions & Links) */}
        {actualRelatedTools.length > 0 && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-500" />
                  <span>Related Online Utilities</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Explore other high-performance tools in {tool.categoryName}.
                </p>
              </div>
              <Link
                href={`/categories/${tool.category}`}
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View all in {tool.categoryName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {actualRelatedTools.slice(0, 3).map((rt) => (
                <ToolCard key={rt.id} tool={rt} />
              ))}
            </div>

            {/* Internal linking to Engineering & Productivity Guides */}
            <div className="mt-4 p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <BookOpen className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Looking for in-depth engineering best practices, tutorials, and performance guides?</span>
              </div>
              <Link
                href="/blog"
                className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline whitespace-nowrap flex items-center gap-1"
              >
                <span>Browse Developer Blog</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
