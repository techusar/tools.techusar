'use client';

import React, { useState } from 'react';
import { Palette, Copy, Check, Sparkles, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const GRADIENT_PRESETS = [
  { name: 'Cyber Neon', colors: ['#06b6d4', '#3b82f6', '#8b5cf6'], angle: 135 },
  { name: 'Sunset Blaze', colors: ['#f43f5e', '#fb923c', '#facc15'], angle: 90 },
  { name: 'Emerald Aurora', colors: ['#059669', '#10b981', '#06b6d4'], angle: 120 },
  { name: 'Midnight Violet', colors: ['#1e1b4b', '#4c1d95', '#831843'], angle: 180 },
  { name: 'Ocean Breeze', colors: ['#0284c7', '#38bdf8', '#a5f3fc'], angle: 45 },
  { name: 'Dark Velvet', colors: ['#090d16', '#1e293b', '#334155'], angle: 160 },
];

export function CssGradientGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState<number>(135);
  const [colors, setColors] = useState<string[]>(['#06b6d4', '#3b82f6', '#8b5cf6']);
  const [copied, setCopied] = useState<boolean>(false);

  const getCssString = () => {
    if (gradientType === 'linear') {
      return `background: linear-gradient(${angle}deg, ${colors.join(', ')});`;
    }
    return `background: radial-gradient(circle, ${colors.join(', ')});`;
  };

  const cssValue = getCssString();

  const handleColorChange = (index: number, newColor: string) => {
    const updated = [...colors];
    updated[index] = newColor;
    setColors(updated);
  };

  const addColorStop = () => {
    if (colors.length < 5) {
      setColors([...colors, '#ec4899']);
    }
  };

  const removeColorStop = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const handleCopy = async () => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'copy_gradient_css' });
    const ok = await copyToClipboard(cssValue);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyPreset = (preset: typeof GRADIENT_PRESETS[0]) => {
    setColors(preset.colors);
    setAngle(preset.angle);
    recordToolUse(tool);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              CSS Gradient Controls
            </h3>

            <div className="flex items-center bg-[#0D0F13] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setGradientType('linear')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  gradientType === 'linear' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Linear
              </button>
              <button
                onClick={() => setGradientType('radial')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  gradientType === 'radial' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Angle Slider if Linear */}
          {gradientType === 'linear' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Angle</span>
                <span className="text-cyan-400 font-bold">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          )}

          {/* Color stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Color Stops ({colors.length}/5)</label>
              {colors.length < 5 && (
                <button
                  onClick={addColorStop}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {colors.map((color, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-[#0D0F13] border border-slate-800 rounded-xl">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="flex-1 font-mono text-xs text-white bg-transparent border-0 focus:outline-none uppercase"
                  />
                  {colors.length > 2 && (
                    <button
                      onClick={() => removeColorStop(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Code output & copy */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Generated CSS Code</span>
            </div>
            <div className="p-3 bg-[#0D0F13] border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 select-all break-all">
              {cssValue}
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied CSS!' : 'Copy CSS Snippet'}</span>
            </button>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[360px]">
          <span className="text-xs font-mono text-slate-400 mb-3">Live Interactive Preview</span>
          <div
            className="w-full h-72 rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 flex items-center justify-center"
            style={{
              background:
                gradientType === 'linear'
                  ? `linear-gradient(${angle}deg, ${colors.join(', ')})`
                  : `radial-gradient(circle, ${colors.join(', ')})`,
            }}
          >
            <div className="px-5 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white font-mono text-xs text-center shadow-lg">
              <span>{gradientType.toUpperCase()} GRADIENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Presets */}
      <div className="p-5 bg-slate-900/50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Designer Curated Gradient Palettes
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {GRADIENT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="group p-2.5 bg-[#0D0F13] hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all"
            >
              <div
                className="w-full h-12 rounded-lg mb-2 border border-white/10 shadow-sm"
                style={{
                  background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`,
                }}
              />
              <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 block truncate">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
