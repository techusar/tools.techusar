import React from 'react';
import { BrandedLoading } from '@/components/ui/BrandedLoading';

export default function BlogListLoading() {
  return (
    <div className="w-full flex-1 flex items-center justify-center py-12">
      <BrandedLoading
        fullPage
        title="Loading TechTools Blog"
        description="Fetching engineering guides, tool documentation, and developer articles..."
      />
    </div>
  );
}
