import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllTools } from '@/lib/data/toolsRepository';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: `About Us & Zero-Retention Philosophy | ${SEO_CONFIG.shortName}`,
  description:
    'Learn about TechTools by TechUsar: our mission to provide high-speed, 100% private in-browser developer utilities and Gemini AI assistants without storing user data.',
  keywords: [
    'about TechTools',
    'TechUsar',
    'client-side developer tools',
    'zero data retention tools',
    'in-browser utilities',
    'private web tools',
  ],
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  openGraph: {
    title: `About TechTools & Our Zero-Retention Architecture | ${SEO_CONFIG.shortName}`,
    description:
      'High-speed, 100% private developer tools and AI utilities engineered to run in-browser with zero server logging.',
    url: getCanonicalUrl('/about'),
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: '/api/og?title=About%20TechTools&cat=Mission%20%26%20Architecture',
        width: 1200,
        height: 630,
        alt: 'About TechTools by TechUsar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `About TechTools & Our Zero-Retention Architecture | ${SEO_CONFIG.shortName}`,
    description:
      'High-speed, 100% private developer tools and AI utilities engineered to run in-browser with zero server logging.',
    creator: SEO_CONFIG.twitterHandle,
    images: ['/api/og?title=About%20TechTools'],
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

export default async function AboutPage() {
  const tools = await getAllTools();
  const toolCount = tools.length;

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About TechTools by TechUsar',
    description:
      'TechTools is a suite of 60+ free in-browser developer, security, text, and financial utilities engineered with zero data retention.',
    url: getCanonicalUrl('/about'),
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      logo: `${SEO_CONFIG.siteUrl}/icon.png`,
    },
  };

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
        name: 'About Us',
        item: getCanonicalUrl('/about'),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'About Us', current: true },
          ]}
        />

        {/* Hero Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About TechTools & TechUsar</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Modern Web Utilities Built for Speed, Privacy & Precision
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            TechTools was founded by TechUsar Technologies to replace sluggish, ad-bloated, and insecure online utility sites with lightning-fast, client-side web tools that respect your proprietary data.
          </p>
        </div>

        {/* Core Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Data Retention</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your JSON payloads, API secrets, passwords, and images are processed in-memory directly in your web browser. No server logging, no tracking cookies, and zero risk of database leaks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sub-Millisecond Speed</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Eliminating back-and-forth server roundtrips allows instant formatting, conversion, and compression directly on client hardware with zero network bottleneck.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Gemini 2.5 AI Power</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Seamlessly integrated with Google&apos;s latest Gemini 2.5 Flash models for context-aware code explanations, SQL generation, and high-impact marketing copy.
            </p>
          </div>
        </div>

        {/* Deep Story & Architectural Principles */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Our Architectural Blueprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How We Guarantee Complete Privacy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                WASM & Web Cryptography APIs
              </h4>
              <p>
                When calculating SHA-256 hashes, generating HMAC keys, or decoding JWT tokens, we execute native browser cryptosystems without passing your auth tokens over external HTTP transports.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Client-Side Canvas Processing
              </h4>
              <p>
                Image resizing, format conversion (PNG to WebP/JPEG), and raster compression are performed via HTML5 2D Canvas contexts on your local GPU, ensuring sensitive screenshots never touch a remote server.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Privacy-Conscious Architecture
              </h4>
              <p>
                We prioritize transparent, non-intrusive design without disruptive modal paywalls or deceptive countdown counters that obstruct your workflow.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Stateless AI Proxying
              </h4>
              <p>
                For Gemini AI queries, prompts are proxied securely using serverless edge handlers. Your queries are never saved to internal databases or utilized to train general intelligence models.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Interactive Utilities', value: `${toolCount}+` },
            { label: 'In-Browser Privacy', value: '100%' },
            { label: 'Client Execution', value: 'Instant' },
            { label: 'AI Intelligence', value: 'Gemini' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 text-center space-y-1"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#111318] to-slate-950 text-white text-center space-y-5 border border-slate-800 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to experience faster, safer online tools?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join thousands of software engineers, founders, analysts, and content creators who rely on TechTools daily.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/tools"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>Browse All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
            >
              Contact the Team
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
