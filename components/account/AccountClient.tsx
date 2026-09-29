'use client';

import React from 'react';
import Link from 'next/link';
import {
  User,
  Sparkles,
  Shield,
  Star,
  Zap,
  LogOut,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
} from 'lucide-react';
import { useUser } from '@/components/auth/UserContext';
import { ToolItem } from '@/lib/types';
import { ToolCard } from '@/components/tools/ToolCard';

export function AccountClient({ allTools }: { allTools: ToolItem[] }) {
  const { user, isAuthenticated, openAuthModal, logout, favorites, recentTools, toggleFavorite } =
    useUser();

  const favoriteTools = allTools.filter((t) => favorites.includes(t.id) || favorites.includes(t.slug));
  const recentToolItems = allTools.filter((t) => recentTools.includes(t.id) || recentTools.includes(t.slug));

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In to TechTools</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Create a free account to unlock 10 daily Gemini AI queries, cloud bookmark synchronization, and customized developer preferences.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => openAuthModal('login')}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Register Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-cyan-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user.name}</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.tier === 'pro'
                    ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {user.tier === 'pro' ? '★ Pro Developer' : 'Free Community'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.tier !== 'pro' && (
            <Link
              href="/pricing"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade to Pro</span>
            </Link>
          )}
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 dark:bg-[#171A21] dark:hover:bg-red-500/10 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats and Quota Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily AI Generation Quota</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {user.tier === 'pro' ? 'Unlimited' : '10 / 10 queries today'}
          </div>
          <p className="text-[11px] text-slate-500">Resets daily at midnight UTC</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bookmarked Tools</span>
          <div className="text-2xl font-black text-amber-500 font-mono">
            {favorites.length}
          </div>
          <Link href="/favorites" className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline">
            Manage bookmarks →
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Privacy Status</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
            <Shield className="w-6 h-6" />
            <span>100% Protected</span>
          </div>
          <p className="text-[11px] text-slate-500">Zero data retention guarantee</p>
        </div>
      </div>

      {/* Bookmarked Favorites */}
      {favoriteTools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Your Bookmarked Tools</span>
            </h3>
            <Link href="/favorites" className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
              View all bookmarks ({favoriteTools.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteTools.slice(0, 4).map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isBookmarked={true}
                onToggleBookmark={() => toggleFavorite(tool.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Tool Usage History */}
      {recentToolItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Recent Tool Usage</span>
            </h3>
            <Link href="/account/history" className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
              View full usage history ({recentToolItems.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentToolItems.slice(0, 4).map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isBookmarked={favorites.includes(tool.id)}
                onToggleBookmark={() => toggleFavorite(tool.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
