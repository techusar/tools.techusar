'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Brain,
  Code,
  FileText,
  CheckCircle2,
  Lock,
  Search,
} from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { ToolCard } from '@/components/tools/ToolCard';
import { useUser } from '@/components/auth/UserContext';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

export function AIToolsPageClient({ aiTools }: { aiTools: ToolItem[] }) {
  const { isFavorite, toggleFavorite } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAITools = aiTools.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'AI Utilities', current: true },
        ]}
      />

      {/* Hero Banner */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini 2.5 Flash Engine
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            Stateless & Private
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI-Powered Developer & Content Tools
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Generate complex SQL queries from plain English, summarize long articles into bullet points, polish marketing copy, and debug code instantly with next-gen intelligence.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI utilities (e.g., 'SQL', 'Summarizer', 'Rewriter')..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredAITools.length}</strong> AI utilities
          </span>
          <Link href="/tools" className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold">
            View all utilities →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAITools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isBookmarked={isFavorite(tool.id)}
              onToggleBookmark={() => toggleFavorite(tool.id)}
            />
          ))}
        </div>
      </div>

      {/* AI Architecture & Privacy Guarantee */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-500" />
          Enterprise AI Privacy & Non-Retention Policy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">Zero Model Training</h4>
            <p className="leading-relaxed">
              Your sensitive prompts, schema definitions, and draft articles are never logged, stored in databases, or used to fine-tune AI foundation models.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">Transient Execution</h4>
            <p className="leading-relaxed">
              Requests are streamed via secure TLS 1.3 straight to the Gemini 2.5 Flash inference worker and forgotten the moment response generation terminates.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">Developer Quotas</h4>
            <p className="leading-relaxed">
              Free users receive generous daily AI queries, and Pro subscribers unlock unlimited high-throughput execution for bulk tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
