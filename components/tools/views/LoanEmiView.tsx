'use client';

import React, { useState, useMemo } from 'react';
import { calculateLoanEmi } from '@/lib/tools/processors';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function LoanEmiView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [principal, setPrincipal] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const result = useMemo(() => {
    return calculateLoanEmi(Number(principal) || 0, Number(interestRate) || 0, Number(tenureYears) || 0);
  }, [principal, interestRate, tenureYears]);

  const principalPercent = result.totalPayment > 0 ? Math.round((principal / result.totalPayment) * 100) : 0;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-5 p-5 rounded-2xl bg-[#14171F] border border-slate-800">
          {/* Principal */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Loan Amount (Principal)</span>
              <span className="font-mono text-cyan-400 font-bold">${Number(principal).toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500 mb-2"
            />
            <input
              type="range"
              min={1000}
              max={1000000}
              step={1000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Interest Rate (% per annum)</span>
              <span className="font-mono text-cyan-400 font-bold">{interestRate}%</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500 mb-2"
            />
            <input
              type="range"
              min={1}
              max={30}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Loan Tenure (Years)</span>
              <span className="font-mono text-cyan-400 font-bold">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500 mb-2"
            />
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#0D0F13] border border-slate-800 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Monthly Repayment (EMI)
            </span>
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono tracking-tight">
              ${result.monthlyEmi.toLocaleString()}
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#14171F] border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Principal:</span>
              <span className="font-mono font-bold text-white">${Number(principal).toLocaleString()}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#14171F] border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Interest Payable:</span>
              <span className="font-mono font-bold text-rose-400">${result.totalInterest.toLocaleString()}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#171A21] border border-cyan-500/20 flex justify-between items-center text-xs font-bold">
              <span className="text-slate-300">Total Payment (Principal + Interest):</span>
              <span className="font-mono text-cyan-400">${result.totalPayment.toLocaleString()}</span>
            </div>
          </div>

          {/* Ratio bar */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
              <span>Principal: {principalPercent}%</span>
              <span>Interest: {interestPercent}%</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-cyan-400 h-full" style={{ width: `${principalPercent}%` }} />
              <div className="bg-rose-400 h-full" style={{ width: `${interestPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
