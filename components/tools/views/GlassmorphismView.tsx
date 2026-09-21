'use client';

import React, { useState } from 'react';
import { Layers, Copy, Check, Sparkles } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function GlassmorphismView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [blur, setBlur] = useState<number>(16);
  const [transparency, setTransparency] = useState<number>(0.25);
  const [borderOpacity, setBorderOpacity] = useState<number>(0.3);
  const [borderRadius, setBorderRadius] = useState<number>(20);
  const [tintColor, setTintColor] = useState<string>('#ffffff');
  const [copied, setCopied] = useState<boolean>(false);

  // Convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 255, 255';
  };

  const rgb = hexToRgb(tintColor);
  const cssCode = `/* Glassmorphism CSS */
background: rgba(${rgb}, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: 1px solid rgba(${rgb}, ${borderOpacity});
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;

  const handleCopy = async () => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'copy_glassmorphism' });
    const ok = await copyToClipboard(cssCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Glassmorphism Property Controls
          </h3>

          <div className="space-y-4">
            {/* Blur */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Backdrop Blur</span>
                <span className="text-cyan-400 font-bold">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Transparency */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Background Opacity</span>
                <span className="text-cyan-400 font-bold">{Math.round(transparency * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.01"
                value={transparency}
                onChange={(e) => setTransparency(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Border Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Border Outline Opacity</span>
                <span className="text-cyan-400 font-bold">{Math.round(borderOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.01"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Border Radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Corner Radius</span>
                <span className="text-cyan-400 font-bold">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Tint Color */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-300">Glass Tint Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={tintColor}
                  onChange={(e) => setTintColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-white uppercase">{tintColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <textarea
              value={cssCode}
              readOnly
              rows={6}
              className="w-full font-mono text-xs p-3 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied CSS Code!' : 'Copy Glassmorphism CSS'}</span>
            </button>
          </div>
        </div>

        {/* Live Visual Canvas with vibrant shapes behind the glass card */}
        <div className="relative p-6 rounded-2xl border border-slate-800 overflow-hidden min-h-[380px] flex items-center justify-center bg-[#07090E]">
          {/* Background decorative vibrant blobs */}
          <div className="absolute top-10 left-10 w-36 h-36 rounded-full bg-cyan-500 blur-2xl opacity-60 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-44 h-44 rounded-full bg-purple-600 blur-2xl opacity-60" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-pink-500 blur-2xl opacity-50" />

          {/* Rendered Glass Card */}
          <div
            className="relative z-10 w-full max-w-sm p-6 text-white shadow-2xl transition-all duration-200"
            style={{
              background: `rgba(${rgb}, ${transparency})`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              borderRadius: `${borderRadius}px`,
              border: `1px solid rgba(${rgb}, ${borderOpacity})`,
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-200">
                Glass UI Card
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            </div>
            <h4 className="text-lg font-black text-white mb-2">Modern Frosted Glass</h4>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Frosted glass delivers depth and visual hierarchy by softly blurring underlying content elements.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <span className="text-white/60">Blur: {blur}px</span>
              <span className="text-cyan-300 font-mono font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
