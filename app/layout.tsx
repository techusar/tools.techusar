import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
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
        alt: `${SEO_CONFIG.siteName} - 40+ Free Online Developer & AI Utilities`,
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Responsive Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />

        {/* Primary Open Graph / Social Sharing Tags */}
        <meta property="og:site_name" content={SEO_CONFIG.siteName} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SEO_CONFIG.defaultTitle} />
        <meta property="og:description" content={SEO_CONFIG.defaultDescription} />
        <meta property="og:url" content={SEO_CONFIG.siteUrl} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content={SEO_CONFIG.ogImage} />
        <meta property="og:image:secure_url" content={SEO_CONFIG.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="TechTools by TechUsar - 40+ Free Online Developer & AI Utilities" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
        <meta name="twitter:creator" content={SEO_CONFIG.twitterHandle} />
        <meta name="twitter:title" content={SEO_CONFIG.defaultTitle} />
        <meta name="twitter:description" content={SEO_CONFIG.defaultDescription} />
        <meta name="twitter:image" content={SEO_CONFIG.ogImage} />
        <meta name="twitter:image:alt" content="TechTools by TechUsar - 40+ Free Online Developer & AI Utilities" />

        {/* Mobile App & Color Meta */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0B0D11" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={SEO_CONFIG.shortName} />

        {/* Schema.org WebSite & Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />

        {/* Optional Google AdSense client script if configured */}
        {AD_CONFIG.client && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.client}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1FCL4FGWRP"
          strategy="afterInteractive"
        />
        <Script id="google-tag-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-1FCL4FGWRP');
          `}
        </Script>

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
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} font-sans bg-slate-50 text-slate-900 dark:bg-[#0B0D11] dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-200`}
      >
        <ThemeProvider>
          <UserProvider>
            <Navbar tools={tools} />
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
            <AuthModal />
            <UsageLimitModal />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
