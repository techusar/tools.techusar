'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, RefreshCw } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function UnixTimestampView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [inputDate, setInputDate] = useState<string>(() => new Date().toISOString().slice(0, 16));
  const [copied, setCopied] = useState(false);

  // Live timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const epochToDateResult = new Date(inputEpoch * 1000).toUTCString();
  const epochToLocalResult = new Date(inputEpoch * 1000).toLocaleString();

  const dateToEpochResult = Math.floor(new Date(inputDate).getTime() / 1000);

  const handleCopyCurrent = async () => {
    const ok = await copyToClipboard(currentEpoch.toString());
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Live Epoch Banner */}
      <div className="p-6 rounded-2xl bg-[#0D0F13] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            Current Unix Epoch Timestamp
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{currentEpoch}</div>
        </div>
        <button
          onClick={handleCopyCurrent}
          className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy Current Timestamp'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Converter 1: Timestamp to Date */}
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Convert Timestamp to Date
          </h4>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Seconds Epoch Timestamp</label>
            <input
              type="number"
              value={inputEpoch}
              onChange={(e) => setInputEpoch(Number(e.target.value))}
              className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">GMT / UTC Time:</span>
              <span className="font-mono font-semibold text-cyan-300 select-all">{epochToDateResult}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Your Local Time:</span>
              <span className="font-mono font-semibold text-white select-all">{epochToLocalResult}</span>
            </div>
          </div>
        </div>

        {/* Converter 2: Date to Timestamp */}
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Convert Date to Unix Timestamp
          </h4>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Pick Date & Time</label>
            <input
              type="datetime-local"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Unix Epoch (Seconds):</span>
              <span className="font-mono font-bold text-cyan-400 text-base select-all">
                {dateToEpochResult}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Milliseconds:</span>
              <span className="font-mono text-slate-300 text-xs select-all">
                {dateToEpochResult * 1000}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
