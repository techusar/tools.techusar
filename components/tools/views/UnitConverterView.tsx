'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

type UnitCategory = 'length' | 'weight' | 'data' | 'speed';

const UNIT_CONVERSIONS: Record<UnitCategory, { units: string[]; toBase: Record<string, number> }> = {
  length: {
    units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
    toBase: {
      Meters: 1,
      Kilometers: 1000,
      Centimeters: 0.01,
      Millimeters: 0.001,
      Miles: 1609.344,
      Yards: 0.9144,
      Feet: 0.3048,
      Inches: 0.0254,
    },
  },
  weight: {
    units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds (lbs)', 'Ounces (oz)', 'Metric Tons'],
    toBase: {
      Kilograms: 1,
      Grams: 0.001,
      Milligrams: 0.000001,
      'Pounds (lbs)': 0.45359237,
      'Ounces (oz)': 0.0283495,
      'Metric Tons': 1000,
    },
  },
  data: {
    units: ['Bytes (B)', 'Kilobytes (KB)', 'Megabytes (MB)', 'Gigabytes (GB)', 'Terabytes (TB)', 'Petabytes (PB)'],
    toBase: {
      'Bytes (B)': 1,
      'Kilobytes (KB)': 1024,
      'Megabytes (MB)': 1024 * 1024,
      'Gigabytes (GB)': 1024 * 1024 * 1024,
      'Terabytes (TB)': 1024 * 1024 * 1024 * 1024,
      'Petabytes (PB)': 1024 * 1024 * 1024 * 1024 * 1024,
    },
  },
  speed: {
    units: ['Kilometers per hour (km/h)', 'Miles per hour (mph)', 'Meters per second (m/s)', 'Knots (kn)'],
    toBase: {
      'Kilometers per hour (km/h)': 1,
      'Miles per hour (mph)': 1.60934,
      'Meters per second (m/s)': 3.6,
      'Knots (kn)': 1.852,
    },
  },
};

export function UnitConverterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('Meters');
  const [toUnit, setToUnit] = useState('Feet');
  const [val, setVal] = useState<number>(10);
  const [copied, setCopied] = useState(false);

  const activeCategoryConfig = UNIT_CONVERSIONS[category];
  const fromRate = activeCategoryConfig.toBase[fromUnit] || 1;
  const toRate = activeCategoryConfig.toBase[toUnit] || 1;

  // Convert via base unit
  const baseVal = (Number(val) || 0) * fromRate;
  const converted = baseVal / toRate;
  const displayResult = Number.isInteger(converted) ? converted.toString() : converted.toFixed(6).replace(/\.?0+$/, '');

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const units = UNIT_CONVERSIONS[cat].units;
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(displayResult);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-800">
        {[
          { id: 'length', label: 'Length & Distance' },
          { id: 'weight', label: 'Mass & Weight' },
          { id: 'data', label: 'Digital Storage (Bytes)' },
          { id: 'speed', label: 'Speed & Velocity' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleCategoryChange(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              category === tab.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#171A21] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Conversion Form */}
      <div className="p-6 rounded-2xl bg-[#0D0F13] border border-slate-800 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
          {/* From */}
          <div className="sm:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">From</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#171A21] border border-slate-700 rounded-xl text-base font-mono text-white focus:outline-none focus:border-cyan-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 bg-[#171A21] border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            >
              {activeCategoryConfig.units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex justify-center pt-5">
            <button
              onClick={handleSwap}
              className="p-3 rounded-xl bg-[#171A21] hover:bg-[#20242C] border border-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors"
              title="Swap units"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To */}
          <div className="sm:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">To (Result)</label>
            <div className="w-full px-3.5 py-2.5 bg-[#171A21] border border-cyan-500/30 rounded-xl text-base font-mono font-bold text-cyan-400 select-all truncate">
              {displayResult}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 bg-[#171A21] border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            >
              {activeCategoryConfig.units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Copy Result Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Result' : 'Copy Converted Value'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
