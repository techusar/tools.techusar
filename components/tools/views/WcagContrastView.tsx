'use client';

import React, { useState } from 'react';
import { checkColorContrast } from '@/lib/tools/processors';
import { Eye, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function WcagContrastView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [fgColor, setFgColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#06B6D4');

  const res = checkColorContrast(fgColor, bgColor);

  return (
    <div className="space-y-6">
      {/* Live Visual Preview Box */}
      <div
        className="p-8 sm:p-12 rounded-2xl shadow-2xl transition-colors text-center space-y-3 border border-white/10 flex flex-col items-center justify-center min-h-[220px]"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Live WCAG Typography Sample
        </h3>
        <p className="text-sm sm:text-base max-w-md leading-relaxed opacity-90">
          This sample text dynamically demonstrates how your chosen foreground and background colors interact for users with varying vision capabilities.
        </p>
      </div>

      {/* Color Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#14171F] border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Text (Foreground) Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl font-mono text-xs text-white uppercase focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl font-mono text-xs text-white uppercase focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* WCAG Compliance Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Contrast Ratio</span>
          <span className="text-3xl font-black text-cyan-400 font-mono mt-1 block">
            {res.ratio}:1
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">WCAG AA Level</span>
          <div className="flex items-center gap-2 mt-2">
            {res.aaLevel ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Passed (AA)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                <XCircle className="w-4 h-4" /> Failed (AA)
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">WCAG AAA Level (Enhanced)</span>
          <div className="flex items-center gap-2 mt-2">
            {res.aaaLevel ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Passed (AAA)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                <XCircle className="w-4 h-4" /> Failed (AAA)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
