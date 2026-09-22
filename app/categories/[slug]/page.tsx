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

  return {
    title: `${category.name} - Free Online Utilities by TechUsar`,
    description: category.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} Utilities | ${SEO_CONFIG.shortName}`,
      description: category.description,
      url: canonicalUrl,
      type: 'website',
      siteName: SEO_CONFIG.siteName,
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
      <CategoryToolsClient category={category} tools={tools} />
    </>
  );
}
