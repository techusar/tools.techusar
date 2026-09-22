'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function BmiCalorieCalculatorView({ tool }: { tool: ToolItem }) {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weight, setWeight] = useState<number>(72); // kg or lbs
  const [height, setHeight] = useState<number>(175); // cm or inches
  const [activityLevel, setActivityLevel] = useState<number>(1.375); // light activity

  // Calculate BMI
  let bmi = 0;
  if (unitSystem === 'metric') {
    const heightInMeters = height / 100;
    if (heightInMeters > 0) {
      bmi = weight / (heightInMeters * heightInMeters);
    }
  } else {
    // Imperial: (weight in lbs / height in inches^2) * 703
    if (height > 0) {
      bmi = (weight / (height * height)) * 703;
    }
  }

  // Calculate BMR (Mifflin-St Jeor Equation)
  let weightKg = unitSystem === 'metric' ? weight : weight * 0.453592;
  let heightCm = unitSystem === 'metric' ? height : height * 2.54;

  let bmr = 0;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const tdee = Math.round(bmr * activityLevel);

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (val < 25) return { label: 'Normal / Healthy Weight', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
    return { label: 'Obese', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const bmiCat = getBmiCategory(bmi);

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border text-center ${bmiCat.bg}`}>
          <span className="text-xs uppercase font-mono font-bold block mb-1 text-slate-300">
            Body Mass Index (BMI)
          </span>
          <span className={`text-4xl sm:text-5xl font-black font-mono ${bmiCat.color}`}>
            {bmi.toFixed(1)}
          </span>
          <span className={`text-xs font-semibold block mt-1 ${bmiCat.color}`}>{bmiCat.label}</span>
        </div>

        <div className="p-5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-center">
          <span className="text-xs uppercase font-mono text-cyan-400 font-bold block mb-1">
            Basal Metabolic Rate (BMR)
          </span>
          <span className="text-4xl sm:text-5xl font-black font-mono text-cyan-300">
            {Math.round(bmr)}
          </span>
          <span className="text-xs text-slate-400 block mt-1">kcal/day at complete rest</span>
        </div>

        <div className="p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-center">
          <span className="text-xs uppercase font-mono text-indigo-400 font-bold block mb-1">
            Daily Maintenance (TDEE)
          </span>
          <span className="text-4xl sm:text-5xl font-black font-mono text-indigo-300">
            {tdee}
          </span>
          <span className="text-xs text-slate-400 block mt-1">kcal/day to maintain weight</span>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Your Body & Activity Metrics
          </h3>

          <div className="flex items-center bg-[#0D0F13] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setUnitSystem('metric');
                setWeight(72);
                setHeight(175);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                unitSystem === 'metric' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Metric (kg / cm)
            </button>
            <button
              onClick={() => {
                setUnitSystem('imperial');
                setWeight(160);
                setHeight(69);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                unitSystem === 'imperial' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Imperial (lbs / in)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full p-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Age (years)</label>
            <input
              type="number"
              value={age}
              min="10"
              max="120"
              onChange={(e) => setAge(parseInt(e.target.value, 10) || 20)}
              className="w-full p-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              value={weight}
              min="20"
              max="400"
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
            </label>
            <input
              type="number"
              value={height}
              min="50"
              max="260"
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Activity Level selection */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-semibold text-slate-300">Daily Physical Activity Level</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
            className="w-full p-3 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
          >
            <option value={1.2}>Sedentary (Little or no exercise, desk job)</option>
            <option value={1.375}>Light Exercise (1-3 days per week)</option>
            <option value={1.55}>Moderate Exercise (3-5 days per week)</option>
            <option value={1.725}>Heavy Exercise (6-7 days per week)</option>
            <option value={1.9}>Athlete / Extreme Training (Physical labor + intense workout)</option>
          </select>
        </div>

        {/* Weight Loss & Gain Goals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div className="p-3 bg-[#0D0F13] rounded-xl border border-slate-800">
            <span className="text-[11px] text-emerald-400 font-semibold block">Mild Weight Loss (-0.25 kg/wk)</span>
            <span className="text-sm font-bold font-mono text-white mt-1 block">{tdee - 250} kcal/day</span>
          </div>

          <div className="p-3 bg-[#0D0F13] rounded-xl border border-slate-800">
            <span className="text-[11px] text-cyan-400 font-semibold block">Standard Weight Loss (-0.5 kg/wk)</span>
            <span className="text-sm font-bold font-mono text-white mt-1 block">{tdee - 500} kcal/day</span>
          </div>

          <div className="p-3 bg-[#0D0F13] rounded-xl border border-slate-800">
            <span className="text-[11px] text-indigo-400 font-semibold block">Muscle Gain / Bulking (+0.25 kg/wk)</span>
            <span className="text-sm font-bold font-mono text-white mt-1 block">{tdee + 300} kcal/day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
