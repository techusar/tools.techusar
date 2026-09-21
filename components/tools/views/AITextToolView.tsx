'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { copyToClipboard, downloadTextFile } from '@/lib/utils';
import { getAnonymousId, trackClientEvent } from '@/lib/analytics/tracker';

export function AITextToolView({ tool }: { tool: ToolItem }) {
  const { user, recordToolUse } = useUser();
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Balanced');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide input text or instructions to generate.');
      return;
    }

    setError('');
    const { canUse } = await recordToolUse(tool);
    if (!canUse) return;

    setLoading(true);
    try {
      const anonId = getAnonymousId();
      let composedPrompt = prompt;

      if (tool.slug === 'ai-text-summarizer') {
        composedPrompt = `Target length: ${length}.\nPlease summarize the following text:\n\n${prompt}`;
      } else if (tool.slug === 'ai-rewriter') {
        composedPrompt = `Selected tone: ${tone}.\nPlease rewrite and polish the following content:\n\n${prompt}`;
      } else if (tool.slug === 'ai-email-writer') {
        composedPrompt = `Tone: ${tone}.\nEmail purpose and details:\n\n${prompt}`;
      }

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: composedPrompt,
          toolSlug: tool.slug,
          anonymousId: anonId,
          userId: user?.id,
          systemPrompt: tool.aiConfig?.systemPrompt,
          temperature: tool.aiConfig?.temperature,
          model: tool.aiConfig?.model,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'USAGE_LIMIT_REACHED') {
          setError(data.message || 'Free usage limit reached.');
        } else {
          setError(data.error || 'Failed to generate response.');
        }
      } else {
        setOutput(data.text);
        setIsSimulated(Boolean(data.isSimulated));
        trackClientEvent('ai_generation', { toolSlug: tool.slug });
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred while connecting to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackClientEvent('copy', { toolSlug: tool.slug });
    }
  };

  const handleDownload = () => {
    if (!output) return;
    downloadTextFile(`${tool.slug}-result.md`, output, 'text/markdown');
    trackClientEvent('download', { toolSlug: tool.slug });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Dynamic Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {tool.slug === 'ai-rewriter' || tool.slug === 'ai-email-writer' ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tone:</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-slate-100 dark:bg-[#171A21] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 sm:px-3 py-1.5 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500"
              >
                <option value="Professional">Professional & Polished</option>
                <option value="Casual">Casual & Friendly</option>
                <option value="Executive">Executive & Authoritative</option>
                <option value="Academic">Academic & Formal</option>
                <option value="Punchy">Punchy & Persuasive</option>
              </select>
            </div>
          ) : null}

          {tool.slug === 'ai-text-summarizer' ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Length:</span>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="bg-slate-100 dark:bg-[#171A21] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 sm:px-3 py-1.5 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500"
              >
                <option value="Concise (3-4 Bullet Points)">Concise (3-4 Bullets)</option>
                <option value="Balanced (Executive Summary)">Balanced (Executive Summary)</option>
                <option value="Comprehensive (Deep Analysis)">Comprehensive (Deep Analysis)</option>
              </select>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (tool.slug === 'ai-text-summarizer') {
                setPrompt(
                  'Cloud computing and serverless architectures have fundamentally altered how modern web applications are deployed. Instead of provisioning dedicated hardware instances, developers can run granular functions on demand with automated horizontal elasticity. This significantly cuts idle resource costs while improving availability across multi-region edge nodes.'
                );
              } else if (tool.slug === 'ai-code-explainer') {
                setPrompt(
                  `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`
                );
              } else if (tool.slug === 'ai-regex-generator') {
                setPrompt('Match valid ISO 8601 date strings like 2026-09-16 with optional time');
              } else {
                setPrompt('Write a brief follow-up note to our client regarding the Q3 product launch timeline.');
              }
            }}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold transition-colors py-1"
          >
            Insert Example Input
          </button>
        </div>
      </div>

      {/* Inputs & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Left Input */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Input Content</span>
            <span>{prompt.length} chars</span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              tool.slug === 'ai-regex-generator'
                ? 'Describe what you want to match in plain English (e.g. "Match valid emails with domain restrictions")...'
                : tool.slug === 'ai-code-explainer'
                ? 'Paste code snippet in JavaScript, Python, Rust, SQL, etc...'
                : 'Paste or type your text here to process with AI...'
            }
            rows={12}
            className="w-full text-xs sm:text-sm p-3.5 sm:p-4 bg-slate-50 dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 transition-colors resize-y leading-relaxed font-sans min-h-[220px]"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 dark:from-cyan-500 dark:via-blue-500 dark:to-indigo-600 text-white dark:text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md dark:shadow-lg shadow-cyan-600/20 disabled:opacity-50 min-h-[44px]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Result</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Output */}
        <div className="space-y-2.5 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              AI Output
            </span>
            {output && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[220px] sm:min-h-[280px] p-3.5 sm:p-4 bg-slate-50 dark:bg-[#0D0F13] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-xs sm:text-sm font-sans overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {output ? (
              <div>{output}</div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-8 sm:py-12">
                <Sparkles className="w-8 h-8 mb-2 text-slate-300 dark:text-slate-700" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">Ready to generate</p>
                <p className="text-xs text-slate-500 dark:text-slate-600 mt-1 max-w-xs">
                  Enter your text on the left and click Generate Result to get an instant AI output.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error / Notice */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
