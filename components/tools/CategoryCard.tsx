'use client';

import React from 'react';
import Link from 'next/link';
import {
  Code2,
  Sparkles,
  Image as ImageIcon,
  FileText,
  AlignLeft,
  Search,
  Briefcase,
  DollarSign,
  Calculator,
  ArrowLeftRight,
  QrCode,
  Binary,
  CheckCircle2,
  Layers,
  Palette,
  ShieldCheck,
  Clock,
  GraduationCap,
  Zap,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { ToolCategory } from '@/lib/types';

const ICON_MAP: Record<string, any> = {
  Code2,
  Sparkles,
  Image: ImageIcon,
  FileText,
  AlignLeft,
  Search,
  Briefcase,
  DollarSign,
  Calculator,
  ArrowLeftRight,
  QrCode,
  Binary,
  CheckCircle2,
  Layers,
  Palette,
  ShieldCheck,
  Clock,
  GraduationCap,
  Zap,
  Share2,
};

interface CategoryCardProps {
  category: ToolCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = ICON_MAP[category.icon] || Code2;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative bg-white dark:bg-[#111318] hover:bg-slate-50/80 dark:hover:bg-[#171A21] border border-slate-200/90 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-[0_1px_3px_rgba(15,23,42,0.03),0_1px_2px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08),0_2px_6px_-1px_rgba(15,23,42,0.04)] dark:shadow-none dark:hover:shadow-xl dark:hover:shadow-cyan-950/20"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20 flex items-center justify-center transition-colors">
            <IconComponent className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
            {category.toolCount} tools
          </span>
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
        <span>Explore Category</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
