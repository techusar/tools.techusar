'use client';

import React from 'react';
import { Wrench } from 'lucide-react';

interface BrandedLoadingProps {
  title?: string;
  description?: string;
  className?: string;
  fullPage?: boolean;
}

export function BrandedLoading({
  title = 'Loading Workspace',
  description = 'Fetching tool and article assets...',
  className = '',
  fullPage = false,
}: BrandedLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading..."
      className={`flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-300 ${
        fullPage ? 'min-h-[75vh]' : 'min-h-[50vh]'
      } ${className}`}
    >
      {/* Spinner & Brand Icon Container */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 blur-xl animate-pulse" />

        {/* Outer Animated Spinner Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-200/80 dark:border-slate-800/80 border-t-cyan-500 dark:border-t-cyan-400 animate-spin" />

        {/* Inner Counter Spinner Ring */}
        <div
          className="absolute inset-2 rounded-full border border-blue-500/20 dark:border-blue-400/20 border-b-blue-500 dark:border-b-blue-400 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.6s' }}
        />

        {/* Branded Center Badge with Pulsing Wrench */}
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
          <Wrench className="w-6 h-6 text-white fill-white/80 animate-pulse" />
        </div>
      </div>

      {/* Brand & Status Text */}
      <div className="space-y-1.5 max-w-sm">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-xs font-extrabold tracking-widest text-slate-900 dark:text-white uppercase font-mono">
            TechTools
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-500/20">
            PRO
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Modern Indeterminate Progress Bar */}
      <div className="w-48 h-1 mt-5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 w-2/3 bg-gradient-to-r from-cyan-500/20 via-cyan-500 to-blue-500 rounded-full animate-indeterminate" />
      </div>

      {/* Accessible screen reader announcement */}
      <span className="sr-only">Loading page content, please wait...</span>
    </div>
  );
}
