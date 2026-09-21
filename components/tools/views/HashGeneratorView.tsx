'use client';

import React, { useState, useEffect } from 'react';
import { generateHashes } from '@/lib/tools/processors';
import { copyToClipboard } from '@/lib/utils';
import { Copy, Check, Hash, RefreshCcw } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';

export function HashGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [input, setInput] = useState('TechTools by TechUsar');
  const [hashes, setHashes] = useState<any>({ sha256: '', sha512: '', sha1: '', md5: '' });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!input) {
      Promise.resolve().then(() => {
        if (active) setHashes({ sha256: '', sha512: '', sha1: '', md5: '' });
      });
      return () => {
        active = false;
      };
    }
    generateHashes(input).then((res) => {
      if (active) setHashes(res);
    });
    return () => {
      active = false;
    };
  }, [input]);

  const handleCopy = async (key: string, val: string) => {
    if (!val) return;
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const hashList = [
    { key: 'sha256', label: 'SHA-256 (Modern Standard)', value: hashes.sha256 },
    { key: 'sha512', label: 'SHA-512 (High Security)', value: hashes.sha512 },
    { key: 'sha1', label: 'SHA-1 (Legacy / Git OIDs)', value: hashes.sha1 },
    { key: 'md5', label: 'MD5 (Checksum / Legacy)', value: hashes.md5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Input String to Hash
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate cryptographic hashes in real time..."
          rows={3}
          className="w-full p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="space-y-4">
        {hashList.map((item) => (
          <div key={item.key} className="p-4 rounded-xl bg-[#14171F] border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">{item.label}</span>
              <button
                onClick={() => handleCopy(item.key, item.value)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                {copiedKey === item.key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === item.key ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="font-mono text-xs text-cyan-300/90 break-all select-all bg-[#0D0F13] p-2.5 rounded-lg border border-slate-800">
              {item.value || 'Calculating...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
