'use client';

import React, { useState, useMemo } from 'react';
import { analyzeText } from '@/lib/tools/processors';
import { copyToClipboard } from '@/lib/utils';
import { Copy, Check, Trash2 } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const SAMPLE_TEXT = `TechTools by TechUsar is an all-in-one web utility and productivity suite engineered for developers, creators, students, and businesses. With over 60 online tools spanning Developer Utilities, Image Converters, Text Analyzers, SEO Meta Generators, Financial Calculators, and Gemini AI assistants, TechTools provides instant client-side execution with zero compromise on data privacy.`;

export function WordCounterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [text, setText] = useState(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => analyzeText(text), [text]);

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackClientEvent('copy', { toolSlug: tool.slug });
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Words</span>
          <span className="text-xl font-bold text-cyan-400 mt-1 block">{stats.words}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Characters</span>
          <span className="text-xl font-bold text-white mt-1 block">{stats.characters}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Without Spaces</span>
          <span className="text-xl font-bold text-white mt-1 block">{stats.charactersNoSpaces}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Sentences</span>
          <span className="text-xl font-bold text-indigo-400 mt-1 block">{stats.sentences}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Paragraphs</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{stats.paragraphs}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Reading Time</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">{stats.readingTimeMinutes} min</span>
        </div>
      </div>

      {/* Main Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Live Text Input</span>
          <div className="flex items-center gap-3">
            <button onClick={handleCopy} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button onClick={() => setText('')} className="text-slate-400 hover:text-rose-400 flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or start typing your document here..."
          rows={12}
          className="w-full p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-200 text-sm leading-relaxed placeholder-slate-600 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Top Keywords Breakdown */}
      {stats.topKeywords && stats.topKeywords.length > 0 && (
        <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800">
          <span className="text-xs font-semibold text-slate-300 block mb-3">Top Keyword Frequencies</span>
          <div className="flex flex-wrap gap-2">
            {stats.topKeywords.map((kw: any, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-[#171A21] border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2"
              >
                <span className="font-medium text-white">{kw.word}</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                  {kw.count}x
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
