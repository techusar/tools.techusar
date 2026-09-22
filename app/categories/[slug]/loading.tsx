import React from 'react';
import { BrandedLoading } from '@/components/ui/BrandedLoading';

export default function CategoryLoading() {
  return (
    <div className="w-full flex-1 flex items-center justify-center py-12">
      <BrandedLoading
        fullPage
        title="Loading Category"
        description="Fetching developer utilities and categorized workflows..."
      />
    </div>
  );
}
