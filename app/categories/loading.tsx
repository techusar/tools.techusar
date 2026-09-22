import React from 'react';
import { BrandedLoading } from '@/components/ui/BrandedLoading';

export default function CategoriesCatalogLoading() {
  return (
    <div className="w-full flex-1 flex items-center justify-center py-12">
      <BrandedLoading
        fullPage
        title="Loading Categories"
        description="Fetching tool collections and engineering workflows..."
      />
    </div>
  );
}
