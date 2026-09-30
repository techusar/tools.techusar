import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategories, getCategoryBySlug, getToolsByCategory } from '@/lib/data/toolsRepository';
import { CategoryToolsClient } from '@/components/categories/CategoryToolsClient';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found - TechTools',
      description: 'The requested tool category could not be found.',
    };
  }

  const canonicalUrl = getCanonicalUrl(`/categories/${category.slug}`);
  const title = `${category.name} – Free Online Utilities | ${SEO_CONFIG.shortName}`;
  const description = `${category.description.replace(/\.$/, '')}. Free, fast, in-browser developer utilities with zero data retention.`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(category.name)}&cat=Tool%20Category`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      category.name.toLowerCase(),
      `${category.name.toLowerCase()} online`,
      `free ${category.name.toLowerCase()}`,
      'developer utilities',
      'browser tools',
      'free online tools',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${category.name} - Free Online Utilities`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: SEO_CONFIG.twitterHandle,
      images: [ogImageUrl],
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
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const tools = await getToolsByCategory(category.slug);

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
        name: 'Categories',
        item: getCanonicalUrl('/categories'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: getCanonicalUrl(`/categories/${category.slug}`),
      },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Tools Collection`,
    description: category.description,
    url: getCanonicalUrl(`/categories/${category.slug}`),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: tool.name,
        url: getCanonicalUrl(`/tools/${tool.slug}`),
      })),
    },
  };

  const categoryFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Are all utilities in ${category.name} completely free?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, every utility in the ${category.name} collection is 100% free to use. There are no paywalls, mandatory credit card prompts, or hidden fees for standard browser usage.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is my data private and secure when using ${category.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. TechTools is engineered with a strict zero-data-retention privacy architecture. All conversions, formatting, calculations, and data processing execute locally in your web browser sandbox using JavaScript and Web APIs. Your input payloads never leave your computer.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use these tools offline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Most non-AI utilities in this category function completely offline once the page has loaded in your browser. You can bookmark your favorites for instant access even without an active internet connection.`,
        },
      },
      {
        '@type': 'Question',
        name: `How frequently are tools in ${category.name} updated?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our engineering team continually maintains, benchmarks, and updates all algorithms against the latest web specifications, RFC standards, and modern browser engine performance updates.`,
        },
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryFaqJsonLd) }}
      />
      <CategoryToolsClient category={category} tools={tools} />
    </>
  );
}
