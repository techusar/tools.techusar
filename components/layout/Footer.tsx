import React from 'react';
import Link from 'next/link';
import { Wrench, Shield, Sparkles, ExternalLink, Heart, MessageSquare, Mail } from 'lucide-react';
import { SEO_CONFIG } from '@/lib/seo/config';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0A0C10] border-t border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Wrench className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">TECHTOOLS</span>
                <span className="text-[9px] font-semibold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase -mt-0.5">
                  by TechUsar
                </span>
              </div>
            </Link>

            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              TechTools is a comprehensive suite of high-speed, privacy-first online utilities and AI tools built for developers, designers, creators, businesses, and students worldwide.
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>100% Client-Side Processing for Local Utilities</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Powered by Gemini AI for Advanced Intelligence</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://www.techusar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#14171F] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs w-fit"
              >
                <span>A Product of TechUsar Technologies</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                <a
                  href={`mailto:${SEO_CONFIG.contactEmail}`}
                  className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{SEO_CONFIG.contactEmail}</span>
                </a>
                <a
                  href={`${SEO_CONFIG.whatsappUrl}?text=${encodeURIComponent('Hello TechTools Support')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp: {SEO_CONFIG.whatsappNumber}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tools/json-formatter" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/password-generator" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Password Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/invoice-generator" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/loan-emi-calculator" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Loan EMI Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* AI & Developer Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              AI & Dev Utilities
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tools/ai-text-summarizer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  AI Text Summarizer
                </Link>
              </li>
              <li>
                <Link href="/tools/ai-rewriter" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  AI Content Rewriter
                </Link>
              </li>
              <li>
                <Link href="/tools/jwt-decoder" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  JWT Debugger
                </Link>
              </li>
              <li>
                <Link href="/tools/base64-encoder-decoder" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Base64 Encoder
                </Link>
              </li>
              <li>
                <Link href="/tools/regex-tester" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Regex Tester
                </Link>
              </li>
              <li>
                <Link href="/tools/hash-generator" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Hash Generator (SHA-256)
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tools" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  All Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Categories Hub
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  AI Utilities
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Guides & Tech Blog
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  About TechTools
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} TechTools by TechUsar. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">
              Terms
            </Link>
            <a
              href="https://www.techusar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              techusar.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
