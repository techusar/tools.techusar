'use client';

import React, { useState } from 'react';
import {
  formatJSON,
  minifyJSON,
  jsonToCsv,
} from '@/lib/tools/processors';
import { copyToClipboard, downloadTextFile } from '@/lib/utils';
import { Check, Copy, Download, FileCode, Play, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/components/auth/UserContext';
import { ToolItem } from '@/lib/types';
import { trackClientEvent } from '@/lib/analytics/tracker';

const SAMPLE_JSON = `{
  "name": "TechTools",
  "brand": "TechUsar",
  "version": "1.0.0",
  "features": [
    "JSON Formatter",
    "Image Compressor",
    "AI Utilities",
    "Privacy-First"
  ],
  "author": {
    "organization": "TechUsar Technologies",
    "website": "https://tools.techusar.com",
    "active": true
  }
}`;

export function JsonFormatterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [status, setStatus] = useState<{ valid?: boolean; message?: string }>({});
  const [copied, setCopied] = useState(false);

  const handleFormat = async () => {
    const { canUse } = await recordToolUse(tool);
    if (!canUse) return;

    if (!input.trim()) {
      setStatus({ valid: false, message: 'Please enter JSON string to format' });
      return;
    }
    const res = formatJSON(input, indent);
    setOutput(res.result);
    setStatus({
      valid: res.valid,
      message: res.valid ? 'Valid JSON formatted successfully' : res.error,
    });
    trackClientEvent('tool_use', { toolSlug: tool.slug, metadata: { action: 'format', valid: res.valid } });
  };

  const handleMinify = async () => {
    const { canUse } = await recordToolUse(tool);
    if (!canUse) return;

    if (!input.trim()) {
      setStatus({ valid: false, message: 'Please enter JSON string to minify' });
      return;
    }
    const res = minifyJSON(input);
    setOutput(res.result);
    setStatus({
      valid: res.valid,
      message: res.valid ? 'JSON minified successfully' : res.error,
    });
    trackClientEvent('tool_use', { toolSlug: tool.slug, metadata: { action: 'minify' } });
  };

  const handleToCsv = async () => {
    const { canUse } = await recordToolUse(tool);
    if (!canUse) return;

    const res = jsonToCsv(input);
    if (res.error) {
      setStatus({ valid: false, message: res.error });
    } else {
      setOutput(res.result);
      setStatus({ valid: true, message: 'JSON converted to CSV format successfully' });
    }
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

  const handleDownload = () => {
    if (!output) return;
    downloadTextFile('formatted.json', output, 'application/json');
    trackClientEvent('download', { toolSlug: tool.slug });
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-600/15 min-h-[38px]"
          >
            <Play className="w-3.5 h-3.5 fill-white dark:fill-slate-950" />
            Format / Beautify
          </button>

          <button
            onClick={handleMinify}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-[#20242C] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-all min-h-[38px]"
          >
            Minify JSON
          </button>

          <button
            onClick={handleToCsv}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-[#20242C] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-all min-h-[38px]"
          >
            Convert to CSV
          </button>

          <div className="flex items-center gap-1.5 sm:pl-2 sm:border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="bg-slate-100 dark:bg-[#171A21] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 text-xs focus:outline-none"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={8}>8 Spaces</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput(SAMPLE_JSON)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-[#20242C] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs border border-slate-200 dark:border-slate-800 transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={() => {
              setInput('');
              setOutput('');
              setStatus({});
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear all"
            aria-label="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Textarea */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Raw Input JSON</span>
            <span>{input.length} characters</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            rows={12}
            className="w-full font-mono text-xs sm:text-sm p-3.5 sm:p-4 bg-slate-50 dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 transition-colors resize-y min-h-[200px]"
            spellCheck={false}
          />
        </div>

        {/* Output Textarea */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Formatted Result</span>
            <div className="flex items-center gap-2">
              {output && (
                <>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted output will appear here..."
            rows={12}
            className="w-full font-mono text-xs sm:text-sm p-3.5 sm:p-4 bg-slate-50 dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800 rounded-xl text-cyan-900 dark:text-cyan-300 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-y min-h-[200px]"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Validation status badge */}
      {status.message && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            status.valid
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
          }`}
        >
          {status.valid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
