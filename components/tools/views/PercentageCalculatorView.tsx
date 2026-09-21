'use client';

import React, { useState } from 'react';
import { calculatePercentage } from '@/lib/tools/processors';
import { Percent, ArrowRight } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function PercentageCalculatorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();

  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<number>(15);
  const [m1Y, setM1Y] = useState<number>(300);

  // Mode 2: X is what % of Y?
  const [m2X, setM2X] = useState<number>(45);
  const [m2Y, setM2Y] = useState<number>(200);

  // Mode 3: % Increase/Decrease from X to Y
  const [m3X, setM3X] = useState<number>(100);
  const [m3Y, setM3Y] = useState<number>(140);

  const res1 = calculatePercentage('what_is_x_percent_of_y', m1X, m1Y);
  const res2 = calculatePercentage('x_is_what_percent_of_y', m2X, m2Y);
  const res3 = calculatePercentage('percentage_change', m3X, m3Y);

  return (
    <div className="space-y-6">
      {/* Mode 1 */}
      <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Calculation 1: What is X% of Y?
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-300">What is</span>
          <input
            type="number"
            value={m1X}
            onChange={(e) => setM1X(Number(e.target.value))}
            className="w-24 px-3 py-1.5 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-none focus:border-cyan-500"
          />
          <span className="text-slate-300">% of</span>
          <input
            type="number"
            value={m1Y}
            onChange={(e) => setM1Y(Number(e.target.value))}
            className="w-32 px-3 py-1.5 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-none focus:border-cyan-500"
          />
          <span className="text-slate-300">=</span>
          <div className="px-4 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 font-mono font-bold text-cyan-400 text-base">
            {res1.result}
          </div>
        </div>
        <p className="text-xs text-slate-500">{res1.explanation}</p>
      </div>

      {/* Mode 2 */}
      <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          Calculation 2: X is what percent of Y?
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <input
            type="number"
            value={m2X}
            onChange={(e) => setM2X(Number(e.target.value))}
            className="w-28 px-3 py-1.5 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-none focus:border-cyan-500"
          />
          <span className="text-slate-300">is what percent of</span>
          <input
            type="number"
            value={m2Y}
            onChange={(e) => setM2Y(Number(e.target.value))}
            className="w-28 px-3 py-1.5 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-none focus:border-cyan-500"
          />
          <span className="text-slate-300">=</span>
          <div className="px-4 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 font-mono font-bold text-indigo-400 text-base">
            {res2.result}%
          </div>
        </div>
        <p className="text-xs text-slate-500">{res2.explanation}</p>
      </div>

      {/* Mode 3 */}
      <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          Calculation 3: Percentage Increase / Decrease
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-300">From</span>
          <input
            type="number"
            value={m3X}
            onChange={(e) => setM3X(Number(e.target.value))}
            className="w-28 px-3 py-1.5 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-none focus:border-cyan-500"
          />
          <span className="text-slate-300">to</span>
          <input
            type="number"
            value={m3Y}
            onChange={(e) => setM3Y(Number(e.target.value))}
            className="w-28 px-3 py-1.5 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-none focus:border-cyan-500"
          />
          <span className="text-slate-300">=</span>
          <div
            className={`px-4 py-1.5 rounded-lg font-mono font-bold text-base border ${
              res3.result >= 0
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {res3.result > 0 ? `+${res3.result}% Increase` : `${res3.result}% Decrease`}
          </div>
        </div>
        <p className="text-xs text-slate-500">{res3.explanation}</p>
      </div>
    </div>
  );
}
