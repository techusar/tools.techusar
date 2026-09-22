'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, AlignLeft, Sparkles, Hash, AlertCircle } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const SAMPLE_TEXT = `Character Counter is a dedicated online utility designed for copywriters, social media managers, SEO specialists, and developers. It provides real-time character tracking with and without whitespace, letter and number breakdowns, and instant progress bars for platform limits like Twitter (280), SMS (160), and Google SERP Meta descriptions.`;

const PLATFORM_LIMITS = [
  { name: 'X / Twitter Post', max: 280, color: 'text-sky-400', barColor: 'bg-sky-400' },
  { name: 'SMS Single Segment', max: 160, color: 'text-emerald-400', barColor: 'bg-emerald-400' },
  { name: 'Google SEO Title', max: 60, color: 'text-amber-400', barColor: 'bg-amber-400' },
  { name: 'Google Meta Description', max: 160, color: 'text-indigo-400', barColor: 'bg-indigo-400' },
  { name: 'Instagram Caption', max: 2200, color: 'text-pink-400', barColor: 'bg-pink-400' },
  { name: 'LinkedIn Post', max: 3000, color: 'text-blue-400', barColor: 'bg-blue-400' },
];

export function CharacterCounterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const raw = text || '';
    const totalChars = raw.length;
    const charsNoSpaces = raw.replace(/\s/g, '').length;
    const letters = (raw.match(/[a-zA-Z]/g) || []).length;
    const digits = (raw.match(/[0-9]/g) || []).length;
    const spaces = (raw.match(/\s/g) || []).length;
    const words = raw.trim() ? raw.trim().split(/\s+/).length : 0;
    const sentences = raw.trim() ? (raw.match(/[.!?]+(?:\s|$)/g) || []).length || (raw.length > 0 ? 1 : 0) : 0;
    const paragraphs = raw.trim() ? raw.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
    const bytes = new Blob([raw]).size;

    return {
      totalChars,
      charsNoSpaces,
      letters,
      digits,
      spaces,
      words,
      sentences,
      paragraphs,
      bytes,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackClientEvent('copy', { toolSlug: tool.slug });
    }
  };

  const handleClear = () => {
    setText('');
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
  };

  return (
    <div className="space-y-6">
      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-cyan-500/30 text-center shadow-sm">
          <span className="text-[11px] text-slate-400 block font-medium">Total Characters</span>
          <span className="text-2xl font-bold text-cyan-400 mt-1 block font-mono">{stats.totalChars}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Without Spaces</span>
          <span className="text-2xl font-bold text-white mt-1 block font-mono">{stats.charsNoSpaces}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Letters</span>
          <span className="text-2xl font-bold text-indigo-400 mt-1 block font-mono">{stats.letters}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Digits / Numbers</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block font-mono">{stats.digits}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Words</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block font-mono">{stats.words}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Sentences / Paras</span>
          <span className="text-2xl font-bold text-purple-400 mt-1 block font-mono">
            {stats.sentences} <span className="text-xs text-slate-500 font-normal">/ {stats.paragraphs}</span>
          </span>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Live Text Area</span>
            <span className="text-[11px] text-slate-500 font-mono">({stats.bytes} bytes)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadSample}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sample</span>
            </button>
            <button
              onClick={handleCopy}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            recordToolUse(tool);
          }}
          placeholder="Paste or type text here to count characters instantly..."
          rows={10}
          className="w-full p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-200 text-sm leading-relaxed placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
        />
      </div>

      {/* Social Media & Platform Limit Meters */}
      <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-cyan-400" /> Platform & Social Media Limits
          </span>
          <span className="text-[11px] text-slate-500">Live limit checking</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {PLATFORM_LIMITS.map((platform) => {
            const current = stats.totalChars;
            const remaining = platform.max - current;
            const percent = Math.min(100, Math.round((current / platform.max) * 100));
            const isOver = remaining < 0;

            return (
              <div
                key={platform.name}
                className="p-3 rounded-lg bg-[#0D0F13] border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 truncate">{platform.name}</span>
                  <span className={`font-mono text-[11px] font-semibold ${isOver ? 'text-rose-400' : 'text-slate-400'}`}>
                    {current} / {platform.max}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isOver ? 'bg-rose-500' : platform.barColor
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{percent}% used</span>
                  <span className={isOver ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {isOver ? `${Math.abs(remaining)} chars over limit` : `${remaining} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
