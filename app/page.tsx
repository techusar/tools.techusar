import React from 'react';
import { getAllTools, getCategories, getFeaturedTools } from '@/lib/data/toolsRepository';
import { HomeClient } from '@/components/home/HomeClient';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const [tools, categories, featured] = await Promise.all([
    getAllTools(),
    getCategories(),
    getFeaturedTools(),
  ]);

  return (
    <HomeClient
      initialTools={tools}
      categories={categories}
      featuredTools={featured}
    />
  );
}
