'use client';

import React, { useState, useMemo } from 'react';
import { calculateCompoundInterest } from '@/lib/tools/processors';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function CompoundInterestView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [principal, setPrincipal] = useState<number>(10000);
  const [annualRate, setAnnualRate] = useState<number>(8);
  const [years, setYears] = useState<number>(10);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // monthly
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(200);

  const res = useMemo(() => {
    return calculateCompoundInterest(
      Number(principal) || 0,
      Number(annualRate) || 0,
      Number(years) || 0,
      Number(compoundFreq) || 12,
      Number(monthlyDeposit) || 0
    );
  }, [principal, annualRate, years, compoundFreq, monthlyDeposit]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-[#14171F] border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Principal ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Contribution ($)</label>
              <input
                type="number"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Annual Return (%)</label>
              <input
                type="number"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Investment Horizon (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D0F13] border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Future Portfolio Value
            </span>
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono tracking-tight">
              ${res.futureValue.toLocaleString()}
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#14171F] border border-slate-800 flex justify-between text-xs">
              <span className="text-slate-400">Total Deposits:</span>
              <span className="font-mono font-bold text-white">${res.totalDeposits.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#14171F] border border-slate-800 flex justify-between text-xs">
              <span className="text-slate-400">Total Compound Interest:</span>
              <span className="font-mono font-bold text-emerald-400">${res.totalInterest.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
