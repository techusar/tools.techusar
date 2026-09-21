'use client';

import React, { useState } from 'react';
import { Link2, Copy, Check, QrCode as QrIcon } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function UtmBuilderView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [baseUrl, setBaseUrl] = useState('https://tools.techusar.com');
  const [source, setSource] = useState('google');
  const [medium, setMedium] = useState('cpc');
  const [campaign, setCampaign] = useState('launch_2026');
  const [term, setTerm] = useState('online+tools');
  const [content, setContent] = useState('banner_v1');
  const [copied, setCopied] = useState(false);

  // Construct URL
  const buildUrl = () => {
    if (!baseUrl) return '';
    try {
      const url = new URL(baseUrl);
      if (source) url.searchParams.set('utm_source', source);
      if (medium) url.searchParams.set('utm_medium', medium);
      if (campaign) url.searchParams.set('utm_campaign', campaign);
      if (term) url.searchParams.set('utm_term', term);
      if (content) url.searchParams.set('utm_content', content);
      return url.toString();
    } catch {
      return `${baseUrl}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
    }
  };

  const finalUrl = buildUrl();

  const handleCopy = async () => {
    if (!finalUrl) return;
    const ok = await copyToClipboard(finalUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Result Output Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0D0F13] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full font-mono text-xs sm:text-sm text-cyan-400 break-all select-all">
          {finalUrl || 'Enter URL below...'}
        </div>
        <button
          onClick={handleCopy}
          className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy Trackable URL'}</span>
        </button>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Website Target URL (Required)
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com/pricing"
            className="w-full px-3.5 py-2.5 bg-[#14171F] border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Campaign Source (utm_source)
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. google, newsletter, twitter"
            className="w-full px-3.5 py-2.5 bg-[#14171F] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Campaign Medium (utm_medium)
          </label>
          <input
            type="text"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="e.g. cpc, email, banner, social"
            className="w-full px-3.5 py-2.5 bg-[#14171F] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Campaign Name (utm_campaign)
          </label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="e.g. spring_sale, product_launch"
            className="w-full px-3.5 py-2.5 bg-[#14171F] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Campaign Term / Keyword (utm_term)
          </label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. running+shoes, cloud+hosting"
            className="w-full px-3.5 py-2.5 bg-[#14171F] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
