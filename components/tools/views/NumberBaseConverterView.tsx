'use client';

import React, { useState } from 'react';
import { Binary, Copy, Check, Calculator, Sparkles } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function NumberBaseConverterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [decimalVal, setDecimalVal] = useState<string>('255');
  const [binaryVal, setBinaryVal] = useState<string>('11111111');
  const [hexVal, setHexVal] = useState<string>('FF');
  const [octalVal, setOctalVal] = useState<string>('377');
  const [asciiVal, setAsciiVal] = useState<string>('ÿ');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const updateFromDecimal = (decStr: string) => {
    setDecimalVal(decStr);
    const num = parseInt(decStr, 10);
    if (isNaN(num)) {
      setBinaryVal('');
      setHexVal('');
      setOctalVal('');
      setAsciiVal('');
      return;
    }
    setBinaryVal(num.toString(2));
    setHexVal(num.toString(16).toUpperCase());
    setOctalVal(num.toString(8));
    setAsciiVal(num >= 32 && num <= 126 ? String.fromCharCode(num) : num <= 255 ? String.fromCharCode(num) : '');
  };

  const updateFromBinary = (binStr: string) => {
    setBinaryVal(binStr);
    const num = parseInt(binStr, 2);
    if (isNaN(num)) return;
    setDecimalVal(num.toString(10));
    setHexVal(num.toString(16).toUpperCase());
    setOctalVal(num.toString(8));
    setAsciiVal(num >= 32 && num <= 255 ? String.fromCharCode(num) : '');
  };

  const updateFromHex = (hexStr: string) => {
    setHexVal(hexStr);
    const num = parseInt(hexStr, 16);
    if (isNaN(num)) return;
    setDecimalVal(num.toString(10));
    setBinaryVal(num.toString(2));
    setOctalVal(num.toString(8));
    setAsciiVal(num >= 32 && num <= 255 ? String.fromCharCode(num) : '');
  };

  const updateFromOctal = (octStr: string) => {
    setOctalVal(octStr);
    const num = parseInt(octStr, 8);
    if (isNaN(num)) return;
    setDecimalVal(num.toString(10));
    setBinaryVal(num.toString(2));
    setHexVal(num.toString(16).toUpperCase());
    setAsciiVal(num >= 32 && num <= 255 ? String.fromCharCode(num) : '');
  };

  const handleCopy = async (val: string, fieldName: string) => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: `copy_${fieldName}` });
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Binary className="w-4 h-4 text-cyan-400" />
          Real-Time Number Base & Radix Converter
        </h3>
        <p className="text-xs text-slate-400">
          Type in any field to instantly calculate corresponding representations in all other bases.
        </p>

        <div className="space-y-4 pt-2">
          {/* Decimal */}
          <div className="p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cyan-400 font-mono">Decimal (Base 10)</span>
              <button
                onClick={() => handleCopy(decimalVal, 'decimal')}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedField === 'decimal' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'decimal' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <input
              type="text"
              value={decimalVal}
              onChange={(e) => updateFromDecimal(e.target.value)}
              className="w-full font-mono text-sm text-white bg-transparent border-0 focus:outline-none"
            />
          </div>

          {/* Binary */}
          <div className="p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-400 font-mono">Binary (Base 2)</span>
              <button
                onClick={() => handleCopy(binaryVal, 'binary')}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedField === 'binary' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'binary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <input
              type="text"
              value={binaryVal}
              onChange={(e) => updateFromBinary(e.target.value)}
              className="w-full font-mono text-sm text-emerald-300 bg-transparent border-0 focus:outline-none"
            />
          </div>

          {/* Hexadecimal */}
          <div className="p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-indigo-400 font-mono">Hexadecimal (Base 16)</span>
              <button
                onClick={() => handleCopy(hexVal, 'hex')}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedField === 'hex' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'hex' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <input
              type="text"
              value={hexVal}
              onChange={(e) => updateFromHex(e.target.value)}
              className="w-full font-mono text-sm text-indigo-300 bg-transparent border-0 focus:outline-none"
            />
          </div>

          {/* Octal */}
          <div className="p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-amber-400 font-mono">Octal (Base 8)</span>
              <button
                onClick={() => handleCopy(octalVal, 'octal')}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedField === 'octal' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'octal' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <input
              type="text"
              value={octalVal}
              onChange={(e) => updateFromOctal(e.target.value)}
              className="w-full font-mono text-sm text-amber-300 bg-transparent border-0 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
