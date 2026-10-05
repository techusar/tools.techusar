import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeContext';
import { UserProvider } from '@/components/auth/UserContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { UsageLimitModal } from '@/components/tools/UsageLimitModal';
import { SEO_CONFIG } from '@/lib/seo/config';
import { AD_CONFIG } from '@/lib/ad-config';
import { getAllTools } from '@/lib/data/toolsRepository';
import { BrandedLoading } from '@/components/ui/BrandedLoading';
import { NavigationProgressBar } from '@/components/navigation/NavigationProgressBar';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0D11' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: `%s | ${SEO_CONFIG.shortName}`,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: [...SEO_CONFIG.defaultKeywords],
  authors: [{ name: SEO_CONFIG.author, url: SEO_CONFIG.siteUrl }],
  creator: SEO_CONFIG.author,
  publisher: SEO_CONFIG.parentCompany,
  alternates: {
    canonical: SEO_CONFIG.siteUrl,
  },
  openGraph: {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: SEO_CONFIG.ogImage,
        secureUrl: SEO_CONFIG.ogImage,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `${SEO_CONFIG.siteName} - ${SEO_CONFIG.totalToolsLabel} Free Online Developer & AI Utilities`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO_CONFIG.twitterHandle,
    creator: SEO_CONFIG.twitterHandle,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [
      {
        url: SEO_CONFIG.ogImage,
        alt: `${SEO_CONFIG.siteName} Suite`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SEO_CONFIG.shortName,
  },
  formatDetection: {
    telephone: false,
  },
};

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SEO_CONFIG.siteUrl}#organization`,
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      logo: `${SEO_CONFIG.siteUrl}/icon.png`,
      sameAs: [
        'https://twitter.com/TechUsar',
        'https://github.com/TechUsar',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+923318917330',
        email: SEO_CONFIG.contactEmail,
        contactType: 'customer support',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SEO_CONFIG.siteUrl}#website`,
      url: SEO_CONFIG.siteUrl,
      name: SEO_CONFIG.siteName,
      description: SEO_CONFIG.defaultDescription,
      publisher: {
        '@id': `${SEO_CONFIG.siteUrl}#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SEO_CONFIG.siteUrl}/tools?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tools = await getAllTools();
  // Strip heavy SEO/FAQ content when passing tools to Navbar search to minimize RSC layout chunk size
  const searchTools = tools.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    category: t.category,
    categoryName: t.categoryName,
    description: t.description,
    icon: t.icon,
    type: t.type,
    status: t.status,
    tags: t.tags || [],
    unlimited: t.unlimited,
    anonymousLimit: t.anonymousLimit,
    authenticatedLimit: t.authenticatedLimit,
    seoTitle: t.seoTitle,
    seoDescription: t.seoDescription,
    howToUse: [],
    features: [],
    faqs: [],
  }));

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head />
      <body
        className="font-sans bg-slate-50 text-slate-900 dark:bg-[#0B0D11] dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-200"
      >
        {/* Theme initialization inline script to prevent light/dark flicker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('techtools_theme');
                  if (t === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Schema.org WebSite & Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />

        {/* Google tag (gtag.js) deferred to eliminate main-thread TBT */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1FCL4FGWRP"
          strategy="lazyOnload"
        />
        <Script id="google-tag-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1FCL4FGWRP');
          `}
        </Script>

        {/* Optional Google AdSense client script if configured */}
        {AD_CONFIG.client && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.client}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}

        <NavigationProgressBar />
        <ThemeProvider>
          <UserProvider>
            <Navbar tools={searchTools} />
            <main className="flex-1 w-full">
              <Suspense
                fallback={
                  <div className="w-full flex-1 flex items-center justify-center">
                    <BrandedLoading
                      fullPage
                      title="Loading TechTools"
                      description="Preparing interactive tool and blog workspace..."
                    />
                  </div>
                }
              >
                {children}
              </Suspense>
            </main>
            <Footer />
            <WhatsAppButton />
            <AuthModal />
            <UsageLimitModal />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
