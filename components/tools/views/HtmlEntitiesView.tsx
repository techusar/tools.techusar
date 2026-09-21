'use client';

import React, { useState, useMemo } from 'react';
import { Binary, Copy, Check, Search } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const COMMON_ENTITIES = [
  { char: '<', entity: '&lt;', hex: '&#x3C;', name: 'Less than' },
  { char: '>', entity: '&gt;', hex: '&#x3E;', name: 'Greater than' },
  { char: '&', entity: '&amp;', hex: '&#x26;', name: 'Ampersand' },
  { char: '"', entity: '&quot;', hex: '&#x22;', name: 'Double quote' },
  { char: "'", entity: '&apos;', hex: '&#x27;', name: 'Single quote / apostrophe' },
  { char: '©', entity: '&copy;', hex: '&#xA9;', name: 'Copyright sign' },
  { char: '®', entity: '&reg;', hex: '&#xAE;', name: 'Registered trademark' },
  { char: '™', entity: '&trade;', hex: '&#x2122;', name: 'Trademark sign' },
  { char: '€', entity: '&euro;', hex: '&#x20AC;', name: 'Euro sign' },
  { char: '£', entity: '&pound;', hex: '&#xA3;', name: 'Pound sign' },
  { char: '¥', entity: '&yen;', hex: '&#xA5;', name: 'Yen sign' },
  { char: '§', entity: '&sect;', hex: '&#xA7;', name: 'Section sign' },
  { char: '•', entity: '&bull;', hex: '&#x2022;', name: 'Bullet point' },
  { char: '…', entity: '&hellip;', hex: '&#x2026;', name: 'Horizontal ellipsis' },
  { char: '—', entity: '&mdash;', hex: '&#x2014;', name: 'Em dash' },
  { char: '–', entity: '&ndash;', hex: '&#x2013;', name: 'En dash' },
  { char: '°', entity: '&deg;', hex: '&#xB0;', name: 'Degree sign' },
  { char: '±', entity: '&plusmn;', hex: '&#xB1;', name: 'Plus-minus sign' },
  { char: '×', entity: '&times;', hex: '&#xD7;', name: 'Multiplication sign' },
  { char: '÷', entity: '&divide;', hex: '&#xF7;', name: 'Division sign' },
  { char: '♥', entity: '&hearts;', hex: '&#x2665;', name: 'Black heart suit' },
  { char: '★', entity: '&#9733;', hex: '&#x2605;', name: 'Black star' },
  { char: '✓', entity: '&#10003;', hex: '&#x2713;', name: 'Check mark' },
  { char: ' ', entity: '&nbsp;', hex: '&#xA0;', name: 'Non-breaking space' },
];

export function HtmlEntitiesView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState('<h1>Hello & Welcome to "TechTools" © 2026</h1>');
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const outputText = useMemo(() => {
    if (mode === 'encode') {
      return inputText.replace(/[\u00A0-\u9999<>&"']/g, (i) => {
        return '&#' + i.charCodeAt(0) + ';';
      });
    } else {
      if (typeof document === 'undefined') return inputText;
      const doc = new DOMParser().parseFromString(inputText, 'text/html');
      return doc.documentElement.textContent || '';
    }
  }, [inputText, mode]);

  const handleCopy = async () => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'copy_entities' });
    const ok = await copyToClipboard(outputText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredEntities = COMMON_ENTITIES.filter(
    (e) =>
      e.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.entity.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.char.includes(searchFilter)
  );

  return (
    <div className="space-y-6">
      {/* Mode switcher toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('encode');
              setInputText('<h1>Hello & Welcome to "TechTools" © 2026</h1>');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              mode === 'encode'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Encode to HTML Entities
          </button>
          <button
            onClick={() => {
              setMode('decode');
              setInputText('&lt;h1&gt;Hello &amp; Welcome to &quot;TechTools&quot; &#xA9; 2026&lt;/h1&gt;');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              mode === 'decode'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Decode HTML Entities
          </button>
        </div>

        <button
          onClick={handleCopy}
          disabled={!outputText}
          className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-950" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Output'}</span>
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            {mode === 'encode' ? 'Raw HTML / Text to Encode' : 'Encoded HTML Entities to Decode'}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            {mode === 'encode' ? 'HTML Entities Output' : 'Decoded Plain Text'}
          </label>
          <textarea
            value={outputText}
            readOnly
            rows={8}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 focus:outline-none leading-relaxed select-all"
          />
        </div>
      </div>

      {/* Searchable Common HTML Entity Quick Lookup Table */}
      <div className="p-4 bg-slate-900/50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Binary className="w-4 h-4 text-cyan-400" />
            Common HTML Entity Quick Reference
          </h4>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search symbol or entity..."
              className="w-full pl-8 pr-3 py-1 bg-[#0D0F13] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
          {filteredEntities.map((item, idx) => (
            <button
              key={idx}
              onClick={async () => {
                await copyToClipboard(item.entity);
                recordToolUse(tool);
              }}
              className="group p-2.5 bg-[#0D0F13] hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-white group-hover:text-cyan-400">{item.char}</span>
                <span className="text-[10px] font-mono text-cyan-400/80 group-hover:text-cyan-300">
                  {item.entity}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">{item.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
