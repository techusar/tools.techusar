'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function CssBoxShadowView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState('rgba(6, 182, 212, 0.4)');
  const [copied, setCopied] = useState(false);

  const shadowCss = `box-shadow: ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color};`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(shadowCss);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview Box */}
      <div className="p-12 sm:p-16 rounded-2xl bg-[#0D0F13] border border-slate-800 flex items-center justify-center min-h-[260px]">
        <div
          className="w-48 h-36 bg-[#171A21] rounded-2xl border border-slate-700/80 flex items-center justify-center text-xs font-semibold text-white transition-all duration-200"
          style={{ boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}` }}
        >
          Box Shadow Object
        </div>
      </div>

      {/* Controls Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#14171F] border border-slate-800 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Horizontal Offset (X):</span>
            <span className="font-mono text-cyan-400">{offsetX}px</span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            value={offsetX}
            onChange={(e) => setOffsetX(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Vertical Offset (Y):</span>
            <span className="font-mono text-cyan-400">{offsetY}px</span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            value={offsetY}
            onChange={(e) => setOffsetY(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Blur Radius:</span>
            <span className="font-mono text-cyan-400">{blur}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Spread Radius:</span>
            <span className="font-mono text-cyan-400">{spread}px</span>
          </div>
          <input
            type="range"
            min={-30}
            max={50}
            value={spread}
            onChange={(e) => setSpread(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Export CSS */}
      <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-semibold text-slate-400">Exportable CSS snippet</span>
          <button
            onClick={handleCopy}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy CSS'}</span>
          </button>
        </div>
        <pre className="font-mono text-xs text-cyan-300 bg-[#14171F] p-3 rounded-lg overflow-x-auto">
          {shadowCss}
        </pre>
      </div>
    </div>
  );
}
