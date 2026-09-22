'use client';

import React, { useState } from 'react';
import { Copy, Check, Loader2, Terminal, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  className = '',
}: CodeBlockProps) {
  const [copyState, setCopyState] = useState<'idle' | 'loading' | 'copied'>('idle');

  const handleCopy = async () => {
    if (copyState !== 'idle') return;

    setCopyState('loading');

    try {
      await navigator.clipboard.writeText(code.trim());
      // Brief tactile delay so the user clearly perceives the loading state
      setTimeout(() => {
        setCopyState('copied');
        setTimeout(() => {
          setCopyState('idle');
        }, 2200);
      }, 200);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = code.trim();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setTimeout(() => {
        setCopyState('copied');
        setTimeout(() => {
          setCopyState('idle');
        }, 2200);
      }, 200);
    }
  };

  // Format language display label
  const getLanguageLabel = (lang: string) => {
    const l = lang.toLowerCase().trim();
    if (l === 'js' || l === 'javascript') return 'JavaScript';
    if (l === 'ts' || l === 'typescript') return 'TypeScript';
    if (l === 'json') return 'JSON';
    if (l === 'regex' || l === 'regexp') return 'RegEx';
    if (l === 'bash' || l === 'sh' || l === 'shell') return 'Bash';
    if (l === 'html') return 'HTML';
    if (l === 'css') return 'CSS';
    if (l === 'sql') return 'SQL';
    if (l === 'python' || l === 'py') return 'Python';
    if (l === 'text') return 'Code';
    return lang.toUpperCase();
  };

  const lines = code.trim().split('\n');

  return (
    <div
      className={`relative my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#0c1017] text-slate-100 shadow-lg group ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141923] border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2.5">
          {/* Terminal control dots */}
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
          </div>

          <span className="h-3 w-px bg-slate-700/60 mx-1" />

          {/* Filename or Language Badge */}
          {filename ? (
            <span className="font-mono text-slate-300 flex items-center gap-1.5 text-[11px]">
              <Terminal className="w-3 h-3 text-cyan-400" />
              {filename}
            </span>
          ) : (
            <span className="font-mono text-slate-400 flex items-center gap-1.5 text-[11px] font-medium">
              <Code2 className="w-3 h-3 text-cyan-400" />
              {getLanguageLabel(language)}
            </span>
          )}
        </div>

        {/* One-Click Copy Button with Loading & Copied States */}
        <button
          onClick={handleCopy}
          disabled={copyState === 'loading'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            copyState === 'copied'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : copyState === 'loading'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 cursor-wait'
              : 'bg-slate-800/80 hover:bg-slate-750 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/70 hover:border-slate-600'
          }`}
          title="Copy code to clipboard"
          aria-label="Copy code to clipboard"
        >
          {copyState === 'loading' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span className="text-[11px]">Copying...</span>
            </>
          ) : copyState === 'copied' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed selection:bg-cyan-500/30">
        <pre className="m-0 font-mono">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="table-row">
                <span className="table-cell select-none pr-4 text-right text-slate-600 text-[11px] font-mono w-8">
                  {index + 1}
                </span>
                <span className="table-cell text-slate-200 whitespace-pre">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Click-to-copy inline code component with instant tooltip feedback
 */
export function InlineCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading || copied) return;

    setLoading(true);
    setTimeout(() => {
      navigator.clipboard.writeText(code);
      setLoading(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }, 150);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-cyan-700 dark:text-cyan-300 font-mono text-xs transition-colors group relative cursor-pointer"
      title="Click to copy"
      aria-label={`Copy code: ${code}`}
    >
      <span>{code}</span>
      {loading ? (
        <Loader2 className="w-2.5 h-2.5 animate-spin text-cyan-500 shrink-0" />
      ) : copied ? (
        <Check className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
      ) : (
        <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-70 text-slate-400 dark:text-slate-400 transition-opacity shrink-0" />
      )}

      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-sans font-medium whitespace-nowrap shadow-md pointer-events-none z-20">
          Copied!
        </span>
      )}
    </button>
  );
}
