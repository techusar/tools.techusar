'use client';

import React, { useState, useRef } from 'react';
import { Upload, Copy, Check, FileCode, ArrowRight } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function ImageToBase64View({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [base64Str, setBase64Str] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBase64Str(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    recordToolUse(tool);
  };

  const handleCopy = async () => {
    if (!base64Str) return;
    const ok = await copyToClipboard(base64Str);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {!base64Str ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-12 text-center cursor-pointer bg-[#0D0F13]/60 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Upload image to encode into Base64 Data URI</h3>
          <p className="text-xs text-slate-400 mt-1">Directly embeddable in HTML &lt;img src=&quot;...&quot;&gt; and CSS stylesheets</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 truncate max-w-sm">File: {fileName}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBase64Str('')}
                className="px-3 py-1.5 rounded-lg bg-[#171A21] border border-slate-700 text-slate-400 hover:text-white text-xs"
              >
                Upload Different File
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Base64 String'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 p-4 rounded-xl bg-[#0D0F13] border border-slate-800 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={base64Str} alt="Encoded Preview" className="max-h-56 object-contain rounded" />
            </div>
            <div className="md:col-span-8">
              <textarea
                value={base64Str}
                readOnly
                rows={9}
                className="w-full font-mono text-[11px] p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300/90 select-all focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
