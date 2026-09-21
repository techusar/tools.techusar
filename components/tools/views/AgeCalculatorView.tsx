'use client';

import React, { useState, useMemo } from 'react';
import { calculateExactAge } from '@/lib/tools/processors';
import { Calendar, Cake } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function AgeCalculatorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [birthDate, setBirthDate] = useState('1998-05-15');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);

  const result = useMemo(() => {
    if (!birthDate) return null;
    return calculateExactAge(birthDate, targetDate);
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-6">
      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#14171F] border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Cake className="w-3.5 h-3.5 text-rose-400" />
            Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Calculate Age As Of
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Main Big Age Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0F13] border border-cyan-500/30 text-center space-y-2 shadow-xl">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Your Exact Age</span>
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {result.years} <span className="text-cyan-400 font-normal text-lg sm:text-2xl">years</span>,{' '}
              {result.months} <span className="text-cyan-400 font-normal text-lg sm:text-2xl">months</span>,{' '}
              {result.days} <span className="text-cyan-400 font-normal text-lg sm:text-2xl">days</span>
            </div>
          </div>

          {/* Granular Breakdown Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Total Months</span>
              <span className="text-base sm:text-lg font-bold text-white mt-0.5 block font-mono">
                {result.totalMonths.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Total Days</span>
              <span className="text-base sm:text-lg font-bold text-white mt-0.5 block font-mono">
                {result.totalDays.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Total Hours</span>
              <span className="text-base sm:text-lg font-bold text-white mt-0.5 block font-mono">
                {result.totalHours.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Next Birthday In</span>
              <span className="text-base sm:text-lg font-bold text-rose-400 mt-0.5 block font-mono">
                {result.nextBirthdayDays} days
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
