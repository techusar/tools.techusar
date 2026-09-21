'use client';

import React, { useState } from 'react';
import { FileText, Upload, Copy, Check, Info, FileCheck, Eye } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function PdfViewerToolView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
    type: string;
    lastModified: string;
    objectUrl: string | null;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'upload_pdf' });

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const objectUrl = URL.createObjectURL(file);

    setFileInfo({
      name: file.name,
      size: sizeFormatted,
      type: file.type || 'application/pdf',
      lastModified: new Date(file.lastModified).toLocaleDateString(),
      objectUrl,
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="p-8 bg-slate-900/60 dark:bg-[#111318] border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl text-center transition-colors">
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Upload PDF File to Inspect & View</h3>
            <p className="text-xs text-slate-400 mt-1">
              Runs 100% locally in your browser. No files are uploaded to any server.
            </p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-sm">
            Select PDF Document
          </span>
        </label>
      </div>

      {/* If file loaded */}
      {fileInfo && (
        <div className="space-y-5">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#0D0F13] border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Document Name</span>
              <span className="text-xs font-bold text-white truncate block mt-0.5">{fileInfo.name}</span>
            </div>
            <div className="p-4 bg-[#0D0F13] border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">File Size</span>
              <span className="text-xs font-bold text-cyan-400 block mt-0.5">{fileInfo.size}</span>
            </div>
            <div className="p-4 bg-[#0D0F13] border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">MIME Type</span>
              <span className="text-xs font-bold text-emerald-400 block mt-0.5">{fileInfo.type}</span>
            </div>
            <div className="p-4 bg-[#0D0F13] border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Modified</span>
              <span className="text-xs font-bold text-indigo-400 block mt-0.5">{fileInfo.lastModified}</span>
            </div>
          </div>

          {/* In-Browser PDF Preview iframe */}
          {fileInfo.objectUrl && (
            <div className="p-4 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  PDF Document Viewer
                </span>
                <span className="text-slate-400 font-mono text-[11px]">Browser Native Engine</span>
              </div>
              <iframe
                src={fileInfo.objectUrl}
                title="PDF Preview"
                className="w-full h-[600px] rounded-xl border border-slate-800 bg-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
