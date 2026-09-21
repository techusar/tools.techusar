'use client';

import React, { useState } from 'react';
import { FileJson, Copy, Check, Plus, Trash2 } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';

export function SchemaGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [schemaType, setSchemaType] = useState<'FAQPage' | 'Article' | 'Organization' | 'Product'>('FAQPage');
  const [faqs, setFaqs] = useState([
    { question: 'Is TechTools free to use?', answer: 'Yes, all standard online tools are 100% free with no account required.' },
    { question: 'Is my data secure?', answer: 'Yes, tools execute locally in your browser. We never save your uploaded files.' },
  ]);
  const [articleTitle, setArticleTitle] = useState('How to Optimize Images for the Web');
  const [articleAuthor, setArticleAuthor] = useState('TechUsar Team');
  const [articleDate, setArticleDate] = useState('2026-09-16');
  const [copied, setCopied] = useState(false);

  let schemaObj: any = {};
  if (schemaType === 'FAQPage') {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
  } else if (schemaType === 'Article') {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleTitle,
      author: {
        '@type': 'Person',
        name: articleAuthor,
      },
      datePublished: articleDate,
    };
  } else if (schemaType === 'Organization') {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TechUsar',
      url: 'https://www.techusar.com',
      logo: 'https://tools.techusar.com/logo.png',
      sameAs: ['https://twitter.com/techusar', 'https://github.com/techusar'],
    };
  }

  const jsonLdString = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(jsonLdString);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Schema Type selector */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-800">
        {[
          { id: 'FAQPage', label: 'FAQ Page Schema' },
          { id: 'Article', label: 'Article / Blog Schema' },
          { id: 'Organization', label: 'Organization Schema' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSchemaType(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              schemaType === tab.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-[#171A21] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4">
          {schemaType === 'FAQPage' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-300 font-semibold">
                <span>Frequently Asked Questions</span>
                <button
                  onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#0D0F13] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-mono text-slate-500">Question #{idx + 1}</span>
                    {faqs.length > 1 && (
                      <button
                        onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter question..."
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...faqs];
                      next[idx].question = e.target.value;
                      setFaqs(next);
                    }}
                    className="w-full px-3 py-1.5 bg-[#171A21] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <textarea
                    placeholder="Enter answer..."
                    value={faq.answer}
                    onChange={(e) => {
                      const next = [...faqs];
                      next[idx].answer = e.target.value;
                      setFaqs(next);
                    }}
                    rows={2}
                    className="w-full p-2.5 bg-[#171A21] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          )}

          {schemaType === 'Article' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Headline</label>
                <input
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={articleAuthor}
                  onChange={(e) => setArticleAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Publication Date</label>
                <input
                  type="date"
                  value={articleDate}
                  onChange={(e) => setArticleDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {schemaType === 'Organization' && (
            <div className="p-4 rounded-xl bg-[#0D0F13] border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">Default Organization Profile</p>
              <p className="text-slate-400">
                Generates a verified schema for TechUsar with website, branding, and social channel links for Google Knowledge Graph.
              </p>
            </div>
          )}
        </div>

        {/* Right JSON-LD Output */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Schema.org JSON-LD Script</span>
            <button
              onClick={handleCopy}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON-LD'}</span>
            </button>
          </div>
          <pre className="flex-1 p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 font-mono text-xs overflow-y-auto leading-relaxed">
            {jsonLdString}
          </pre>
        </div>
      </div>
    </div>
  );
}
