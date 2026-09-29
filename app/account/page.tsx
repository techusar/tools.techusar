import React from 'react';
import { Metadata } from 'next';
import { getAllTools } from '@/lib/data/toolsRepository';
import { AccountClient } from '@/components/account/AccountClient';

export const metadata: Metadata = {
  title: 'My Account & Preferences - TechTools by TechUsar',
  description: 'Manage your TechTools profile, view AI generation limits, and customize preferences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const allTools = await getAllTools();
  return <AccountClient allTools={allTools} />;
}
