'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { SEO_CONFIG } from '@/lib/seo/config';

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Tooltip Label */}
      <div
        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs font-medium shadow-md backdrop-blur-xs border border-slate-700/50 transition-all duration-300 pointer-events-none ${
          isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Chat: {SEO_CONFIG.whatsappNumber}</span>
      </div>

      {/* WhatsApp Button Anchor */}
      <a
        href={`${SEO_CONFIG.whatsappUrl}?text=${encodeURIComponent('Hello TechTools Support, I have an inquiry')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp at ${SEO_CONFIG.whatsappNumber}`}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 focus:outline-hidden focus:ring-4 focus:ring-emerald-400/40"
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10" />

        {/* WhatsApp Icon from Lucide */}
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white/20 text-white" />
      </a>
    </div>
  );
}
