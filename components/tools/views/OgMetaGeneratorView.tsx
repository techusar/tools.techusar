'use client';

import React, { useState } from 'react';
import { Share2, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function OgMetaGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [ogTitle, setOgTitle] = useState('TechTools: Free High-Speed Online Utilities & AI Suite');
  const [ogDesc, setOgDesc] = useState('Comprehensive suite of 60+ online developer, design, SEO, and AI tools.');
  const [ogUrl, setOgUrl] = useState('https://tools.techusar.com');
  const [ogImage, setOgImage] = useState('https://tools.techusar.com/og-banner.png');
  const [siteName, setSiteName] = useState('TechTools by TechUsar');
  const [copied, setCopied] = useState(false);

  const metaHtml = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${ogUrl}" />
<meta property="og:title" content="${ogTitle}" />
<meta property="og:description" content="${ogDesc}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${ogUrl}" />
<meta name="twitter:title" content="${ogTitle}" />
<meta name="twitter:description" content="${ogDesc}" />
<meta name="twitter:image" content="${ogImage}" />`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(metaHtml);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">OG Title</label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">OG Description</label>
            <textarea
              value={ogDesc}
              onChange={(e) => setOgDesc(e.target.value)}
              rows={3}
              className="w-full p-3 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Page URL</label>
            <input
              type="url"
              value={ogUrl}
              onChange={(e) => setOgUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Social Preview Image URL</label>
            <input
              type="url"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Site Name / Brand</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Right Social Card Simulation */}
        <div className="space-y-4">
          <span className="text-xs font-semibold text-slate-300 block">Live Social Card Preview</span>

          <div className="rounded-2xl border border-slate-700/80 bg-[#171A21] overflow-hidden shadow-xl max-w-md mx-auto">
            <div className="h-44 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              {ogImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={ogImage}
                  alt="OG Banner Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-slate-600" />
              )}
            </div>
            <div className="p-4 space-y-1.5 bg-[#0D0F13]">
              <span className="text-[11px] uppercase font-mono text-slate-500">{new URL(ogUrl || 'https://tools.techusar.com').hostname}</span>
              <h4 className="text-sm font-bold text-white line-clamp-1">{ogTitle}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ogDesc}</p>
            </div>
          </div>

          {/* Export snippet */}
          <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-400">Generated Meta Tags</span>
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] text-cyan-300 overflow-x-auto p-2.5 bg-[#14171F] rounded-lg">
              {metaHtml}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
