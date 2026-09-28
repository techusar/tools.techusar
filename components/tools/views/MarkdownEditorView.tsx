'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Eye, Code, Trash2 } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard, downloadTextFile } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent, trackDownload } from '@/lib/analytics/tracker';

const SAMPLE_MARKDOWN = `# Welcome to Markdown Live Editor & Previewer

Markdown is a lightweight markup language that lets you write using an easy-to-read, easy-to-write plain text format.

## Key Features
- **Instant Live Preview** with formatted headers, lists, code blocks, and tables.
- **HTML Export** to copy or download ready-to-use markup.
- **Full Privacy**: Runs 100% in your browser.

### Formatting Examples

| Syntax | Description | Example |
| :--- | :--- | :--- |
| **Bold** | Double asterisks | \`**bold text**\` |
| *Italic* | Single asterisk | \`*italic text*\` |
| [Link](https://techtools.app) | Link markup | \`[Title](URL)\` |

\`\`\`javascript
// Sample JavaScript snippet
function calculateReadingTime(text) {
  const words = text.trim().split(/\\s+/).length;
  return Math.ceil(words / 225);
}
\`\`\`

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
`;

export function MarkdownEditorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [activeTab, setActiveTab] = useState<'split' | 'preview' | 'html'>('split');

  // Simple clean markdown to HTML converter
  const convertMarkdownToHtml = (md: string) => {
    let html = md
      // Escape basic html tags
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Code blocks
      .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-6 mb-3 border-b border-slate-800 pb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-cyan-400 mt-2 mb-4">$1</h1>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-cyan-500 pl-4 py-1.5 my-3 text-slate-300 italic bg-slate-900/40 rounded-r">$1</blockquote>')
      // Bold & Italic
      .replace(/\*\*([^*]+)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*([^*]+)\*/gim, '<em class="italic text-slate-200">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline hover:text-cyan-300">$1</a>')
      // Unordered lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal text-slate-300">$2</li>')
      // Paragraphs
      .replace(/\n\n/gim, '</p><p class="mb-3 text-slate-300 leading-relaxed">')
      .replace(/\n/gim, '<br />');

    return `<div class="markdown-preview leading-relaxed"><p class="mb-3 text-slate-300 leading-relaxed">${html}</p></div>`;
  };

  const htmlOutput = convertMarkdownToHtml(markdown);

  const handleCopyMd = async () => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'copy_md' });
    const ok = await copyToClipboard(markdown);
    if (ok) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  const handleCopyHtml = async () => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'copy_html' });
    const ok = await copyToClipboard(htmlOutput);
    if (ok) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  const handleDownload = () => {
    recordToolUse(tool);
    downloadTextFile('document.md', markdown, 'text/markdown');
    trackDownload({ file_name: 'document.md', file_extension: 'md', tool_slug: tool.slug });
    trackClientEvent('download', { toolSlug: tool.slug, metadata: { file: 'document.md' } });
  };

  return (
    <div className="space-y-4">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'split'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'preview'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Preview Only
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'html'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            HTML Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMarkdown('')}
            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            title="Clear text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={handleCopyMd}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied MD' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={handleCopyHtml}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg flex items-center gap-1.5 border border-cyan-500/30 transition-colors"
          >
            {copiedHtml ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Code className="w-3.5 h-3.5" />}
            <span>{copiedHtml ? 'Copied HTML' : 'Copy HTML'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className={`grid gap-4 ${activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Markdown Source */}
        {(activeTab === 'split' || activeTab === 'html') && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                Markdown Source
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                {markdown.split(/\s+/).filter(Boolean).length} words | {markdown.length} chars
              </span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type or paste Markdown here..."
              rows={22}
              className="w-full font-mono text-xs p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed"
            />
          </div>
        )}

        {/* Live Preview / HTML output */}
        {activeTab === 'split' || activeTab === 'preview' ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                Rendered HTML Preview
              </span>
              <span className="text-[11px] text-cyan-500 font-mono">Live Sync</span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
              className="w-full min-h-[440px] max-h-[600px] overflow-y-auto p-5 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-200 prose prose-invert max-w-none text-sm"
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-cyan-400" />
                Raw HTML Output
              </span>
            </div>
            <textarea
              value={htmlOutput}
              readOnly
              rows={22}
              className="w-full font-mono text-xs p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 focus:outline-none leading-relaxed select-all"
            />
          </div>
        )}
      </div>
    </div>
  );
}
