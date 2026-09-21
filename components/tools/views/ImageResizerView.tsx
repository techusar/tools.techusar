'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCcw, Lock, Unlock, Image as ImageIcon } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { downloadDataUrl, formatBytes } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function ImageResizerView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeCanvas = (src: string, w: number, h: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const outUrl = canvas.toDataURL('image/png');
        setResizedUrl(outUrl);
      }
    };
    img.src = src;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setOriginalUrl(src);

      const img = new Image();
      img.onload = () => {
        setOrigW(img.width);
        setOrigH(img.height);
        setWidth(img.width);
        setHeight(img.height);
        resizeCanvas(src, img.width, img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    recordToolUse(tool);
  };

  const handleWidthChange = (newW: number) => {
    setWidth(newW);
    let newH = height;
    if (lockAspect && origW > 0) {
      newH = Math.round((newW / origW) * origH);
      setHeight(newH);
    }
    if (originalUrl) resizeCanvas(originalUrl, newW, newH);
  };

  const handleHeightChange = (newH: number) => {
    setHeight(newH);
    let newW = width;
    if (lockAspect && origH > 0) {
      newW = Math.round((newH / origH) * origW);
      setWidth(newW);
    }
    if (originalUrl) resizeCanvas(originalUrl, newW, newH);
  };

  const handleDownload = () => {
    if (!resizedUrl) return;
    downloadDataUrl(`resized_${width}x${height}.png`, resizedUrl);
  };

  return (
    <div className="space-y-6">
      {!originalFile ? (
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
          <h3 className="text-base font-bold text-white">Select image to resize</h3>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP, GIF supported · 100% in-browser processing</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dimension Controls */}
          <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono focus:outline-none"
                />
              </div>

              <button
                onClick={() => setLockAspect(!lockAspect)}
                className={`p-2 rounded-lg mt-4 border ${
                  lockAspect ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#0D0F13] border-slate-700 text-slate-500'
                }`}
                title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
              >
                {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>

              <div>
                <label className="block text-slate-400 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 bg-[#0D0F13] border border-slate-700 rounded-lg text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOriginalFile(null)}
                className="px-3 py-1.5 rounded-lg bg-[#0D0F13] border border-slate-700 text-slate-400 hover:text-white"
              >
                Upload Another
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ({width}x{height})</span>
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-400 mb-3 self-start">Resized Preview</span>
            <div className="max-h-80 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resizedUrl || originalUrl} alt="Resized Preview" className="max-h-80 object-contain rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
