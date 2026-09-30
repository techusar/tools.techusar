import React from 'react';
import { Metadata } from 'next';
import { getAllTools } from '@/lib/data/toolsRepository';
import { HistoryClient } from '@/components/account/HistoryClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Tool Usage History & Recent Activity | TechTools',
  },
  description: 'View and resume your recently used developer tools, formatters, and AI utilities.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HistoryPage() {
  const allTools = await getAllTools();
  return <HistoryClient allTools={allTools} />;
}
