'use client';

import React, { useState } from 'react';
import { Link2, Copy, Check, ArrowLeftRight, Trash2 } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function UrlEncoderView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [input, setInput] = useState('https://tools.techusar.com/search?query=online tools & developer utilities');
  const [output, setOutput] = useState(encodeURIComponent('https://tools.techusar.com/search?query=online tools & developer utilities'));
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const handleProcess = (val: string, currentMode: 'encode' | 'decode') => {
    setInput(val);
    try {
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(val));
      } else {
        setOutput(decodeURIComponent(val));
      }
    } catch {
      setOutput('Error: Malformed URI sequence');
    }
  };

  const handleSwap = () => {
    const next = mode === 'encode' ? 'decode' : 'encode';
    setMode(next);
    setInput(output);
    handleProcess(output, next);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('encode');
              handleProcess(input, 'encode');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'encode' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-[#171A21] text-slate-300'
            }`}
          >
            Encode URL Component
          </button>
          <button
            onClick={() => {
              setMode('decode');
              handleProcess(input, 'decode');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'decode' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-[#171A21] text-slate-300'
            }`}
          >
            Decode URL
          </button>
        </div>

        <button
          onClick={handleSwap}
          className="px-3 py-1.5 rounded-lg bg-[#171A21] border border-slate-700 text-slate-300 text-xs flex items-center gap-1"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Input URL / String</label>
          <textarea
            value={input}
            onChange={(e) => handleProcess(e.target.value, mode)}
            rows={8}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-200">Output Result</span>
            <button
              onClick={handleCopy}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={8}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 select-all focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
