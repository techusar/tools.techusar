'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, ArrowRight, RefreshCcw, Check, FileImage, ShieldCheck, Palette } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { formatBytes, downloadDataUrl } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function PngToJpgView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [jpgUrl, setJpgUrl] = useState<string>('');
  const [jpgSize, setJpgSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(90);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [converting, setConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertPngToJpg = (sourceFile: File, q: number = quality, bg: string = bgColor) => {
    if (!sourceFile.type.toLowerCase().includes('png') && !sourceFile.name.match(/\.png$/i)) {
      setError('Please upload a valid PNG image file.');
      return;
    }

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
          setError('Canvas context could not be initialized.');
          setConverting(false);
          return;
        }

        // Fill background color for transparent pixels (since JPEG does not support alpha channel)
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw original PNG on top of background
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', q / 100);
        setJpgUrl(dataUrl);

        const head = 'data:image/jpeg;base64,';
        const byteSize = Math.round(((dataUrl.length - head.length) * 3) / 4);
        setJpgSize(byteSize);
        setConverting(false);

        recordToolUse(tool);
        trackClientEvent('tool_use', { toolSlug: tool.slug });
      };

      img.onerror = () => {
        setError('Failed to load image. File may be corrupted.');
        setConverting(false);
      };

      img.src = src;
    };

    reader.onerror = () => {
      setError('Failed to read file.');
      setConverting(false);
    };

    reader.readAsDataURL(sourceFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      convertPngToJpg(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      convertPngToJpg(dropped);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) {
      convertPngToJpg(file, newQ, bgColor);
    }
  };

  const handleBgColorChange = (newBg: string) => {
    setBgColor(newBg);
    if (file) {
      convertPngToJpg(file, quality, newBg);
    }
  };

  const handleDownload = () => {
    if (!jpgUrl) return;
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'converted';
    downloadDataUrl(`${baseName}.jpg`, jpgUrl);
    trackClientEvent('download', { toolSlug: tool.slug });
  };

  const handleReset = () => {
    setFile(null);
    setOriginalUrl('');
    setOriginalSize(0);
    setJpgUrl('');
    setJpgSize(0);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savings = originalSize > 0 && jpgSize > 0 ? Math.round(((originalSize - jpgSize) / originalSize) * 100) : 0;

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
            accept="image/png"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 flex items-center justify-center mx-auto mb-4 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
            Drop your PNG image here or click to browse
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Convert PNG graphics and screenshots into high-performance JPG images. Includes custom background color handling for transparent areas.
          </p>

          <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Client-Side Privacy
            </span>
            <span>•</span>
            <span>Adjustable JPG Quality</span>
            <span>•</span>
            <span>Transparency Fill Control</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#14171F] border border-slate-800">
            <div className="flex flex-wrap items-center gap-5 text-xs">
              {/* Quality Slider */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">Quality: {quality}%</span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-28 accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Background Color for Transparency */}
              <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
                <Palette className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-200">Fill Background:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleBgColorChange('#FFFFFF')}
                    className={`w-5 h-5 rounded-full border ${bgColor === '#FFFFFF' ? 'ring-2 ring-cyan-400' : 'border-slate-600'} bg-white`}
                    title="White Background"
                  />
                  <button
                    type="button"
                    onClick={() => handleBgColorChange('#000000')}
                    className={`w-5 h-5 rounded-full border ${bgColor === '#000000' ? 'ring-2 ring-cyan-400' : 'border-slate-600'} bg-black`}
                    title="Black Background"
                  />
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    title="Custom Color"
                  />
                </div>
              </div>
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
                disabled={!jpgUrl || converting}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 text-xs shadow-md shadow-cyan-500/10 transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JPG</span>
              </button>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Preview */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Original PNG</span>
                <span className="font-mono">{formatBytes(originalSize)}</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#181B22_0%_25%,#0F1218_0%_50%)] bg-[length:16px_16px] border border-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original PNG" className="max-h-60 max-w-full object-contain" />
              </div>
            </div>

            {/* Converted Preview */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-cyan-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Converted JPG
                  {savings > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-medium">
                      -{savings}% smaller
                    </span>
                  )}
                </span>
                <span className="font-mono text-slate-300">{formatBytes(jpgSize)}</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40 border border-slate-900">
                {converting ? (
                  <div className="text-center text-xs text-slate-400">
                    <RefreshCcw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
                    Converting PNG to JPG...
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={jpgUrl} alt="Converted JPG" className="max-h-60 max-w-full object-contain" />
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
