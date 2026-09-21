'use client';

import React, { useState, useMemo } from 'react';
import { testRegex } from '@/lib/tools/processors';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function RegexTesterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState(
    'Contact support at help@techusar.com or info@example.org for questions regarding TechTools.'
  );

  const results = useMemo(() => {
    if (!pattern || !testString) {
      return { isValid: true, matches: [] };
    }
    return testRegex(pattern, flags, testString);
  }, [pattern, flags, testString]);

  return (
    <div className="space-y-6">
      {/* Pattern Input Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Regular Expression Pattern</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-sm">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. [0-9]+"
              className="w-full pl-7 pr-3.5 py-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m, s"
            className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Test String */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Paste or write the text you want to test against your regex pattern..."
          rows={6}
          className="w-full p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
        />
      </div>

      {/* Status & Matches */}
      <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {results.isValid ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Valid Regex Pattern
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                <AlertCircle className="w-4 h-4" />
                {results.error || 'Invalid Syntax'}
              </span>
            )}
          </div>
          <span className="text-slate-400 font-mono">{results.matches?.length || 0} Matches Found</span>
        </div>

        {results.matches && results.matches.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Extracted Matches:</span>
            <div className="flex flex-wrap gap-2">
              {results.matches.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-[#0D0F13] border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2"
                >
                  <span className="text-slate-500 text-[10px]">#{idx + 1}</span>
                  <span className="font-semibold">{m.match}</span>
                  <span className="text-[10px] text-slate-500">at index {m.index}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
