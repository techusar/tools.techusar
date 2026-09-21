import React from 'react';
import { Metadata } from 'next';
import { getAllTools, getCategories } from '@/lib/data/toolsRepository';
import { AllToolsDirectoryClient } from '@/components/tools/AllToolsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Online Tools & Utilities Directory - TechTools by TechUsar',
  description:
    'Browse our comprehensive catalog of 60+ online developer tools, Gemini AI assistants, formatters, image compressors, security utilities, and financial calculators.',
};

export default async function ToolsDirectoryPage() {
  const [tools, categories] = await Promise.all([
    getAllTools(),
    getCategories(),
  ]);

  return <AllToolsDirectoryClient initialTools={tools} categories={categories} />;
}
