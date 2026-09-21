'use client';

import React, { useState } from 'react';
import { decodeJWT } from '@/lib/tools/processors';
import { copyToClipboard } from '@/lib/utils';
import { Shield, KeyRound, Copy, Check, AlertTriangle, Clock } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlY2hVc2FyIFVzZXIiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4z9gE58...';

export function JwtDecoderView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [token, setToken] = useState(SAMPLE_JWT);
  const [decoded, setDecoded] = useState<any>(decodeJWT(SAMPLE_JWT));
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleTokenChange = (val: string) => {
    setToken(val);
    setDecoded(decodeJWT(val));
    recordToolUse(tool);
  };

  const handleCopy = async (sec: string, data: any) => {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedSection(sec);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input JWT */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Encoded JSON Web Token (Header.Payload.Signature)
        </label>
        <textarea
          value={token}
          onChange={(e) => handleTokenChange(e.target.value)}
          placeholder="Paste JWT here (e.g. eyJhbGciOi...)"
          rows={4}
          className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {decoded.error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{decoded.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Header */}
          <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Header (Algorithm & Token Type)
                </span>
                <button
                  onClick={() => handleCopy('header', decoded.header)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedSection === 'header' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'header' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-200 bg-[#0D0F13] p-3 rounded-xl overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>
          </div>

          {/* Payload */}
          <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Payload (Claims & Data)
                </span>
                <button
                  onClick={() => handleCopy('payload', decoded.payload)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedSection === 'payload' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'payload' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="font-mono text-xs text-cyan-300 bg-[#0D0F13] p-3 rounded-xl overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>

            {decoded.isExpired !== undefined && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Expiration Status:
                </span>
                <span className={`font-semibold ${decoded.isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                  {decoded.isExpired ? 'Expired' : 'Active / Valid Expiration'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
