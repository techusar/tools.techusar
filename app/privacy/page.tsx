import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, Server, Database, Sparkles } from 'lucide-react';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: `Privacy Policy & Zero Data Retention Guarantee | ${SEO_CONFIG.shortName}`,
  description:
    'Our strict commitment to zero data storage, in-browser client execution, and transparent privacy policies. No personal payloads or secrets are stored.',
  keywords: [
    'privacy policy',
    'zero data retention',
    'GDPR compliant developer tools',
    'CCPA compliant utilities',
    'client-side privacy',
  ],
  alternates: {
    canonical: getCanonicalUrl('/privacy'),
  },
  openGraph: {
    title: `Privacy Policy & Zero Data Retention | ${SEO_CONFIG.shortName}`,
    description:
      'Our rigorous commitment to zero data storage, browser-side client processing, and transparent telemetry policies.',
    url: getCanonicalUrl('/privacy'),
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: '/api/og?title=Privacy%20Policy&cat=Trust%20%26%20Security',
        width: 1200,
        height: 630,
        alt: 'TechTools Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Privacy Policy & Zero Data Retention | ${SEO_CONFIG.shortName}`,
    description:
      'Our rigorous commitment to zero data storage and browser-side client processing.',
    creator: SEO_CONFIG.twitterHandle,
    images: ['/api/og?title=Privacy%20Policy'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function PrivacyPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SEO_CONFIG.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Privacy Policy',
        item: getCanonicalUrl('/privacy'),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy', current: true },
          ]}
        />
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy Guaranteed & GDPR/CCPA Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated & Validated: September 16, 2026 | Effective for all global users
        </p>
      </div>

      {/* Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-950 dark:text-emerald-200 space-y-1.5">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-bold">100% In-Memory</h3>
          <p className="text-[11px] sm:text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
            Data formatted or calculated in browser tools never touches our server hard drives.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-950 dark:text-cyan-200 space-y-1.5">
          <EyeOff className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold">Zero Ad Trackers</h3>
          <p className="text-[11px] sm:text-xs text-cyan-800 dark:text-cyan-300 leading-relaxed">
            No invasive cookies, biometric profiling, or selling data to ad brokers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-950 dark:text-indigo-200 space-y-1.5">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs sm:text-sm font-bold">Stateless AI Calls</h3>
          <p className="text-[11px] sm:text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
            Gemini AI prompts are transiently evaluated and never retained for model training.
          </p>
        </div>
      </div>

      {/* Deep Legal Sections */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">1</span>
            Data Processing Architecture (Client-Side First)
          </h2>
          <p>
            TechTools (&quot;we&quot;, &quot;our&quot;, or &quot;TechUsar&quot;) is architected with a strict privacy-first mandate. The vast majority of utilities—including the JSON Formatter, Image Compressor, QR Code Generator, Password Generator, Hash Calculators, JWT Debugger, and Loan EMI Amortizers—execute purely within your web browser’s sandboxed JavaScript engine.
          </p>
          <p>
            Your input values, uploaded images, private tokens, passwords, and calculated matrices never traverse our network infrastructure. When you navigate away from or refresh the page, the browser runtime memory is wiped immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">2</span>
            Artificial Intelligence & Gemini API Processing
          </h2>
          <p>
            For tools marked with &quot;AI-Powered&quot; (such as the AI Text Summarizer, Content Rewriter, and SQL Query Generator), input prompts are transmitted via TLS 1.3 encryption to our serverless API proxy, which communicates directly with Google&apos;s Gemini API endpoints.
          </p>
          <p>
            We enforce stateless, zero-retention policies. Your prompts and generated responses are never written to disk, never indexed in search databases, and never used to train or fine-tune public artificial intelligence models.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">3</span>
            Local Storage & Client-Side Cookies
          </h2>
          <p>
            We do not deploy third-party advertising tracking cookies or cross-site fingerprinting beacons. We utilize your browser’s native <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs">localStorage</code> solely for functional convenience:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Bookmarked favorite utilities for quick access in your personal dashboard.</li>
            <li>Recent tool usage history to allow 1-click return to tools you frequently rely on.</li>
            <li>Anonymous AI daily usage quota counters (resetting every 24 hours).</li>
            <li>Authentication token for registered Pro tier subscribers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">4</span>
            GDPR & CCPA Rights
          </h2>
          <p>
            Under the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you have the right to access, rectify, or erase any personal information. Because we store no user records or tool logs on anonymous sessions, your data is inherently under your direct control via your browser’s cache controls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">5</span>
            Contact Data Protection Officer
          </h2>
          <p>
            For any inquiries or audit verifications regarding our technical privacy safeguards, please email our Data Protection Office at{' '}
            <a href="mailto:techusar17@gmail.com" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
              techusar17@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
    </>
  );
}
