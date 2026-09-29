import React from 'react';
import { Metadata } from 'next';
import { getAllTools } from '@/lib/data/toolsRepository';
import { FavoritesClient } from '@/components/favorites/FavoritesClient';

export const metadata: Metadata = {
  title: 'My Favorite Tools - TechTools by TechUsar',
  description: 'Quickly access your bookmarked online developer and AI tools.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function FavoritesPage() {
  const tools = await getAllTools();
  return <FavoritesClient allTools={tools} />;
}
