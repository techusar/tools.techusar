import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getCategories, getAllTools } from '@/lib/data/toolsRepository';
import { Layers, ArrowRight, Sparkles, Shield, Code, Image, FileText, Calculator, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Tool Categories - TechTools by TechUsar',
  description:
    'Explore 60+ online tools organized across Developer, AI, Security, Image, Text, and Business categories.',
};

export default async function CategoriesPage() {
  const [categories, allTools] = await Promise.all([
    getCategories(),
    getAllTools(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Taxonomy & Workflows</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Online Tools by Category
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Browse our comprehensive suite of online utilities organized by technical discipline, security function, media processing, and financial calculations.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const catTools = allTools.filter((t) => t.category === cat.slug);
          return (
            <div
              key={cat.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 shadow-sm dark:shadow-xl transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#14171F] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold">
                    {cat.toolCount} utilities
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Popular tools preview in this category */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Featured Utilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {catTools.slice(0, 4).map((t) => (
                      <Link
                        key={t.id}
                        href={`/tools/${t.slug}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#171A21] hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-slate-800 dark:hover:text-cyan-400 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors truncate max-w-[200px]"
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/categories/${cat.slug}`}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-cyan-600 hover:text-white dark:bg-[#14171F] dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-slate-900 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 transition-all shadow-xs"
              >
                <span>View all {cat.toolCount} {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
