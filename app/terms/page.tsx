import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { FileText, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: {
    absolute: `Terms of Service & Usage Guidelines | ${SEO_CONFIG.shortName}`,
  },
  description:
    'Terms, conditions, and fair use guidelines for utilizing TechTools web utilities, client-side tools, and Gemini AI assistant services.',
  keywords: [
    'terms of service',
    'user agreement',
    'fair use guidelines',
    'TechTools terms',
    'acceptable use policy',
  ],
  alternates: {
    canonical: getCanonicalUrl('/terms'),
  },
  openGraph: {
    title: `Terms of Service & User Agreement | ${SEO_CONFIG.shortName}`,
    description:
      'Terms, conditions, and fair use guidelines for utilizing TechTools web utilities and AI tools.',
    url: getCanonicalUrl('/terms'),
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: '/api/og?title=Terms%20of%20Service&cat=Legal%20%26%20Policies',
        width: 1200,
        height: 630,
        alt: 'TechTools Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Terms of Service & User Agreement | ${SEO_CONFIG.shortName}`,
    description:
      'Terms, conditions, and fair use guidelines for utilizing TechTools web utilities and AI tools.',
    creator: SEO_CONFIG.twitterHandle,
    images: ['/api/og?title=Terms%20of%20Service'],
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

export default function TermsPage() {
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
        name: 'Terms of Service',
        item: getCanonicalUrl('/terms'),
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
            { label: 'Terms of Service', current: true },
          ]}
        />

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>User Agreement & Policies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Effective Date: September 16, 2026 | TechUsar Technologies Ltd.
          </p>
        </div>

        {/* Main Legal Agreement Box */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">1</span>
              Acceptance and Agreement
            </h2>
            <p>
              By accessing or using the services, utilities, and application interfaces provided at TechTools (&quot;the Service&quot;) by TechUsar Technologies Ltd., you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service. If you do not agree to all terms outlined herein, you must immediately discontinue use of the Service.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">2</span>
              Acceptable Use and User Responsibilities
            </h2>
            <p>
              You agree to utilize all utilities exclusively for lawful personal and commercial operations. You are strictly prohibited from:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Using AI endpoints or regex parsers to generate or propagate malware, spyware, ransomware, or phishing campaigns.</li>
              <li>Attempting to reverse-engineer, bypass rate limits, or launch denial-of-service (DoS) attacks against our edge infrastructure.</li>
              <li>Scraping tool interfaces using automated headless scripts in violation of robots.txt directives.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">3</span>
              Intellectual Property Rights
            </h2>
            <p>
              All software interfaces, logos, brand styling, code libraries, and analytical algorithms comprising TechTools are the proprietary property of TechUsar Technologies Ltd. All content, images, data sets, and tokens generated, compressed, or formatted by you through our utilities remain your 100% exclusive intellectual property.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">4</span>
              Warranty Disclaimer & Limitation of Liability
            </h2>
            <p>
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. TechUsar Technologies Ltd. does not guarantee that mathematical calculations, tax estimates, or AI outputs will be completely free of human input discrepancies. Under no circumstances shall TechUsar be liable for any indirect, incidental, or consequential damages resulting from tool usage.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">5</span>
              Governing Law and Modifications
            </h2>
            <p>
              These Terms shall be governed and interpreted in accordance with applicable corporate legal frameworks. We reserve the right to revise these Terms periodically. Notice of significant material changes will be displayed prominently within the platform interface.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
