import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategories, getCategoryBySlug, getToolsByCategory } from '@/lib/data/toolsRepository';
import { CategoryToolsClient } from '@/components/categories/CategoryToolsClient';

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

  return {
    title: `${category.name} - Free Online Utilities by TechUsar`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const tools = await getToolsByCategory(category.slug);

  return <CategoryToolsClient category={category} tools={tools} />;
}
