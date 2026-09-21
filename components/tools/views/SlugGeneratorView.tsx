'use client';

import React, { useState } from 'react';
import { generateSlug } from '@/lib/tools/processors';
import { Copy, Check, Link } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function SlugGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [text, setText] = useState('Top 10 Best Online Developer Tools in 2026!');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = generateSlug(text, { separator, lowercase, removeStopWords: false });

  const handleCopy = async () => {
    if (!slug) return;
    const ok = await copyToClipboard(slug);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Result Display */}
      <div className="p-5 rounded-2xl bg-[#0D0F13] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full font-mono text-sm sm:text-base text-cyan-400 font-bold select-all break-all">
          {slug || 'Enter title to generate slug...'}
        </div>
        <button
          onClick={handleCopy}
          className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy Slug'}</span>
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-4 p-5 rounded-2xl bg-[#14171F] border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Article / Page Title
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Separator:</span>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="bg-[#0D0F13] border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=".">Dot (.)</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="accent-cyan-400"
            />
            <span>Convert to Lowercase</span>
          </label>
        </div>
      </div>
    </div>
  );
}
