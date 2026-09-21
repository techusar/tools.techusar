'use client';

import React, { useState } from 'react';
import { Type, Copy, Check, Trash2 } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function CaseConverterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [text, setText] = useState('TechTools by TechUsar is the premier web utilities platform');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const conversions = [
    { key: 'lower', label: 'lower case', value: text.toLowerCase() },
    { key: 'upper', label: 'UPPER CASE', value: text.toUpperCase() },
    {
      key: 'title',
      label: 'Title Case',
      value: text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
    },
    {
      key: 'camel',
      label: 'camelCase',
      value: text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()),
    },
    {
      key: 'pascal',
      label: 'PascalCase',
      value: text
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[a-z]/, (c) => c.toUpperCase()),
    },
    {
      key: 'snake',
      label: 'snake_case',
      value: text
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, ''),
    },
    {
      key: 'kebab',
      label: 'kebab-case',
      value: text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    },
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
      {/* Input */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold text-slate-200">Input Text</span>
          <button onClick={() => setText('')} className="text-slate-400 hover:text-rose-400 flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to convert across cases..."
          rows={4}
          className="w-full p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Case Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {conversions.map((item) => (
          <div key={item.key} className="p-4 rounded-xl bg-[#14171F] border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">{item.label}</span>
              <button
                onClick={() => handleCopy(item.key, item.value)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium text-xs"
              >
                {copiedKey === item.key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === item.key ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-[#0D0F13] border border-slate-800 rounded-lg text-xs font-mono text-cyan-300/90 break-all select-all">
              {item.value || '...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
