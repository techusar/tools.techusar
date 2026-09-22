import React from 'react';
import { BrandedLoading } from '@/components/ui/BrandedLoading';

export default function BlogPostLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      {/* Main Branded Loader Card */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-14 shadow-xs">
        <BrandedLoading
          title="Loading Engineering Guide"
          description="Fetching article content, syntax-highlighted code samples, and interactive outline..."
        />
      </div>
    </div>
  );
}

