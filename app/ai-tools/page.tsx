import React from 'react';
import { Metadata } from 'next';
import { getAllTools } from '@/lib/data/toolsRepository';
import { AIToolsPageClient } from '@/components/tools/AIToolsPageClient';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: `AI-Powered Developer & Content Tools | ${SEO_CONFIG.shortName}`,
  description:
    'Instant SQL generation, text summarization, content rewriting, regex creation, and code debugging powered by Google Gemini 2.5 Flash with strict data privacy.',
  keywords: [
    'AI developer tools',
    'Gemini AI tools',
    'AI SQL generator',
    'AI text summarizer',
    'AI content rewriter',
    'free AI tools online',
    'code explainer AI',
  ],
  alternates: {
    canonical: getCanonicalUrl('/ai-tools'),
  },
  openGraph: {
    title: `AI Developer & Content Utilities | ${SEO_CONFIG.shortName}`,
    description:
      'Instant SQL generation, text summarization, content rewriting, and code debugging powered by Google Gemini AI.',
    url: getCanonicalUrl('/ai-tools'),
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: '/api/og?title=AI%20Developer%20Tools&cat=Gemini%20Intelligence',
        width: 1200,
        height: 630,
        alt: 'AI Tools - TechTools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `AI Developer & Content Utilities | ${SEO_CONFIG.shortName}`,
    description:
      'Instant SQL generation, text summarization, content rewriting, and code debugging powered by Google Gemini AI.',
    creator: SEO_CONFIG.twitterHandle,
    images: ['/api/og?title=AI%20Developer%20Tools'],
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

export default async function AIToolsPage() {
  const allTools = await getAllTools();
  const aiTools = allTools.filter((t) => t.type === 'ai' || t.category === 'ai-tools');

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
        name: 'AI Utilities',
        item: getCanonicalUrl('/ai-tools'),
      },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Gemini AI Developer Utilities Collection',
    description:
      'Intelligent utilities powered by Google Gemini AI models for text, code, and SQL transformation.',
    url: getCanonicalUrl('/ai-tools'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: aiTools.map((t, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: t.name,
        url: getCanonicalUrl(`/tools/${t.slug}`),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <AIToolsPageClient aiTools={aiTools} />
    </>
  );
}
