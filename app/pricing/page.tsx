import React from 'react';
import { Metadata } from 'next';
import { PricingClient } from '@/components/pricing/PricingClient';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: {
    absolute: `Transparent Pricing & Pro Developer Plans | ${SEO_CONFIG.shortName}`,
  },
  description:
    'Simple, transparent developer pricing. 100% free forever for all browser utilities with an optional Pro tier for unlimited Gemini AI generations and priority execution.',
  keywords: [
    'TechTools pricing',
    'free developer tools',
    'pro developer plan',
    'Gemini AI subscription',
    'unlimited AI generator plan',
  ],
  alternates: {
    canonical: getCanonicalUrl('/pricing'),
  },
  openGraph: {
    title: `Pricing & Plans | ${SEO_CONFIG.shortName}`,
    description:
      'Free forever for all standard utilities. Optional Pro tier for unlimited Gemini AI generations.',
    url: getCanonicalUrl('/pricing'),
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: '/api/og?title=Pricing%20Plans&cat=TechTools%20Pro',
        width: 1200,
        height: 630,
        alt: 'TechTools Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Pricing & Plans | ${SEO_CONFIG.shortName}`,
    description:
      'Free forever for all standard utilities. Optional Pro tier for unlimited Gemini AI generations.',
    creator: SEO_CONFIG.twitterHandle,
    images: ['/api/og?title=Pricing%20Plans'],
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

export default function PricingPage() {
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
        name: 'Pricing',
        item: getCanonicalUrl('/pricing'),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PricingClient />
    </>
  );
}
