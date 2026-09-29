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
    title,
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
        name: `Are all ${category.name} free to use on TechTools?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, all utilities in the ${category.name} collection are 100% free with unlimited local browser executions. No credit card or account registration is required for standard usage.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does my data remain private when using ${category.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Absolutely. All computations, conversions, calculations, and formatters execute client-side directly within your browser sandbox. Your data never touches our servers.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I use these ${category.name.toLowerCase()} on mobile devices?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. Every tool in ${category.name} is fully responsive and optimized for smartphones, tablets, laptops, and desktop workstations.`,
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
