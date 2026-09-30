import React from 'react';
import { Metadata } from 'next';
import { getAllTools, getCategories, getFeaturedTools } from '@/lib/data/toolsRepository';
import { HomeClient } from '@/components/home/HomeClient';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: {
    absolute: SEO_CONFIG.defaultTitle,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: [...SEO_CONFIG.defaultKeywords],
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    url: getCanonicalUrl('/'),
    siteName: SEO_CONFIG.siteName,
    type: 'website',
    images: [
      {
        url: SEO_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SEO_CONFIG.siteName} Suite`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    creator: SEO_CONFIG.twitterHandle,
    images: [SEO_CONFIG.ogImage],
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

export default async function HomePage() {
  const [tools, categories, featured] = await Promise.all([
    getAllTools(),
    getCategories(),
    getFeaturedTools(),
  ]);

  const homeFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is TechTools completely free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all standard tools (JSON formatting, password generation, image compression, calculators, invoice generation, etc.) are 100% free with unlimited usage. AI-powered tools include free daily credits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does TechTools upload or store my files or data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Almost all tools operate entirely on the client side using WebAssembly and Web APIs. Your images, JSON data, passwords, and cryptographic keys never leave your machine.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I bookmark my favorite tools for quick access?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Click the star icon on any tool card to add it to your Favorites tab. Your favorites are synced securely to your local browser storage.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does TechTools differ from other online tool websites?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TechTools is built by TechUsar with a modern, distraction-free interface, zero advertising popups, keyboard shortcuts, and instant execution without rate-limiting paywalls.',
        },
      },
    ],
  };

  const softwareApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.parentCompany,
      url: SEO_CONFIG.parentCompanyUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      <HomeClient
        initialTools={tools}
        categories={categories}
        featuredTools={featured}
      />
    </>
  );
}
