'use client';

import React, { useState } from 'react';
import { Search, Globe, Smartphone, Monitor, Copy, Check } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { copyToClipboard } from '@/lib/utils';

export function SerpPreviewView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [title, setTitle] = useState('TechTools: Free Online Developer & AI Utilities');
  const [url, setUrl] = useState('https://tools.techusar.com');
  const [description, setDescription] = useState(
    'Free high-speed developer utilities, image compressors, QR generators, and Gemini-powered AI assistants with 100% in-browser privacy by TechUsar.'
  );
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  // Recommended character / pixel bounds
  const titleCharCount = title.length;
  const descCharCount = description.length;

  const htmlTags = `<title>${title}</title>\n<meta name="description" content="${description}" />\n<link rel="canonical" href="${url}" />`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(htmlTags);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Page Title (Meta Title)</span>
              <span className={titleCharCount > 60 ? 'text-amber-400' : 'text-slate-400'}>
                {titleCharCount} / 60 characters
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Canonical URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs sm:text-sm text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Meta Description</span>
              <span className={descCharCount > 160 ? 'text-amber-400' : 'text-slate-400'}>
                {descCharCount} / 160 characters
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Right Live Google SERP Simulation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Live Google SERP Preview</span>
            <div className="flex items-center bg-[#171A21] rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                  device === 'desktop' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[10px]">Desktop</span>
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                  device === 'mobile' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[10px]">Mobile</span>
              </button>
            </div>
          </div>

          {/* Google Result Card Simulation (Light style standard for Google) */}
          <div className={`p-5 rounded-xl bg-[#202124] text-white border border-slate-700/80 shadow-lg ${device === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
                T
              </div>
              <div className="flex flex-col text-[11px] leading-tight">
                <span className="text-slate-300 font-medium">TechTools by TechUsar</span>
                <span className="text-slate-400 truncate max-w-[240px] font-sans">{url}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug">
              {title || 'Untilted Page'}
            </h3>

            <p className="text-xs sm:text-sm text-[#bdc1c6] mt-1 line-clamp-2 leading-relaxed font-sans">
              {description || 'Page meta description snippet will appear here...'}
            </p>
          </div>

          {/* HTML Meta Snippet export */}
          <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-400">Exportable HTML Meta Code</span>
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-cyan-300 overflow-x-auto p-2.5 bg-[#14171F] rounded-lg">
              {htmlTags}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
