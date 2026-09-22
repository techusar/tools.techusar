'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
  includeJsonLd?: boolean;
  baseUrl?: string;
}

/**
 * Reusable, accessible Breadcrumb component for utility and category pages.
 * Supports WAI-ARIA breadcrumb standards and optional Schema.org BreadcrumbList JSON-LD.
 */
export function Breadcrumb({
  items,
  className = '',
  showHomeIcon = true,
  includeJsonLd = false,
  baseUrl = 'https://techusar-tools.web.app',
}: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  // Prepare Schema.org BreadcrumbList structured data if requested
  const jsonLd = includeJsonLd
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          ...(item.href
            ? {
                item: item.href.startsWith('http')
                  ? item.href
                  : `${baseUrl.replace(/\/$/, '')}${item.href.startsWith('/') ? item.href : `/${item.href}`}`,
              }
            : {}),
        })),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400 ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 m-0 p-0 list-none">
          {items.map((item, index) => {
            const isLast = index === items.length - 1 || item.current;
            const isFirst = index === 0;

            return (
              <li
                key={`${item.label}-${index}`}
                className="inline-flex items-center gap-1.5 sm:gap-2"
              >
                {index > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[180px] sm:max-w-xs md:max-w-sm inline-flex items-center gap-1.5"
                    title={item.label}
                  >
                    {isFirst && showHomeIcon && (
                      <Home className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />
                    )}
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1 inline-flex items-center gap-1.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
                  >
                    {isFirst && showHomeIcon && (
                      <Home className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 group-hover:text-cyan-600" aria-hidden="true" />
                    )}
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400 inline-flex items-center gap-1.5">
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Helper to build JSON-LD BreadcrumbList object for server components.
 */
export function buildBreadcrumbJsonLd(
  items: { label: string; url?: string }[],
  baseUrl = 'https://techusar-tools.web.app'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.url
        ? {
            item: item.url.startsWith('http')
              ? item.url
              : `${baseUrl.replace(/\/$/, '')}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
          }
        : {}),
    })),
  };
}
