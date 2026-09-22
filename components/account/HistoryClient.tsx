'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Trash2,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  Shield,
  Layers,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useUser } from '@/components/auth/UserContext';
import { ToolItem } from '@/lib/types';
import { getAnonymousId } from '@/lib/analytics/tracker';

interface HistoryItem {
  tool_id: string;
  tool_name: string;
  category: string;
  used_at: string;
}

export function HistoryClient({ allTools }: { allTools: ToolItem[] }) {
  const { user, isAuthenticated, recentTools, clearRecentHistory } = useUser();
  const [dbHistory, setDbHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isClearing, setIsClearing] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  // Fetch from Neon DB on mount
  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        setLoading(true);
        const anonId = getAnonymousId();
        const param = user?.id ? `userId=${encodeURIComponent(user.id)}` : `anonymousId=${encodeURIComponent(anonId)}`;
        const res = await fetch(`/api/auth/history?${param}&limit=100`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.history) {
            setDbHistory(data.history);
          }
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Combine DB history with local recentTools for complete coverage
  const toolMap = new Map<string, ToolItem>();
  allTools.forEach((t) => {
    toolMap.set(t.id, t);
    toolMap.set(t.slug, t);
  });

  // Build merged display list
  const historyList: Array<{
    tool: ToolItem | undefined;
    slug: string;
    name: string;
    category: string;
    usedAt: string;
  }> = [];

  const seenSlugs = new Set<string>();

  if (dbHistory.length > 0) {
    dbHistory.forEach((item) => {
      const tool = toolMap.get(item.tool_id);
      historyList.push({
        tool,
        slug: item.tool_id,
        name: tool?.name || item.tool_name || item.tool_id,
        category: tool?.categoryName || item.category || 'General',
        usedAt: item.used_at,
      });
      seenSlugs.add(item.tool_id);
    });
  } else {
    recentTools.forEach((slug) => {
      if (!seenSlugs.has(slug)) {
        const tool = toolMap.get(slug);
        historyList.push({
          tool,
          slug,
          name: tool?.name || slug,
          category: tool?.categoryName || 'General',
          usedAt: new Date().toISOString(),
        });
        seenSlugs.add(slug);
      }
    });
  }

  // Categories list
  const categories = Array.from(new Set(historyList.map((h) => h.category).filter(Boolean)));

  // Filtered list
  const filteredList = historyList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your tool usage history?')) return;
    setIsClearing(true);
    await clearRecentHistory();
    setDbHistory([]);
    setIsClearing(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Recently';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="text-xs font-semibold text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              ← Account
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Clock className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            <span>Tool Usage History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Track and resume the developer utilities you&apos;ve recently accessed on this browser and device.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={isClearing}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-[#171A21] dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isClearing ? 'Clearing...' : 'Clear History'}</span>
          </button>
        )}
      </div>

      {clearedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Your tool usage history has been cleared.</span>
        </div>
      )}

      {/* Controls Bar */}
      {historyList.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-[#171A21] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Categories ({historyList.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-[#171A21] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Items List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Loading usage logs from database...</span>
        </div>
      ) : filteredList.length > 0 ? (
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredList.map((item, idx) => (
            <div
              key={`${item.slug}-${idx}`}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0 text-cyan-600 dark:text-cyan-400 font-bold">
                  {item.tool?.type === 'ai' ? (
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  )}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/tools/${item.slug}`}
                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors truncate"
                    >
                      {item.name}
                    </Link>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.tool?.description || 'Developer productivity tool'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
                  {formatTimestamp(item.usedAt)}
                </span>
                <Link
                  href={`/tools/${item.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No tool history recorded yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              As you use formatters, calculators, encoders, and AI utilities, your recent tools will automatically appear here for rapid 1-click resumption.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
