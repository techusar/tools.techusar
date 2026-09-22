'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, ArrowRight, RefreshCcw, Check, FileImage, ShieldCheck } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { formatBytes, downloadDataUrl } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function JpgToPngView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [pngUrl, setPngUrl] = useState<string>('');
  const [pngSize, setPngSize] = useState<number>(0);
  const [converting, setConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertJpgToPng = (sourceFile: File) => {
    // Basic file validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg'];
    if (!validTypes.includes(sourceFile.type.toLowerCase()) && !sourceFile.name.match(/\.(jpe?g)$/i)) {
      setError('Please upload a valid JPG or JPEG image file.');
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
          setError('Failed to initialize canvas context.');
          setConverting(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setPngUrl(dataUrl);

        // Approximate byte size from data URI
        const head = 'data:image/png;base64,';
        const byteSize = Math.round(((dataUrl.length - head.length) * 3) / 4);
        setPngSize(byteSize);
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
      setError('Failed to read selected file.');
      setConverting(false);
    };

    reader.readAsDataURL(sourceFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      convertJpgToPng(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      convertJpgToPng(dropped);
    }
  };

  const handleDownload = () => {
    if (!pngUrl) return;
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'converted';
    downloadDataUrl(`${baseName}.png`, pngUrl);
    trackClientEvent('download', { toolSlug: tool.slug });
  };

  const handleReset = () => {
    setFile(null);
    setOriginalUrl('');
    setOriginalSize(0);
    setPngUrl('');
    setPngSize(0);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
            accept="image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 flex items-center justify-center mx-auto mb-4 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
            Drop your JPG/JPEG image here or click to browse
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Convert JPG images into clean, lossless PNG format. Processed 100% locally in your browser with zero server uploads for total privacy.
          </p>

          <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Private (Client-Side)
            </span>
            <span>•</span>
            <span>Lossless PNG Output</span>
            <span>•</span>
            <span>Unlimited Conversions</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#14171F] border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {formatBytes(originalSize)} JPG <ArrowRight className="w-3 h-3 inline mx-1 text-cyan-400" /> {formatBytes(pngSize)} PNG
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg bg-[#0D0F13] border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 flex items-center gap-1.5 text-xs font-medium transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Convert Another</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!pngUrl || converting}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 text-xs shadow-md shadow-cyan-500/10 transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Preview */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Original JPG</span>
                <span className="font-mono">{formatBytes(originalSize)}</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40 border border-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original JPG" className="max-h-60 max-w-full object-contain" />
              </div>
            </div>

            {/* Converted Preview */}
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-cyan-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Converted PNG
                </span>
                <span className="font-mono text-slate-300">{formatBytes(pngSize)}</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40 border border-slate-900">
                {converting ? (
                  <div className="text-center text-xs text-slate-400">
                    <RefreshCcw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
                    Converting JPG to PNG...
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={pngUrl} alt="Converted PNG" className="max-h-60 max-w-full object-contain" />
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
