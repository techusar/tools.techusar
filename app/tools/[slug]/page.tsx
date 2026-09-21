import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getAllTools,
  getToolBySlug,
  getCategoryBySlug,
  getRelatedTools,
} from '@/lib/data/toolsRepository';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolViewResolver } from '@/components/tools/ToolViewResolver';
import { getEnrichedToolSEO, generateToolJsonLd } from '@/lib/seo/toolSeoHelper';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found - TechTools',
      description: 'The requested developer tool could not be found.',
    };
  }

  const category = await getCategoryBySlug(tool.category);
  const seo = getEnrichedToolSEO(tool, category);
  const title = tool.metaTitle || tool.seoTitle || `${tool.name} - Free Online Tool by TechUsar`;
  const description =
    tool.metaDescription ||
    tool.seoDescription ||
    `${tool.name}: ${tool.description} Fast, secure, and 100% private in-browser utility with zero data retention.`;

  const canonicalUrl = `https://techtools.techusar.com/tools/${tool.slug}`;

  return {
    title,
    description,
    keywords: [
      ...tool.tags,
      tool.name.toLowerCase(),
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      tool.categoryName.toLowerCase(),
      'developer tools',
      'online utilities',
      'browser tool',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tool.name} - Free Online Tool | TechTools`,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'TechTools by TechUsar',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(tool.name)}&cat=${encodeURIComponent(tool.categoryName)}`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - Free Online Tool`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - Free Online Tool`,
      description,
      creator: '@TechUsar',
      images: [`/api/og?title=${encodeURIComponent(tool.name)}`],
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

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const [category, relatedTools] = await Promise.all([
    getCategoryBySlug(tool.category),
    getRelatedTools(tool.id, tool.category, 4),
  ]);

  const enrichedSEO = getEnrichedToolSEO(tool, category);
  const jsonLdSchemas = generateToolJsonLd(tool, category, enrichedSEO);

  return (
    <>
      {/* Schema.org JSON-LD Structured Data for Google Rich Snippets (WebApplication, FAQPage, HowTo, BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
      />

      <ToolShell tool={tool} category={category} relatedTools={relatedTools}>
        <ToolViewResolver tool={tool} />
      </ToolShell>
    </>
  );
}
