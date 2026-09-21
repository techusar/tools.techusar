'use client';

import React, { useState } from 'react';
import { generateLoremIpsum } from '@/lib/tools/processors';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function LoremIpsumView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [asHtml, setAsHtml] = useState(false);
  const [text, setText] = useState(() => generateLoremIpsum({ count: 3, type: 'paragraphs', startWithLorem: true, asHtml: false }));
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const res = generateLoremIpsum({ count, type, startWithLorem, asHtml });
    setText(res);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#14171F] border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Generate:</span>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-16 px-2.5 py-1 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-none"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="bg-[#0D0F13] border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="accent-cyan-400"
            />
            <span>Start with &quot;Lorem ipsum&quot;</span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={asHtml}
              onChange={(e) => setAsHtml(e.target.checked)}
              className="accent-cyan-400"
            />
            <span>Include &lt;p&gt; tags</span>
          </label>
        </div>

        <button
          onClick={handleGenerate}
          className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate Text</span>
        </button>
      </div>

      {/* Output Display */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Generated Dummy Copy</span>
          <button
            onClick={handleCopy}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
        <textarea
          value={text}
          readOnly
          rows={10}
          className="w-full p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-300 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none"
        />
      </div>
    </div>
  );
}
