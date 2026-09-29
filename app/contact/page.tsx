import React from 'react';
import { Metadata } from 'next';
import { MessageSquare, HelpCircle } from 'lucide-react';
import { ContactClient } from '@/components/contact/ContactClient';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: `Contact TechTools Support & Developer Team | ${SEO_CONFIG.shortName}`,
  description:
    'Have a feature request, bug report, or API inquiry? Contact the TechTools engineering team. Dedicated developer support with a 24-hour response guarantee.',
  keywords: [
    'contact TechTools',
    'developer tool support',
    'tool feature request',
    'bug report',
    'API integration contact',
    'WhatsApp developer support',
  ],
  alternates: {
    canonical: getCanonicalUrl('/contact'),
  },
  openGraph: {
    title: `Contact Support & Tool Requests | ${SEO_CONFIG.shortName}`,
    description:
      'Have a feature request, bug report, or API integration inquiry? Contact the TechTools team with guaranteed 24-hour response SLA.',
    url: getCanonicalUrl('/contact'),
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: '/api/og?title=Contact%20TechTools&cat=Support%20%26%20Feedback',
        width: 1200,
        height: 630,
        alt: 'Contact TechTools Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact Support & Tool Requests | ${SEO_CONFIG.shortName}`,
    description:
      'Have a feature request, bug report, or API inquiry? Contact our team directly with a 24-hour response SLA.',
    creator: SEO_CONFIG.twitterHandle,
    images: ['/api/og?title=Contact%20TechTools'],
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

export default function ContactPage() {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact TechTools Support',
    description: 'Get in touch with the TechTools engineering team for inquiries, bug reports, and tool requests.',
    url: getCanonicalUrl('/contact'),
    mainEntity: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+1-555-123-4567',
          contactType: 'customer support',
          email: SEO_CONFIG.contactEmail,
          availableLanguage: ['English'],
        },
      ],
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
        name: 'Contact',
        item: getCanonicalUrl('/contact'),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
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
            { label: 'Contact Support', current: true },
          ]}
        />

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support & Community Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get in Touch with TechTools
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Have an idea for a new developer utility, noticed an edge-case bug, or need enterprise API integration? Our engineering team reviews every submission.
          </p>
        </div>

        {/* Client Form & Live Tracking Component */}
        <ContactClient />

        {/* Support FAQ Section */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Frequently Asked Support Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Are all online utilities truly free to use?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes. All browser-based utilities (JSON formatting, QR code creation, image compression, regex testing, loan calculations) are 100% free with unlimited local runs.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                How does the Gemini AI quota work?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Anonymous users receive 3 free AI queries per day, signed-in users receive 10 daily queries, and Pro subscribers get unlimited generations.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Can I suggest a new calculator or converter?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Absolutely! Use the form above with &quot;Feature / New Online Tool Request&quot; and our engineering roadmap team will review your specifications.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Is my company data protected against AI model training?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes. We use Google Gemini API enterprise endpoints where submitted payload text is strictly transient and never retained or used for foundation model training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
