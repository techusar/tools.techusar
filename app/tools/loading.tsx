import React from 'react';
import { BrandedLoading } from '@/components/ui/BrandedLoading';

export default function ToolsCatalogLoading() {
  return (
    <div className="w-full flex-1 flex items-center justify-center py-12">
      <BrandedLoading
        fullPage
        title="Loading Tools Directory"
        description="Fetching developer utilities and category catalogs..."
      />
    </div>
  );
}
