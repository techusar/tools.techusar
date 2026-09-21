'use client';

import React, { useState } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

function hexToRgb(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function ColorConverterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [hex, setHex] = useState('#06B6D4');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rgb = hexToRgb(hex || '#000000');
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const formats = [
    { key: 'hex', label: 'HEX Code', value: hex.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { key: 'rgba', label: 'RGBA (Alpha 1.0)', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { key: 'hsl', label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { key: 'cssVar', label: 'Tailwind / CSS Var', value: `${rgb.r} ${rgb.g} ${rgb.b}` },
  ];

  const handleCopy = async (key: string, val: string) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Color Picker & Preview Box */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0D0F13] border border-slate-800 space-y-4">
          <div
            className="w-full h-44 rounded-2xl shadow-2xl border border-white/10 transition-colors flex items-center justify-center text-slate-950 font-bold font-mono"
            style={{ backgroundColor: hex }}
          >
            <span className="px-3 py-1 bg-black/60 text-white rounded-lg backdrop-blur-sm text-xs">
              {hex.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-full px-3 py-2 bg-[#171A21] border border-slate-700 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Formats List */}
        <div className="lg:col-span-7 space-y-3">
          {formats.map((fmt) => (
            <div
              key={fmt.key}
              className="p-3.5 rounded-xl bg-[#14171F] border border-slate-800 flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">{fmt.label}</span>
                <span className="font-mono text-xs font-semibold text-white mt-0.5 block">{fmt.value}</span>
              </div>
              <button
                onClick={() => handleCopy(fmt.key, fmt.value)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-xs font-medium"
              >
                {copiedKey === fmt.key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === fmt.key ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
