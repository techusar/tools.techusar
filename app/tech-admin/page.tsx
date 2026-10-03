import React from 'react';
import { Metadata } from 'next';
import { getAllTools } from '@/lib/data/toolsRepository';
import { AdminClient } from '@/components/admin/AdminClient';

export const metadata: Metadata = {
  title: {
    absolute: 'TechAdmin Management Portal | TechTools',
  },
  description: 'Manage tool catalog, view real-time execution analytics, and download database backups.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function TechAdminPage() {
  const tools = await getAllTools();
  return <AdminClient initialTools={tools} />;
}
