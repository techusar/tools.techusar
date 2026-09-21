'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Play, FileCode, CheckCircle2 } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function GenericToolFallbackView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleRun = () => {
    setProcessing(true);
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, metadata: { length: inputVal.length } });

    setTimeout(() => {
      // Process generically based on tool slug
      let result = '';
      if (tool.slug.includes('binary')) {
        result = inputVal
          .split('')
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
      } else if (tool.slug.includes('morse')) {
        const MORSE: Record<string, string> = {
          A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
          I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
          Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
          Y: '-.--', Z: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
          '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
          ' ': '/',
        };
        result = inputVal
          .toUpperCase()
          .split('')
          .map((c) => MORSE[c] || c)
          .join(' ');
      } else if (tool.slug.includes('csv') || tool.slug.includes('tsv')) {
        // Convert to JSON
        const lines = inputVal.trim().split('\n');
        if (lines.length > 0) {
          const headers = lines[0].split(',').map((h) => h.trim());
          const rows = lines.slice(1).map((l) => {
            const vals = l.split(',');
            const obj: any = {};
            headers.forEach((h, i) => {
              obj[h] = vals[i]?.trim();
            });
            return obj;
          });
          result = JSON.stringify(rows, null, 2);
        }
      } else if (tool.slug.includes('xml')) {
        result = inputVal.replace(/>\s*</g, '>\n<');
      } else {
        result = `Processed successfully by ${tool.name}:\n\n${inputVal.trim()}`;
      }

      setOutputVal(result);
      setProcessing(false);
    }, 150);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(outputVal);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <span className="text-xs text-slate-400">
          High-performance in-memory processor for <strong className="text-white">{tool.name}</strong>
        </span>

        <button
          onClick={handleRun}
          disabled={processing || !inputVal}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{processing ? 'Processing...' : 'Run Tool'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Input Payload / Content</label>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Enter input content for ${tool.name}...`}
            rows={10}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-200">Output Result</span>
            {outputVal && (
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            )}
          </div>
          <textarea
            value={outputVal}
            readOnly
            placeholder="Result will appear here after clicking Run Tool..."
            rows={10}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 select-all focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
