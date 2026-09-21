'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Sparkles, Check, RefreshCcw, ArrowRight } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { formatBytes, downloadDataUrl } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function ImageCompressorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(75);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File, q: number, fmt: 'image/jpeg' | 'image/webp' | 'image/png') => {
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setOriginalUrl(src);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const outUrl = canvas.toDataURL(fmt, q / 100);
          setCompressedUrl(outUrl);

          // Calculate byte size from base64 data URL
          const head = 'data:' + fmt + ';base64,';
          const sizeInBytes = Math.round(((outUrl.length - head.length) * 3) / 4);
          setCompressedSize(sizeInBytes);
        }
        setProcessing(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);
    setOriginalSize(file.size);
    processImage(file, quality, format);
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug });
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (originalFile) {
      processImage(originalFile, newQ, format);
    }
  };

  const handleFormatChange = (newFmt: 'image/jpeg' | 'image/webp' | 'image/png') => {
    setFormat(newFmt);
    if (originalFile) {
      processImage(originalFile, quality, newFmt);
    }
  };

  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  const handleDownload = () => {
    if (!compressedUrl) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const filename = `compressed_${originalFile?.name.replace(/\.[^/.]+$/, '') || 'image'}.${ext}`;
    downloadDataUrl(filename, compressedUrl);
    trackClientEvent('download', { toolSlug: tool.slug });
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      {!originalFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-10 sm:p-14 text-center cursor-pointer bg-[#0D0F13]/60 hover:bg-[#14171F] transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 flex items-center justify-center mx-auto mb-4 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
            Drop your image here or click to browse
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
            Supports PNG, JPG, and WebP. 100% processed in your browser — zero files are uploaded to any server.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#14171F] border border-slate-800">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">Quality: {quality}%</span>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={1}
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-32 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <span className="font-semibold text-slate-200">Format:</span>
                <select
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value as any)}
                  className="bg-[#171A21] border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/webp">WebP (.webp)</option>
                  <option value="image/png">PNG (.png)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setOriginalUrl('');
                  setCompressedUrl('');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#171A21] hover:bg-[#20242C] text-slate-400 hover:text-white text-xs border border-slate-700 flex items-center gap-1.5"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Upload New Image
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                Download Optimized
              </button>
            </div>
          </div>

          {/* Size Metric Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Original File Size</span>
              <span className="text-base font-bold text-white mt-0.5 block">{formatBytes(originalSize)}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Compressed File Size</span>
              <span className="text-base font-bold text-cyan-400 mt-0.5 block">
                {processing ? 'Calculating...' : formatBytes(compressedSize)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 block font-medium">File Size Reduction</span>
              <span className="text-base font-bold text-emerald-300 mt-0.5 block">
                {savingsPercent > 0 ? `-${savingsPercent}% Savings` : 'Optimized'}
              </span>
            </div>
          </div>

          {/* Side by Side Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-400 mb-3 self-start">Original Preview</span>
              <div className="max-h-80 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original" className="max-h-80 object-contain rounded" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D0F13] border border-cyan-500/30 flex flex-col items-center">
              <span className="text-xs font-semibold text-cyan-400 mb-3 self-start">
                Compressed Output ({format === 'image/jpeg' ? 'JPG' : format === 'image/webp' ? 'WebP' : 'PNG'})
              </span>
              <div className="max-h-80 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40">
                {compressedUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={compressedUrl} alt="Compressed" className="max-h-80 object-contain rounded" />
                ) : (
                  <div className="py-20 text-slate-500 text-xs">Generating preview...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
