'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Sparkles,
  Search,
  ShieldCheck,
  Zap,
  Cpu,
  X,
  Lock,
  Flame,
} from 'lucide-react';

interface Hero3DTypographyProps {
  toolsCount: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

const QUICK_TRENDING_TAGS = [
  { label: 'JSON Formatter', slug: 'json-formatter' },
  { label: 'QR Generator', slug: 'qr-code-generator' },
  { label: 'Image Compressor', slug: 'image-compressor' },
  { label: 'Password Generator', slug: 'password-generator' },
  { label: 'Regex Tester', slug: 'regex-tester' },
  { label: 'AI Text Rewriter', slug: 'ai-text-rewriter' },
];

export function Hero3DTypography({
  toolsCount,
  searchQuery,
  onSearchChange,
}: Hero3DTypographyProps) {
  const prefersReducedMotion = useReducedMotion();

  // Staggered smooth animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div className="relative pt-8 sm:pt-14 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-visible">
      {/* Soft Ambient Background Halos (No Dots) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[320px] sm:h-[420px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/5 to-indigo-500/5 dark:from-cyan-500/20 dark:via-teal-500/10 dark:to-indigo-600/15 blur-[100px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[550px] h-[240px] sm:h-[320px] bg-gradient-to-bl from-blue-500/5 via-cyan-400/8 to-emerald-400/5 dark:from-blue-600/10 dark:via-cyan-400/15 dark:to-emerald-400/10 blur-[90px] pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      {/* Main Content Stagger Wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative"
      >
        {/* Top Feature Capsule Pill */}
        <motion.div variants={itemVariants} className="inline-block">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-50/90 dark:bg-[#131620]/90 border border-cyan-200/90 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-md select-none transition-transform hover:scale-[1.02] duration-200">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-3 h-3" />
            </span>
            <span className="tracking-wide">Next-Gen Web Utilities by TechUsar · Free &amp; Private Forever</span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-600 text-white shadow-xs">
              v2.4
            </span>
          </div>
        </motion.div>

        {/* Primary Animated Gradient Headline */}
        <motion.div variants={itemVariants} className="relative max-w-4xl mx-auto">
          <h1
            id="hero-title"
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] select-none"
          >
            <span className="text-slate-900 dark:text-white">Developer &amp; AI Tools. </span>
            <span className="inline-block bg-gradient-to-r from-cyan-600 via-teal-500 via-blue-500 via-indigo-600 to-cyan-600 dark:from-cyan-300 dark:via-teal-200 dark:via-blue-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent animate-gradient-flow">
              Fast, Private, Instant.
            </span>
          </h1>
        </motion.div>

        {/* Subtitle Typography */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Over <span className="font-semibold text-slate-900 dark:text-white">{toolsCount}+ free online tools</span> for developers, SEO, images, AI, calculators, productivity, business and everyday tasks. Everything runs in-browser with zero data retention.
        </motion.p>

        {/* Interactive Search Command Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-8 max-w-2xl mx-auto relative group"
        >
          {/* Glowing halo behind search input on hover/focus */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/15 via-teal-500/15 to-blue-600/15 dark:from-cyan-500/25 dark:via-teal-500/25 dark:to-blue-600/25 rounded-3xl blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500 pointer-events-none" />

          <div className="relative flex items-center bg-white/95 dark:bg-[#12151E]/95 border border-slate-200/90 dark:border-slate-700/80 hover:border-cyan-500/70 dark:hover:border-cyan-500/60 focus-within:border-cyan-600 dark:focus-within:border-cyan-400 rounded-2xl shadow-[0_4px_24px_-4px_rgba(15,23,42,0.07),0_1px_2px_rgba(15,23,42,0.03)] dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-200">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-400 ml-4 pointer-events-none" />
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${toolsCount}+ utilities (e.g. JSON, Password, QR, PDF, Base64, AI)...`}
              className="w-full pl-3.5 pr-24 py-4 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />
            
            {/* Clear Button if Query Active */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1.5 mr-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Keyboard Command Badge */}
            <div className="mr-3 flex items-center gap-1.5 pointer-events-none select-none">
              <kbd className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0B0D12] border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Quick Trending Filter Pills */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 flex-wrap text-xs select-none">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1 mr-1">
              <Flame className="w-3 h-3 text-amber-500" />
              Trending:
            </span>
            {QUICK_TRENDING_TAGS.map((tag) => (
              <button
                key={tag.slug}
                type="button"
                onClick={() => onSearchChange(tag.label)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/90 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200/80 dark:border-slate-700/60 hover:border-cyan-300 dark:hover:border-cyan-700/60 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:shadow-none transition-all duration-150 cursor-pointer active:scale-95"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Feature Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-600 dark:text-slate-400 select-none"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-[#11141D]/60 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] dark:shadow-none backdrop-blur-md transition-all hover:border-emerald-500/40 hover:scale-[1.02] duration-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">100% In-Browser Privacy</span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-[#11141D]/60 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] dark:shadow-none backdrop-blur-md transition-all hover:border-amber-500/40 hover:scale-[1.02] duration-200">
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Zero Latency &amp; Offline Ready</span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-[#11141D]/60 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] dark:shadow-none backdrop-blur-md transition-all hover:border-cyan-500/40 hover:scale-[1.02] duration-200">
            <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Gemini 2.5 Flash Pro Engine</span>
          </div>
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-[#11141D]/60 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)] dark:shadow-none backdrop-blur-md transition-all hover:border-indigo-500/40 hover:scale-[1.02] duration-200">
            <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Zero Server Data Logging</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
