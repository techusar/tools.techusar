import React from 'react';
import { Metadata } from 'next';
import { getAllTools } from '@/lib/data/toolsRepository';
import { HistoryClient } from '@/components/account/HistoryClient';

export const metadata: Metadata = {
  title: 'Tool Usage History & Recent Activity - TechTools by TechUsar',
  description: 'View and resume your recently used developer tools, formatters, and AI utilities.',
};

export default async function HistoryPage() {
  const allTools = await getAllTools();
  return <HistoryClient allTools={allTools} />;
}
