'use client';

import React, { useState } from 'react';
import { FileCode2, Copy, Check, Play, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2026-09-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2026-09-15</publish_date>
    <description>A fantasy tale of mystery and magic.</description>
  </book>
</catalog>`;

export function XmlYamlFormatterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [inputVal, setInputVal] = useState(SAMPLE_XML);
  const [outputVal, setOutputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);

  // XML Formatter logic
  const formatXml = (xml: string) => {
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    xml = xml.replace(/>\s*</g, '><'); // strip between tags

    const reg = /(>)(<)(\/*)/g;
    const xmlNormalized = xml.replace(reg, '$1\r\n$2$3');

    const lines = xmlNormalized.split('\r\n');
    lines.forEach((node) => {
      let padding = '';
      if (node.match(/.+<\/\w[^>]*>$/)) {
        // Tag with content on single line
        padding = tab.repeat(indent);
      } else if (node.match(/^<\/\w/)) {
        // Closing tag
        if (indent !== 0) indent -= 1;
        padding = tab.repeat(indent);
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        // Opening tag
        padding = tab.repeat(indent);
        indent += 1;
      } else {
        padding = tab.repeat(indent);
      }
      formatted += padding + node + '\r\n';
    });

    return formatted.trim();
  };

  const handleFormat = () => {
    setError(null);
    setValid(null);
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'format_xml' });

    if (!inputVal.trim()) {
      setOutputVal('');
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(inputVal, 'application/xml');
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
          setError(parserError.textContent || 'XML syntax validation error');
          setValid(false);
          return;
        }
      }

      const formatted = formatXml(inputVal);
      setOutputVal(formatted);
      setValid(true);
    } catch (err: any) {
      setError(err.message || 'Formatting failed');
      setValid(false);
    }
  };

  const handleMinify = () => {
    setError(null);
    recordToolUse(tool);
    try {
      const minified = inputVal.replace(/>\s+</g, '><').trim();
      setOutputVal(minified);
      setValid(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(outputVal);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Format / Beautify</span>
          </button>
          <button
            onClick={handleMinify}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Minify XML
          </button>
        </div>

        <div className="flex items-center gap-2">
          {valid === true && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5" />
              Valid XML
            </span>
          )}
          {valid === false && (
            <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-semibold flex items-center gap-1 border border-red-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              Invalid Syntax
            </span>
          )}
          <button
            onClick={handleCopy}
            disabled={!outputVal}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Code areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-400">Input Raw XML / Data</label>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Paste raw XML here..."
            rows={16}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-400">Formatted & Validated Output</label>
          <textarea
            value={outputVal}
            readOnly
            placeholder="Click Format / Beautify to process XML..."
            rows={16}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 focus:outline-none leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
}
