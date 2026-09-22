'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Hash, Check } from 'lucide-react';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { slugifyHeading, TocItem } from '@/lib/blog/tableOfContents';
import { CodeBlock, InlineCode } from '@/components/blog/CodeBlock';

interface ArticleContentProps {
  content: string | string[];
  headings: TocItem[];
}

export function ArticleContent({ content, headings }: ArticleContentProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Normalize content into an array of paragraphs/blocks
  const rawBlocks: string[] = Array.isArray(content)
    ? content
    : typeof content === 'string'
    ? content.split('\n\n').filter((b) => b.trim().length > 0)
    : [];

  const copyAnchor = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Helper to parse markdown links, code, and bold formatting
  const renderFormattedText = (text: string) => {
    // Split by markdown link pattern [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseInlineFormatting(text.slice(lastIndex, match.index), `${lastIndex}`));
      }
      const label = match[1];
      const href = match[2];
      parts.push(
        <Link
          key={`link-${match.index}`}
          href={href}
          className="text-cyan-600 dark:text-cyan-400 font-semibold underline decoration-cyan-500/30 hover:decoration-cyan-500 transition-colors"
        >
          {label}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(parseInlineFormatting(text.slice(lastIndex), `${lastIndex}`));
    }

    return parts;
  };

  // Helper to parse **bold** and `code`
  const parseInlineFormatting = (str: string, keyPrefix: string): React.ReactNode => {
    // Replace inline `code`
    const codeParts = str.split(/`([^`]+)`/g);
    return codeParts.map((sub, idx) => {
      if (idx % 2 === 1) {
        return <InlineCode key={`${keyPrefix}-code-${idx}`} code={sub} />;
      }
      // Replace **bold**
      const boldParts = sub.split(/\*\*([^*]+)\*\*/g);
      return boldParts.map((bSub, bIdx) => {
        if (bIdx % 2 === 1) {
          return (
            <strong key={`${keyPrefix}-bold-${idx}-${bIdx}`} className="font-bold text-slate-900 dark:text-white">
              {bSub}
            </strong>
          );
        }
        return bSub;
      });
    });
  };

  // Keep track of which heading index we match to guarantee unique IDs
  let headingPointer = 0;

  return (
    <div className="space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
      {rawBlocks.map((block, blockIndex) => {
        const trimmed = block.trim();
        const midPoint = Math.max(1, Math.floor(rawBlocks.length / 2));
        const isMidPoint = blockIndex === midPoint - 1 && rawBlocks.length > 2;

        // Check if block is H2
        const isH2 = trimmed.startsWith('## ') && !trimmed.startsWith('### ');
        const isH3 = trimmed.startsWith('### ');

        if (isH2 || isH3) {
          const rawText = trimmed.replace(/^###?\s+/, '');
          const cleanText = rawText.replace(/[*_`]/g, '').trim();

          // Find corresponding TOC item
          const tocItem = headings[headingPointer];
          const headingId = tocItem ? tocItem.id : slugifyHeading(cleanText);
          headingPointer++;

          if (isH2) {
            return (
              <React.Fragment key={blockIndex}>
                <div
                  id={headingId}
                  className="group pt-8 pb-3 border-b border-slate-100 dark:border-slate-800 scroll-mt-24 flex items-center justify-between"
                >
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {cleanText}
                  </h2>
                  <button
                    onClick={() => copyAnchor(headingId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                    title="Copy section link"
                    aria-label={`Copy link for ${cleanText}`}
                  >
                    {copiedId === headingId ? (
                      <span className="flex items-center gap-1 text-emerald-500 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </span>
                    ) : (
                      <Hash className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {isMidPoint && (
                  <AdWrapper
                    slot="blogArticleMid"
                    placement="blog-mid"
                    className="my-6"
                  />
                )}
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={blockIndex}>
              <div
                id={headingId}
                className="group pt-6 pb-2 scroll-mt-24 flex items-center justify-between"
              >
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  {cleanText}
                </h3>
                <button
                  onClick={() => copyAnchor(headingId)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                  title="Copy section link"
                  aria-label={`Copy link for ${cleanText}`}
                >
                  {copiedId === headingId ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <Hash className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {isMidPoint && (
                <AdWrapper
                  slot="blogArticleMid"
                  placement="blog-mid"
                  className="my-6"
                />
              )}
            </React.Fragment>
          );
        }

        // Check if block contains fenced code block ```lang ... ```
        if (trimmed.includes('```')) {
          const parts = trimmed.split(/(```[a-zA-Z0-9_-]*\n?[\s\S]*?```)/g);
          return (
            <React.Fragment key={blockIndex}>
              {parts.map((part, pIdx) => {
                const pTrim = part.trim();
                if (pTrim.startsWith('```') && pTrim.endsWith('```')) {
                  const m = pTrim.match(/^```([a-zA-Z0-9_-]*)\n?([\s\S]*?)\n?```$/);
                  const lang = m ? m[1] || 'text' : 'text';
                  const code = m ? m[2] : pTrim.slice(3, -3);
                  return <CodeBlock key={`cb-${blockIndex}-${pIdx}`} code={code} language={lang} />;
                }
                if (!pTrim) return null;
                return (
                  <p key={`p-${blockIndex}-${pIdx}`} className="leading-relaxed">
                    {renderFormattedText(pTrim)}
                  </p>
                );
              })}
              {isMidPoint && (
                <AdWrapper
                  slot="blogArticleMid"
                  placement="blog-mid"
                  className="my-6"
                />
              )}
            </React.Fragment>
          );
        }

        // Check if block is a bullet list (lines start with - or *)
        const lines = trimmed.split('\n');
        const isBulletList = lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));

        if (isBulletList) {
          return (
            <React.Fragment key={blockIndex}>
              <ul className="space-y-2.5 my-3 pl-4 list-disc marker:text-cyan-500">
                {lines.map((line, lIdx) => {
                  const cleaned = line.replace(/^[-*]\s+/, '');
                  return (
                    <li key={lIdx} className="leading-relaxed">
                      {renderFormattedText(cleaned)}
                    </li>
                  );
                })}
              </ul>
              {isMidPoint && (
                <AdWrapper
                  slot="blogArticleMid"
                  placement="blog-mid"
                  className="my-6"
                />
              )}
            </React.Fragment>
          );
        }

        // Regular Paragraph
        return (
          <React.Fragment key={blockIndex}>
            <p className="leading-relaxed">{renderFormattedText(trimmed)}</p>
            {isMidPoint && (
              <AdWrapper
                slot="blogArticleMid"
                placement="blog-mid"
                className="my-6"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
