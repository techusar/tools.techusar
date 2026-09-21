'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Globe, Plus, Trash2, Calendar, Sun, Moon } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

interface CityTimeZone {
  id: string;
  name: string;
  country: string;
  zone: string;
}

const DEFAULT_CITIES: CityTimeZone[] = [
  { id: 'utc', name: 'UTC / GMT', country: 'Universal', zone: 'UTC' },
  { id: 'nyc', name: 'New York', country: 'United States (EDT/EST)', zone: 'America/New_York' },
  { id: 'lon', name: 'London', country: 'United Kingdom (BST/GMT)', zone: 'Europe/London' },
  { id: 'dxb', name: 'Dubai', country: 'United Arab Emirates (GST)', zone: 'Asia/Dubai' },
  { id: 'khi', name: 'Karachi', country: 'Pakistan (PKT)', zone: 'Asia/Karachi' },
  { id: 'del', name: 'New Delhi', country: 'India (IST)', zone: 'Asia/Kolkata' },
  { id: 'tyo', name: 'Tokyo', country: 'Japan (JST)', zone: 'Asia/Tokyo' },
  { id: 'syd', name: 'Sydney', country: 'Australia (AEST)', zone: 'Australia/Sydney' },
];

const AVAILABLE_CITIES: CityTimeZone[] = [
  { id: 'sfo', name: 'San Francisco / LA', country: 'United States (PDT)', zone: 'America/Los_Angeles' },
  { id: 'chi', name: 'Chicago', country: 'United States (CDT)', zone: 'America/Chicago' },
  { id: 'ber', name: 'Berlin / Paris', country: 'Europe (CEST)', zone: 'Europe/Berlin' },
  { id: 'sgp', name: 'Singapore', country: 'Singapore (SGT)', zone: 'Asia/Singapore' },
  { id: 'hkg', name: 'Hong Kong', country: 'Hong Kong (HKT)', zone: 'Asia/Hong_Kong' },
  { id: 'akl', name: 'Auckland', country: 'New Zealand (NZST)', zone: 'Pacific/Auckland' },
  { id: 'sao', name: 'São Paulo', country: 'Brazil (BRT)', zone: 'America/Sao_Paulo' },
];

export function TimeZoneConverterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [selectedCities, setSelectedCities] = useState<CityTimeZone[]>(DEFAULT_CITIES.slice(0, 5));
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [sliderHour, setSliderHour] = useState<number>(new Date().getHours());

  const hasRecorded = useRef(false);
  useEffect(() => {
    if (!hasRecorded.current) {
      hasRecorded.current = true;
      recordToolUse(tool);
      trackClientEvent('tool_use', { toolSlug: tool.slug });
    }
  }, [recordToolUse, tool]);

  const getCityTime = (zone: string) => {
    try {
      const targetDate = new Date(baseDate);
      targetDate.setHours(sliderHour, 0, 0, 0);

      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const hour24Formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: 'numeric',
        hour12: false,
      });

      const hour24 = parseInt(hour24Formatter.format(targetDate), 10);
      const isNight = hour24 < 6 || hour24 >= 20;

      return {
        timeString: timeFormatter.format(targetDate),
        dateString: dateFormatter.format(targetDate),
        hour24,
        isNight,
      };
    } catch {
      return { timeString: '--:--', dateString: '', hour24: 12, isNight: false };
    }
  };

  const addCity = (city: CityTimeZone) => {
    if (!selectedCities.some((c) => c.id === city.id)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (id: string) => {
    setSelectedCities(selectedCities.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Slider Bar to inspect time across the world */}
      <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Global Meeting & Time Planner
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Slide to compare business hours and day/night transitions across all cities.
            </p>
          </div>

          <button
            onClick={() => {
              setBaseDate(new Date());
              setSliderHour(new Date().getHours());
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Reset to Current Time
          </button>
        </div>

        {/* Time slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>00:00 (Midnight)</span>
            <span className="text-cyan-400 font-bold text-sm">{sliderHour}:00 Local Selected</span>
            <span>23:00 (11 PM)</span>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            step="1"
            value={sliderHour}
            onChange={(e) => setSliderHour(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* City Time Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedCities.map((city) => {
          const info = getCityTime(city.zone);
          return (
            <div
              key={city.id}
              className={`p-5 rounded-2xl border transition-all ${
                info.isNight
                  ? 'bg-[#0B0D12] border-slate-800/80 text-slate-300'
                  : 'bg-slate-900/40 dark:bg-[#111318] border-cyan-500/20 text-white shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      info.isNight ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {info.isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{city.name}</h4>
                    <p className="text-[10px] text-slate-400">{city.country}</p>
                  </div>
                </div>

                {selectedCities.length > 2 && (
                  <button
                    onClick={() => removeCity(city.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                    title="Remove city"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono tracking-tight text-cyan-400">
                  {info.timeString}
                </span>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {info.dateString}
                </span>
              </div>

              {/* Working hour badge */}
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Status:</span>
                {info.hour24 >= 9 && info.hour24 <= 17 ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    Business Hours
                  </span>
                ) : info.hour24 >= 18 && info.hour24 <= 22 ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                    Evening / Off-Work
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                    Sleeping / Night
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add More Cities */}
      <div className="p-4 bg-slate-900/50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          Add More World Timezones
        </h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CITIES.filter((c) => !selectedCities.some((s) => s.id === c.id)).map((city) => (
            <button
              key={city.id}
              onClick={() => addCity(city)}
              className="px-3 py-1.5 bg-[#0D0F13] hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3 h-3 text-cyan-400" />
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
