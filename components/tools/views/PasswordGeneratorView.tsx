'use client';

import React, { useState } from 'react';
import { generatePassword, PasswordGenOptions } from '@/lib/tools/processors';
import { copyToClipboard } from '@/lib/utils';
import { Shield, RefreshCw, Copy, Check } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const DEFAULT_OPTIONS: PasswordGenOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: false,
};

export function PasswordGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [options, setOptions] = useState<PasswordGenOptions>(DEFAULT_OPTIONS);

  const [result, setResult] = useState<{ password: string; entropy: number; crackTime: string }>(() =>
    generatePassword(DEFAULT_OPTIONS)
  );

  const [copied, setCopied] = useState(false);

  const handleUpdateOptions = (updater: (prev: PasswordGenOptions) => PasswordGenOptions) => {
    setOptions((prev) => {
      const next = updater(prev);
      const newResult = generatePassword(next);
      setResult(newResult);
      return next;
    });
  };

  const handleGenerate = () => {
    const res = generatePassword(options);
    setResult(res);
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug });
  };

  const handleCopy = async () => {
    if (!result.password) return;
    const ok = await copyToClipboard(result.password);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackClientEvent('copy', { toolSlug: tool.slug });
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Display Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0F13] border border-slate-800 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full font-mono text-base sm:text-xl text-cyan-400 font-bold tracking-wider break-all select-all">
          {result.password || 'Generating...'}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGenerate}
            className="p-3 rounded-xl bg-[#171A21] hover:bg-[#20242C] border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Generate new password"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Password'}</span>
          </button>
        </div>
      </div>

      {/* Security Analysis Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-200">Entropy Score</span>
            <span className="font-mono text-cyan-400 font-bold">{result.entropy} bits</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                result.entropy > 80
                  ? 'bg-emerald-400'
                  : result.entropy > 50
                  ? 'bg-cyan-400'
                  : result.entropy > 35
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
              style={{ width: `${Math.min(100, (result.entropy / 128) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Estimated Time to Crack</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{result.crackTime}</span>
          </div>
          <Shield className="w-5 h-5 text-emerald-400/80" />
        </div>
      </div>

      {/* Configuration Sliders and Toggles */}
      <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span className="font-semibold">Password Length: {options.length} characters</span>
            <span className="font-mono text-slate-400">Range: 8 - 64</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => {
              const val = Number(e.target.value);
              handleUpdateOptions((prev) => ({ ...prev, length: val }));
            }}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <label className="flex items-center gap-2 p-3 rounded-xl bg-[#171A21] border border-slate-800 text-xs text-slate-200 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => {
                const checked = e.target.checked;
                handleUpdateOptions((prev) => ({ ...prev, uppercase: checked }));
              }}
              className="accent-cyan-400 rounded"
            />
            <span>Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-xl bg-[#171A21] border border-slate-800 text-xs text-slate-200 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => {
                const checked = e.target.checked;
                handleUpdateOptions((prev) => ({ ...prev, lowercase: checked }));
              }}
              className="accent-cyan-400 rounded"
            />
            <span>Lowercase (a-z)</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-xl bg-[#171A21] border border-slate-800 text-xs text-slate-200 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={(e) => {
                const checked = e.target.checked;
                handleUpdateOptions((prev) => ({ ...prev, numbers: checked }));
              }}
              className="accent-cyan-400 rounded"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-xl bg-[#171A21] border border-slate-800 text-xs text-slate-200 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={(e) => {
                const checked = e.target.checked;
                handleUpdateOptions((prev) => ({ ...prev, symbols: checked }));
              }}
              className="accent-cyan-400 rounded"
            />
            <span>Symbols (!@#$)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
