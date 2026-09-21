'use client';

import React, { useState } from 'react';
import { generateUUID } from '@/lib/tools/processors';
import { Copy, Check, RefreshCw, KeyRound } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function UuidGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => {
    return Array.from({ length: 5 }, () => generateUUID());
  });
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = generateUUID();
      if (uppercase) id = id.toUpperCase();
      if (noHyphens) id = id.replace(/-/g, '');
      list.push(id);
    }
    setUuids(list);
    recordToolUse(tool);
  };

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(uuids.join('\n'));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#14171F] border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Quantity:</span>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-16 px-2.5 py-1 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-cyan-400"
            />
            <span>Uppercase</span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => setNoHyphens(e.target.checked)}
              className="accent-cyan-400"
            />
            <span>Remove Hyphens</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>
        </div>
      </div>

      {/* UUIDs Display List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Generated UUID v4 Identifiers ({uuids.length})</span>
          <button
            onClick={handleCopyAll}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied All' : 'Copy All UUIDs'}</span>
          </button>
        </div>

        <div className="space-y-2">
          {uuids.map((id, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#0D0F13] border border-slate-800 flex items-center justify-between font-mono text-xs text-cyan-300 select-all"
            >
              <span>{id}</span>
              <button
                onClick={() => copyToClipboard(id)}
                className="text-slate-500 hover:text-cyan-400 p-1 rounded"
                title="Copy single UUID"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
