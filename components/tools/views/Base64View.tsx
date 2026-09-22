'use client';

import React, { useState } from 'react';
import { encodeBase64, decodeBase64 } from '@/lib/tools/processors';
import { copyToClipboard } from '@/lib/utils';
import { Copy, Check, ArrowLeftRight, Trash2, Shield } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function Base64View({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const isDecoder = tool.slug === 'base64-decoder' || tool.slug.includes('decode');
  const [mode, setMode] = useState<'encode' | 'decode'>(isDecoder ? 'decode' : 'encode');
  const initialSample = isDecoder ? 'VGVjaFRvb2xzIGJ5IFRlY2hVc2Fy' : 'TechTools by TechUsar';
  const [input, setInput] = useState(initialSample);
  const [output, setOutput] = useState(
    isDecoder ? decodeBase64(initialSample).result : encodeBase64(initialSample)
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    setError('');
    if (!text) {
      setOutput('');
      return;
    }
    if (currentMode === 'encode') {
      setOutput(encodeBase64(text));
    } else {
      const res = decodeBase64(text);
      if (res.error) {
        setError(res.error);
        setOutput('');
      } else {
        setOutput(res.result);
      }
    }
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, metadata: { mode: currentMode } });
  };

  const handleSwap = () => {
    const nextMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(nextMode);
    setInput(output);
    handleProcess(output, nextMode);
  };

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackClientEvent('copy', { toolSlug: tool.slug });
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('encode');
              handleProcess(input, 'encode');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'encode'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#171A21] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Encode Plain Text to Base64
          </button>
          <button
            onClick={() => {
              setMode('decode');
              handleProcess(input, 'decode');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'decode'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#171A21] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Decode Base64 to Text
          </button>
        </div>

        <button
          onClick={handleSwap}
          className="px-3 py-1.5 rounded-lg bg-[#171A21] hover:bg-[#20242C] text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5"
          title="Swap input and output"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              {mode === 'encode' ? 'Raw Text String' : 'Base64 Input'}
            </span>
            <button
              onClick={() => {
                setInput('');
                setOutput('');
              }}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleProcess(e.target.value, mode)}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 string to decode...'}
            rows={10}
            className="w-full font-mono text-xs p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              {mode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Plain Text'}
            </span>
            {output && (
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear automatically..."
            rows={10}
            className="w-full font-mono text-xs p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300/90 placeholder-slate-600 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
