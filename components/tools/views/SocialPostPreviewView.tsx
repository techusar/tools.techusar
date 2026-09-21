'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Linkedin, Instagram, Sparkles, Hash } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent } from '@/lib/analytics/tracker';

const SAMPLE_POST = `🚀 Excited to announce the launch of our new developer tool suite at TechTools!

Designed with zero complexity, high performance in-browser computing, and 100% privacy for your code and assets.

Try it out today: https://techtools.app

#DeveloperTools #WebDevelopment #OpenSource #TechLaunch`;

export function SocialPostPreviewView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'instagram'>('twitter');
  const [authorName, setAuthorName] = useState('Sarah Chen');
  const [authorHandle, setAuthorHandle] = useState('@sarahcode');
  const [postText, setPostText] = useState(SAMPLE_POST);
  const [copied, setCopied] = useState(false);

  // Platform limits
  const limits: Record<string, { max: number; name: string }> = {
    twitter: { max: 280, name: 'X / Twitter' },
    linkedin: { max: 3000, name: 'LinkedIn' },
    instagram: { max: 2200, name: 'Instagram Caption' },
  };

  const currentLimit = limits[platform].max;
  const charsLeft = currentLimit - postText.length;
  const isOverLimit = charsLeft < 0;

  const handleCopy = async () => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'copy_social_post' });
    const ok = await copyToClipboard(postText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor form */}
        <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              Social Post Composer
            </h3>

            {/* Platform switcher */}
            <div className="flex items-center bg-[#0D0F13] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPlatform('twitter')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  platform === 'twitter' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>X / Twitter</span>
              </button>
              <button
                onClick={() => setPlatform('linkedin')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  platform === 'linkedin' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>LinkedIn</span>
              </button>
              <button
                onClick={() => setPlatform('instagram')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  platform === 'instagram' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Instagram</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Display Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Handle / Username</label>
              <input
                type="text"
                value={authorHandle}
                onChange={(e) => setAuthorHandle(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-semibold text-slate-400">Post Content</label>
              <span
                className={`font-mono text-xs ${
                  isOverLimit ? 'text-red-400 font-bold' : 'text-slate-400'
                }`}
              >
                {postText.length} / {currentLimit} chars ({charsLeft >= 0 ? `${charsLeft} left` : `${Math.abs(charsLeft)} over`})
              </span>
            </div>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={9}
              className="w-full text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Post!' : 'Copy Post Content'}</span>
          </button>
        </div>

        {/* Live Mock Post Preview */}
        <div className="p-6 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-center">
          <span className="text-xs font-mono text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Live {limits[platform].name} Simulation
          </span>

          {/* Twitter Card */}
          {platform === 'twitter' && (
            <div className="p-5 bg-black rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none">{authorName}</h4>
                  <span className="text-xs text-slate-500">{authorHandle} · Just now</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{postText}</p>

              <div className="pt-2 border-t border-slate-900 flex justify-between text-slate-500 text-xs font-mono">
                <span>💬 12</span>
                <span>🔁 34</span>
                <span>❤️ 158</span>
                <span>📊 2.4K</span>
              </div>
            </div>
          )}

          {/* LinkedIn Card */}
          {platform === 'linkedin' && (
            <div className="p-5 bg-[#1B1F23] rounded-2xl border border-slate-700/60 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/40">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none">{authorName}</h4>
                  <span className="text-[11px] text-slate-400">Software Engineer & Creator · 1h · 🌐</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{postText}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                <span>👍 👏 💡 89 reactions</span>
                <span>14 comments</span>
              </div>
            </div>
          )}

          {/* Instagram Card */}
          {platform === 'instagram' && (
            <div className="p-5 bg-black rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {authorName.charAt(0)}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white">{authorHandle.replace('@', '')}</h4>
              </div>

              <div className="w-full h-40 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-slate-600 text-xs font-mono">
                [Image or Video Asset Placeholder]
              </div>

              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                <strong className="text-white mr-1.5">{authorHandle.replace('@', '')}</strong>
                {postText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
