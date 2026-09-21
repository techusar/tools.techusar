import React from 'react';
import { Metadata } from 'next';
import { PricingClient } from '@/components/pricing/PricingClient';

export const metadata: Metadata = {
  title: 'Pricing & Plans - TechTools by TechUsar',
  description: 'Simple, transparent pricing. Free forever tools with optional Pro tier for unlimited Gemini AI generations.',
};

export default function PricingPage() {
  return <PricingClient />;
}
