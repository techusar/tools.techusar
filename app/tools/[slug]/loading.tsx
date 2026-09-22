import React from 'react';
import { BrandedLoading } from '@/components/ui/BrandedLoading';

export default function ToolPageLoading() {
  return (
    <div className="w-full flex-1 flex items-center justify-center py-12">
      <BrandedLoading
        fullPage
        title="Loading Tool"
        description="Initializing client-side utility and sandboxed engine..."
      />
    </div>
  );
}
