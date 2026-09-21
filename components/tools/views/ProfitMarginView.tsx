'use client';

import React, { useState } from 'react';
import { calculateProfitMargin } from '@/lib/tools/processors';
import { DollarSign, TrendingUp, Percent } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function ProfitMarginView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [cost, setCost] = useState<number>(60);
  const [revenue, setRevenue] = useState<number>(100);

  const res = calculateProfitMargin(Number(cost) || 0, Number(revenue) || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4 p-5 rounded-2xl bg-[#14171F] border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cost of Goods / Item ($)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-base font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Selling Price / Revenue ($)</label>
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-base font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Right Output Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-[#0D0F13] border border-cyan-500/30 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Gross Profit</span>
            <span className="text-2xl font-black text-cyan-400 font-mono mt-2">${res.grossProfit.toFixed(2)}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0F13] border border-emerald-500/30 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Gross Profit Margin</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-2">{res.grossMarginPercent.toFixed(2)}%</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0F13] border border-indigo-500/30 flex flex-col justify-between sm:col-span-2">
            <span className="text-[11px] text-slate-400 font-medium">Markup Percentage</span>
            <span className="text-2xl font-black text-indigo-400 font-mono mt-2">{res.markupPercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
