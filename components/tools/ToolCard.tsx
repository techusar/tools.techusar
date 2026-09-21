'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  ArrowUpRight,
  Code2,
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
  Braces,
  KeyRound,
  Fingerprint,
  Regex,
  Shield,
  Link as LinkIcon,
  Receipt,
  TrendingUp,
  Landmark,
  Percent,
  Calendar,
  Scale,
  Lock,
  Eye,
  Wand2,
  CheckSquare,
  Code,
  SearchCode,
  Sparkle,
  Mail,
  Minimize2,
  Maximize2,
  CodeXml,
  AppWindow,
  Type,
  CaseSensitive,
  GitCompare,
  FileCode2,
  FileJson,
  Link2,
} from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '../auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const ICON_MAP: Record<string, any> = {
  Sparkles,
  Code2,
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
  Braces,
  KeyRound,
  Fingerprint,
  Regex,
  Shield,
  Link: LinkIcon,
  Receipt,
  TrendingUp,
  Landmark,
  Percent,
  Calendar,
  Scale,
  Lock,
  Eye,
  Wand2,
  CheckSquare,
  Code,
  SearchCode,
  Sparkle,
  Mail,
  Minimize2,
  Maximize2,
  CodeXml,
  AppWindow,
  Type,
  CaseSensitive,
  GitCompare,
  FileCode2,
  FileJson,
  Link2,
};

interface ToolCardProps {
  tool: ToolItem;
  variant?: 'default' | 'compact' | 'featured';
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function ToolCard({ tool, variant = 'default', isBookmarked, onToggleBookmark }: ToolCardProps) {
  const { isFavorited, toggleFavorite } = useUser();
  const favorited = isBookmarked !== undefined ? isBookmarked : isFavorited(tool.slug);

  const IconComponent = ICON_MAP[tool.icon] || (tool.type === 'ai' ? Sparkles : Code2);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark();
    } else {
      toggleFavorite(tool.slug);
    }
  };

  const handleCardClick = () => {
    trackClientEvent('tool_open', {
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
    });
  };

  return (
    <div className="group relative bg-white dark:bg-[#111318] hover:bg-slate-50/80 dark:hover:bg-[#171A21] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-cyan-950/20">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              tool.type === 'ai'
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 group-hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 dark:group-hover:bg-indigo-500/20'
                : 'bg-cyan-50 text-cyan-600 border border-cyan-200 group-hover:bg-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 dark:group-hover:bg-cyan-500/20'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.type === 'ai' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                AI Tool
              </span>
            )}
            {tool.trending && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                Trending
              </span>
            )}
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-lg transition-colors ${
                favorited
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle Favorite"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <Link href={`/tools/${tool.slug}`} onClick={handleCardClick} className="block">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-1">
            <span className="line-clamp-1">{tool.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-600 dark:text-cyan-400 shrink-0" />
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </Link>
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-medium text-slate-500 dark:text-slate-400">{tool.categoryName}</span>
        <span className="flex items-center gap-1 font-mono text-[10px]">
          {tool.unlimited ? (
            <span className="text-emerald-600 dark:text-emerald-400/90 font-sans font-semibold">Unlimited</span>
          ) : (
            <span className="text-slate-500 dark:text-slate-400">Free Tier</span>
          )}
        </span>
      </div>
    </div>
  );
}
