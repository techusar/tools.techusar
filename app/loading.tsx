import React from 'react';
import { BrandedLoading } from '@/components/ui/BrandedLoading';

export default function GlobalLoading() {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <BrandedLoading
        fullPage
        title="Loading Workspace"
        description="Fetching initial tool and blog data..."
      />
    </div>
  );
}

