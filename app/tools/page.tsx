import React from 'react';
import { Metadata } from 'next';
import { getAllTools, getCategories } from '@/lib/data/toolsRepository';
import { AllToolsDirectoryClient } from '@/components/tools/AllToolsDirectoryClient';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: {
    absolute: `All Online Tools & Utilities Directory | ${SEO_CONFIG.shortName}`,
  },
  description:
    'Browse our comprehensive catalog of 70+ free online developer tools, Gemini AI assistants, code formatters, image compressors, security utilities, and financial calculators.',
  keywords: [
    'online tools directory',
    'free developer utilities',
    'all web tools',
    'free online converters',
    'code beautifiers',
    'image tools',
    'TechTools directory',
  ],
  alternates: {
    canonical: getCanonicalUrl('/tools'),
  },
  openGraph: {
    title: `All Online Tools Directory | ${SEO_CONFIG.shortName}`,
    description:
      'Browse our catalog of 60+ free online developer tools, formatters, compressors, and AI utilities.',
    url: getCanonicalUrl('/tools'),
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: '/api/og?title=Tools%20Catalog&cat=Full%20Directory',
        width: 1200,
        height: 630,
        alt: 'All Online Tools - TechTools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `All Online Tools Directory | ${SEO_CONFIG.shortName}`,
    description:
      'Browse our catalog of 60+ free online developer tools, formatters, compressors, and AI utilities.',
    creator: SEO_CONFIG.twitterHandle,
    images: ['/api/og?title=Tools%20Catalog'],
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

export default async function ToolsDirectoryPage() {
  const [tools, categories] = await Promise.all([
    getAllTools(),
    getCategories(),
  ]);

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
        name: 'Tools Directory',
        item: getCanonicalUrl('/tools'),
      },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'TechTools Online Utilities Directory',
    description:
      'Complete catalog of free browser-based developer, creator, and productivity utilities.',
    url: getCanonicalUrl('/tools'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((t, idx) => ({
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
      <AllToolsDirectoryClient initialTools={tools} categories={categories} />
    </>
  );
}
