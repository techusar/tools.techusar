'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Copy, Check, Trash2, Code2, Download, Sparkles, FileText } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const VALID_SAMPLE = `{
  "status": "success",
  "apiVersion": "2026.1",
  "meta": {
    "requestId": "req_88f9a2",
    "timestamp": 1773993600
  },
  "data": {
    "users": [
      {
        "id": 101,
        "name": "Alex Mercer",
        "email": "alex@techusar.com",
        "roles": ["admin", "developer"],
        "isActive": true
      }
    ],
    "count": 1
  }
}`;

const INVALID_SAMPLE = `{
  "status": "error",
  "apiVersion": "2026.1",
  "meta": {
    "requestId": "req_88f9a2",
  },
  "data": {
    'users': [
      {
        "id": 101,
        "name": "Alex Mercer"
      }
    ]
  }
}`;

interface ValidationResult {
  isValid: boolean;
  message?: string;
  line?: number;
  column?: number;
  rootType?: 'object' | 'array' | 'primitive';
  keyCount?: number;
  depth?: number;
  byteSize?: number;
  formattedJson?: string;
}

export function JsonValidatorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [jsonInput, setJsonInput] = useState<string>(VALID_SAMPLE);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const calculateDepth = (obj: any): number => {
    if (obj === null || typeof obj !== 'object') return 0;
    const values = Object.values(obj);
    if (values.length === 0) return 1;
    return 1 + Math.max(...values.map(calculateDepth));
  };

  const countKeys = (obj: any): number => {
    if (obj === null || typeof obj !== 'object') return 0;
    let count = Array.isArray(obj) ? 0 : Object.keys(obj).length;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count += countKeys(obj[key]);
      }
    }
    return count;
  };

  const validateJson = (text: string = jsonInput) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setResult(null);
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const isArr = Array.isArray(parsed);
      const isObj = typeof parsed === 'object' && parsed !== null;
      const rootType = isArr ? 'array' : isObj ? 'object' : 'primitive';

      const keyCount = countKeys(parsed);
      const depth = calculateDepth(parsed);
      const byteSize = new Blob([trimmed]).size;
      const formatted = JSON.stringify(parsed, null, 2);

      setResult({
        isValid: true,
        rootType,
        keyCount,
        depth,
        byteSize,
        formattedJson: formatted,
      });

      recordToolUse(tool);
      trackClientEvent('tool_use', { toolSlug: tool.slug });
    } catch (err: any) {
      let line: number | undefined;
      let column: number | undefined;
      let message = err.message || 'Invalid JSON syntax';

      // Parse line and column from error message if available
      // Chrome/Node format: "at position 124 (line 7 column 5)"
      // Firefox format: "line 7 column 5"
      const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      } else {
        const posMatch = message.match(/position\s+(\d+)/i);
        if (posMatch) {
          const pos = parseInt(posMatch[1], 10);
          const linesBefore = text.slice(0, pos).split('\n');
          line = linesBefore.length;
          column = (linesBefore[linesBefore.length - 1]?.length || 0) + 1;
        }
      }

      setResult({
        isValid: false,
        message,
        line,
        column,
      });

      recordToolUse(tool);
      trackClientEvent('tool_use', { toolSlug: tool.slug, error: true });
    }
  };

  const handleCopy = async () => {
    const textToCopy = result?.formattedJson || jsonInput;
    if (!textToCopy) return;
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackClientEvent('copy', { toolSlug: tool.slug });
    }
  };

  const handleDownload = () => {
    const textToDownload = result?.formattedJson || jsonInput;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validated.json';
    a.click();
    URL.revokeObjectURL(url);
    trackClientEvent('download', { toolSlug: tool.slug });
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-cyan-400" /> JSON Input & Syntax Checker
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setJsonInput(VALID_SAMPLE);
                validateJson(VALID_SAMPLE);
              }}
              className="text-emerald-400 hover:text-emerald-300 font-medium text-xs flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Valid Sample
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => {
                setJsonInput(INVALID_SAMPLE);
                validateJson(INVALID_SAMPLE);
              }}
              className="text-amber-400 hover:text-amber-300 font-medium text-xs flex items-center gap-1"
            >
              Invalid Sample
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setJsonInput('');
              setResult(null);
            }}
            className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Editor & Validate Button */}
      <div className="space-y-3">
        <textarea
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            if (result) validateJson(e.target.value);
          }}
          placeholder="Paste or type JSON string here to validate syntax..."
          rows={12}
          className="w-full p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-200 text-sm font-mono leading-relaxed placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
          spellCheck={false}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => validateJson(jsonInput)}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 text-xs shadow-md shadow-cyan-500/10 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validate JSON Syntax</span>
          </button>

          {result?.isValid && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-[#14171F] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Formatted'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3.5 py-2 rounded-xl bg-[#14171F] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Validation Status Display */}
      {result !== null && (
        <div className="space-y-4">
          {result.isValid ? (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-400">Valid JSON Document</h4>
                  <p className="text-xs text-slate-400">
                    The JSON string is RFC 8259 compliant and correctly structured.
                  </p>
                </div>
              </div>

              {/* Document Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Root Type</span>
                  <span className="text-sm font-bold text-white font-mono capitalize mt-0.5 block">
                    {result.rootType}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Total Keys</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">
                    {result.keyCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Max Nesting Depth</span>
                  <span className="text-sm font-bold text-indigo-400 font-mono mt-0.5 block">
                    {result.depth}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D0F13] border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">Payload Size</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                    {result.byteSize} bytes
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-rose-400">Invalid JSON Syntax</h4>
                  <p className="text-xs text-rose-300 font-mono leading-relaxed">{result.message}</p>
                  {(result.line !== undefined || result.column !== undefined) && (
                    <div className="inline-block mt-2 px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono">
                      Location: Line {result.line ?? '?'}, Column {result.column ?? '?'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Formatted Output Preview */}
          {result.isValid && result.formattedJson && (
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Formatted JSON Preview</span>
                <span className="text-[11px] font-mono">Indentation: 2 spaces</span>
              </div>
              <pre className="p-4 bg-[#14171F] rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto max-h-72 border border-slate-850">
                {result.formattedJson}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
