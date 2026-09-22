'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, ArrowRight, RefreshCcw, Check, Zap, ShieldCheck } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { formatBytes, downloadDataUrl } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function ImageToWebpView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [webpUrl, setWebpUrl] = useState<string>('');
  const [webpSize, setWebpSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [converting, setConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToWebp = (sourceFile: File, q: number = quality) => {
    setError('');
    setConverting(true);
    setFile(sourceFile);
    setOriginalSize(sourceFile.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setOriginalUrl(src);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setError('Canvas context initialization failed.');
          setConverting(false);
          return;
        }

        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL('image/webp', q / 100);
        setWebpUrl(dataUrl);

        const head = 'data:image/webp;base64,';
        const byteSize = Math.round(((dataUrl.length - head.length) * 3) / 4);
        setWebpSize(byteSize);
        setConverting(false);

        recordToolUse(tool);
        trackClientEvent('tool_use', { toolSlug: tool.slug });
      };

      img.onerror = () => {
        setError('Failed to load image. File may not be a valid image format.');
        setConverting(false);
      };

      img.src = src;
    };

    reader.onerror = () => {
      setError('Could not read the uploaded file.');
      setConverting(false);
    };

    reader.readAsDataURL(sourceFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      convertToWebp(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      convertToWebp(dropped);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) {
      convertToWebp(file, newQ);
    }
  };

  const handleDownload = () => {
    if (!webpUrl) return;
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'image';
    downloadDataUrl(`${baseName}.webp`, webpUrl);
    trackClientEvent('download', { toolSlug: tool.slug });
  };

  const handleReset = () => {
    setFile(null);
    setOriginalUrl('');
    setOriginalSize(0);
    setWebpUrl('');
    setWebpSize(0);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savings = originalSize > 0 && webpSize > 0 ? Math.round(((originalSize - webpSize) / originalSize) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-10 sm:p-14 text-center cursor-pointer bg-[#0D0F13]/60 hover:bg-[#14171F] transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 flex items-center justify-center mx-auto mb-4 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
            Drop your JPG, PNG, or GIF image here or click to browse
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Convert legacy images into ultra-lightweight WebP format. Boost website load speeds and Google Core Web Vitals with zero loss in visual clarity.
          </p>

          <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% In-Browser Private
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Next-Gen Compression
            </span>
            <span>•</span>
            <span>Maintains Transparency</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#14171F] border border-slate-800">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">WebP Quality: {quality}%</span>
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

              {savings > 0 ? (
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Saved {savings}% ({formatBytes(originalSize - webpSize)})
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg bg-[#0D0F13] border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 flex items-center gap-1.5 text-xs font-medium transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>New Image</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!webpUrl || converting}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 text-xs shadow-md shadow-cyan-500/10 transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download WebP</span>
              </button>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Preview */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Original Format</span>
                <span className="font-mono">{formatBytes(originalSize)}</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40 border border-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original Image" className="max-h-60 max-w-full object-contain" />
              </div>
            </div>

            {/* WebP Preview */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-cyan-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Next-Gen WebP
                </span>
                <span className="font-mono text-slate-300">{formatBytes(webpSize)}</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40 border border-slate-900">
                {converting ? (
                  <div className="text-center text-xs text-slate-400">
                    <RefreshCcw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
                    Generating WebP...
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={webpUrl} alt="Converted WebP" className="max-h-60 max-w-full object-contain" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
