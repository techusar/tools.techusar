'use client';

import React, { useState } from 'react';
import { Maximize, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const PRESETS = [
  { name: '16:9 (YouTube / 1080p)', w: 1920, h: 1080, ratio: '16:9' },
  { name: '16:9 (4K UHD)', w: 3840, h: 2160, ratio: '16:9' },
  { name: '9:16 (TikTok / Reels)', w: 1080, h: 1920, ratio: '9:16' },
  { name: '1:1 (Square / Instagram)', w: 1080, h: 1080, ratio: '1:1' },
  { name: '4:5 (Instagram Portrait)', w: 1080, h: 1350, ratio: '4:5' },
  { name: '4:3 (Classic TV / Tablet)', w: 1024, h: 768, ratio: '4:3' },
  { name: '21:9 (Ultrawide Cinema)', w: 2560, h: 1080, ratio: '21:9' },
  { name: '1.91:1 (OG Social Share)', w: 1200, h: 630, ratio: '1.91:1' },
];

export function AspectRatioCalculatorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [ratioW, setRatioW] = useState<number>(16);
  const [ratioH, setRatioH] = useState<number>(9);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const calculateSimplifiedRatio = (w: number, h: number) => {
    if (!w || !h) return '16:9';
    const divisor = gcd(Math.round(w), Math.round(h));
    return `${Math.round(w / divisor)}:${Math.round(h / divisor)}`;
  };

  const handleWidthChange = (newW: number) => {
    setWidth(newW);
    if (lockRatio && ratioW > 0) {
      const calculatedH = Math.round((newW * ratioH) / ratioW);
      setHeight(calculatedH);
    }
  };

  const handleHeightChange = (newH: number) => {
    setHeight(newH);
    if (lockRatio && ratioH > 0) {
      const calculatedW = Math.round((newH * ratioW) / ratioH);
      setWidth(calculatedW);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setWidth(preset.w);
    setHeight(preset.h);
    const [rw, rh] = preset.ratio.split(':').map(Number);
    if (rw && rh) {
      setRatioW(rw);
      setRatioH(rh);
    }
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, metadata: { preset: preset.name } });
  };

  const handleCopyDimensions = async () => {
    recordToolUse(tool);
    const ok = await copyToClipboard(`${width}x${height}`);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentRatioString = calculateSimplifiedRatio(width, height);
  const decimalRatio = height > 0 ? (width / height).toFixed(2) : '1.78';

  return (
    <div className="space-y-6">
      {/* Controls & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input sliders & dimension boxes */}
        <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Maximize className="w-4 h-4 text-cyan-400" />
              Dimensions & Aspect Ratio
            </h3>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={lockRatio}
                onChange={(e) => setLockRatio(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Lock Aspect Ratio</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Width (pixels)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                className="w-full font-mono text-sm p-3 bg-[#0D0F13] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Height (pixels)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                className="w-full font-mono text-sm p-3 bg-[#0D0F13] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 bg-[#0D0F13] rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Aspect Ratio</span>
              <span className="text-sm font-bold font-mono text-cyan-400">{currentRatioString}</span>
            </div>
            <div className="p-3 bg-[#0D0F13] rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Decimal Ratio</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{decimalRatio}:1</span>
            </div>
            <div className="p-3 bg-[#0D0F13] rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Total Pixels</span>
              <span className="text-sm font-bold font-mono text-white">
                {((width * height) / 1000000).toFixed(1)} MP
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyDimensions}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Dimensions' : `Copy Resolution (${width}x${height})`}</span>
          </button>
        </div>

        {/* Right: Visual Canvas Aspect Box */}
        <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
          <span className="text-[11px] font-mono text-slate-400 mb-3">Live Visual Proportion</span>

          <div className="w-full max-w-xs h-56 flex items-center justify-center p-4 bg-[#0D0F13] rounded-2xl border border-slate-800">
            <div
              className="border-2 border-cyan-400 bg-cyan-500/10 rounded-lg flex flex-col items-center justify-center text-cyan-300 font-mono text-xs transition-all duration-300 shadow-lg shadow-cyan-500/10"
              style={{
                aspectRatio: `${width}/${height || 1}`,
                maxWidth: '100%',
                maxHeight: '100%',
                width: width >= height ? '100%' : 'auto',
                height: height > width ? '100%' : 'auto',
              }}
            >
              <span className="font-bold text-white text-xs">{currentRatioString}</span>
              <span className="text-[10px] text-cyan-400">{width} × {height}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Resolution & Device Presets */}
      <div className="p-5 bg-slate-900/50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Standard Video, Social & Screen Presets
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="p-3 bg-[#0D0F13] hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all group"
            >
              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white block truncate">
                {p.name}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
                {p.w} × {p.h} ({p.ratio})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
