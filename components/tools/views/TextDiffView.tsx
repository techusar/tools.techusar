'use client';

import React, { useState } from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function TextDiffView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [original, setOriginal] = useState('TechTools provides online utilities for developers.\nFast and secure.');
  const [modified, setModified] = useState('TechTools provides online utilities for developers & AI.\nFast, modern and 100% secure.');

  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Original Text</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={8}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Modified Text</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            rows={8}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Comparison diff view */}
      <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Line-by-Line Comparison
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          <div className="bg-[#0D0F13] p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">ORIGINAL ({originalLines.length} lines)</span>
            {originalLines.map((line, i) => (
              <div
                key={i}
                className={`p-1 rounded ${
                  modifiedLines[i] !== line ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-slate-400'
                }`}
              >
                {line || ' '}
              </div>
            ))}
          </div>

          <div className="bg-[#0D0F13] p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">MODIFIED ({modifiedLines.length} lines)</span>
            {modifiedLines.map((line, i) => (
              <div
                key={i}
                className={`p-1 rounded ${
                  originalLines[i] !== line ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400'
                }`}
              >
                {line || ' '}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
