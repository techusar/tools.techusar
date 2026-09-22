'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Copy, Check, RotateCcw, Info, Percent, DollarSign, FileSpreadsheet } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const GST_PRESETS = [
  { rate: 18, label: '18% (Standard / Pakistan FBR)' },
  { rate: 15, label: '15% (Services / Sindh SRB)' },
  { rate: 16, label: '16% (Punjab PRA / Islamabad)' },
  { rate: 17, label: '17% (General / Commercial)' },
  { rate: 5, label: '5% (Reduced Goods)' },
];

export function GstCalculatorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [amount, setAmount] = useState<string>('10000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive'); // exclusive = Add GST, inclusive = Remove GST
  const [copied, setCopied] = useState<boolean>(false);

  const activeRate = isCustom ? parseFloat(customRate) || 0 : gstRate;
  const numAmount = parseFloat(amount) || 0;

  const calculation = useMemo(() => {
    if (numAmount <= 0 || activeRate < 0) {
      return {
        netAmount: 0,
        gstAmount: 0,
        grossAmount: 0,
        effectiveRate: activeRate,
      };
    }

    if (mode === 'exclusive') {
      // Add GST: Amount entered is Net (exclusive of tax)
      const gstAmount = (numAmount * activeRate) / 100;
      const grossAmount = numAmount + gstAmount;
      return {
        netAmount: numAmount,
        gstAmount,
        grossAmount,
        effectiveRate: activeRate,
      };
    } else {
      // Remove GST: Amount entered is Gross (inclusive of tax)
      const netAmount = numAmount / (1 + activeRate / 100);
      const gstAmount = numAmount - netAmount;
      return {
        netAmount,
        gstAmount,
        grossAmount: numAmount,
        effectiveRate: activeRate,
      };
    }
  }, [numAmount, activeRate, mode]);

  const handleCopySummary = async () => {
    const text = `GST Calculation Summary:
• Mode: ${mode === 'exclusive' ? 'Add GST (Exclusive)' : 'Remove GST (Inclusive)'}
• Base Input: ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• GST Rate: ${activeRate}%
• Net Amount: ${calculation.netAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• GST Tax: ${calculation.gstAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Gross: ${calculation.grossAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackClientEvent('copy', { toolSlug: tool.slug });
    }
  };

  const handleReset = () => {
    setAmount('10000');
    setGstRate(18);
    setIsCustom(false);
    setCustomRate('');
    setMode('exclusive');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector (Add GST vs Remove GST) */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#0D0F13] border border-slate-800 rounded-xl">
        <button
          onClick={() => {
            setMode('exclusive');
            recordToolUse(tool);
          }}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'exclusive'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Add GST (Exclusive)</span>
        </button>
        <button
          onClick={() => {
            setMode('inclusive');
            recordToolUse(tool);
          }}
          className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'inclusive'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Remove GST (Inclusive)</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-[#14171F] border border-slate-800">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            {mode === 'exclusive' ? 'Net Amount (Before GST)' : 'Total Amount (Including GST)'}
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                recordToolUse(tool);
              }}
              placeholder="e.g. 10000"
              className="w-full px-4 py-3 bg-[#0D0F13] border border-slate-800 rounded-xl text-white text-base font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {mode === 'exclusive'
              ? 'Enter amount before tax is applied.'
              : 'Enter invoice total that already includes tax.'}
          </span>
        </div>

        {/* GST Rate Preset Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">GST Sales Tax Rate (%)</label>
          <div className="grid grid-cols-3 gap-2">
            {GST_PRESETS.map((p) => (
              <button
                key={p.rate}
                type="button"
                onClick={() => {
                  setGstRate(p.rate);
                  setIsCustom(false);
                  recordToolUse(tool);
                }}
                className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  !isCustom && gstRate === p.rate
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                    : 'bg-[#0D0F13] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {p.rate}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsCustom(true);
                recordToolUse(tool);
              }}
              className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition-all ${
                isCustom
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                  : 'bg-[#0D0F13] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              Custom %
            </button>
          </div>

          {isCustom && (
            <div className="mt-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="Enter custom GST % (e.g. 17.5)"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0D0F13] border border-cyan-500/40 rounded-lg text-white text-xs font-mono focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Result Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Calculation Results ({activeRate}% GST)</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySummary}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Breakdown'}</span>
            </button>
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Net Amount */}
          <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">Net Amount (Pre-Tax)</span>
            <span className="text-xl font-bold text-white font-mono block">
              {calculation.netAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500">Base goods / service cost</span>
          </div>

          {/* GST Amount */}
          <div className="p-4 rounded-xl bg-[#0D0F13] border border-cyan-500/30 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">GST Tax Amount ({activeRate}%)</span>
            <span className="text-xl font-bold text-cyan-400 font-mono block">
              +{calculation.gstAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500">Sales tax component</span>
          </div>

          {/* Gross Amount */}
          <div className="p-4 rounded-xl bg-[#0D0F13] border border-emerald-500/30 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">Gross Total (Final Amount)</span>
            <span className="text-xl font-bold text-emerald-400 font-mono block">
              {calculation.grossAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500">Invoice payable amount</span>
          </div>
        </div>
      </div>

      {/* Formula Explanation Banner */}
      <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 space-y-2 text-xs text-slate-400 leading-relaxed">
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          {mode === 'exclusive' ? 'Add GST Formula (Exclusive)' : 'Remove GST Formula (Inclusive)'}
        </span>
        {mode === 'exclusive' ? (
          <p>
            <span className="font-mono text-slate-300">GST Amount = (Net Amount × {activeRate}) / 100</span>
            <br />
            <span className="font-mono text-slate-300">Gross Total = Net Amount + GST Amount</span>
          </p>
        ) : (
          <p>
            <span className="font-mono text-slate-300">Net Amount = Gross Total / (1 + ({activeRate} / 100))</span>
            <br />
            <span className="font-mono text-slate-300">GST Amount = Gross Total - Net Amount</span>
          </p>
        )}
      </div>

      {/* Tax Jurisdictional Note / Disclaimer */}
      <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-850 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">Jurisdictional Tax Guidance:</p>
        <p>
          In Pakistan, Federal General Sales Tax (GST) is standardized at 18% on taxable supplies under the Federal Board of Revenue (FBR), while provincial revenue authorities (PRA Punjab, SRB Sindh, KPRA KPK, BRA Balochistan) levy sales taxes on services typically ranging between 15% and 16%. Always consult local tax statutes for specific exemptions or withholding regimes.
        </p>
      </div>
    </div>
  );
}
