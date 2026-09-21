'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, Sparkles, Copy, Check } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { downloadDataUrl, copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function FaviconGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [srcUrl, setSrcUrl] = useState<string>('');
  const [ico16, setIco16] = useState<string>('');
  const [ico32, setIco32] = useState<string>('');
  const [ico192, setIco192] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSizes = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const makeSize = (sz: number) => {
        const c = document.createElement('canvas');
        c.width = sz;
        c.height = sz;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, sz, sz);
          return c.toDataURL('image/png');
        }
        return '';
      };
      setIco16(makeSize(16));
      setIco32(makeSize(32));
      setIco192(makeSize(192));
    };
    img.src = dataUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setSrcUrl(url);
      generateSizes(url);
    };
    reader.readAsDataURL(file);
    recordToolUse(tool);
  };

  const htmlTags = `<!-- Standard Favicons -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(htmlTags);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {!srcUrl ? (
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
          <h3 className="text-base font-bold text-white">Upload logo or square image</h3>
          <p className="text-xs text-slate-400 mt-1">Automatically packages 16x16, 32x32, and 192x192 Web App icons</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 16x16 */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 flex flex-col items-center justify-between space-y-3">
              <span className="text-xs font-semibold text-slate-400">16x16 Standard Icon</span>
              <div className="w-16 h-16 bg-[#171A21] rounded-lg flex items-center justify-center border border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {ico16 && <img src={ico16} alt="16x16" className="w-4 h-4" />}
              </div>
              <button
                onClick={() => downloadDataUrl('favicon-16x16.png', ico16)}
                className="w-full py-1.5 rounded-lg bg-[#171A21] hover:bg-[#222733] text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download 16px</span>
              </button>
            </div>

            {/* 32x32 */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 flex flex-col items-center justify-between space-y-3">
              <span className="text-xs font-semibold text-slate-400">32x32 Retina Tab</span>
              <div className="w-16 h-16 bg-[#171A21] rounded-lg flex items-center justify-center border border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {ico32 && <img src={ico32} alt="32x32" className="w-8 h-8" />}
              </div>
              <button
                onClick={() => downloadDataUrl('favicon-32x32.png', ico32)}
                className="w-full py-1.5 rounded-lg bg-[#171A21] hover:bg-[#222733] text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download 32px</span>
              </button>
            </div>

            {/* 192x192 */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 flex flex-col items-center justify-between space-y-3">
              <span className="text-xs font-semibold text-slate-400">192x192 PWA Icon</span>
              <div className="w-16 h-16 bg-[#171A21] rounded-lg flex items-center justify-center border border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {ico192 && <img src={ico192} alt="192x192" className="w-12 h-12 rounded" />}
              </div>
              <button
                onClick={() => downloadDataUrl('android-chrome-192x192.png', ico192)}
                className="w-full py-1.5 rounded-lg bg-[#171A21] hover:bg-[#222733] text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download 192px</span>
              </button>
            </div>
          </div>

          {/* HTML Meta Snippet */}
          <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-slate-400">Favicon HTML Meta Headers</span>
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-cyan-300 bg-[#14171F] p-3 rounded-lg overflow-x-auto">
              {htmlTags}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
