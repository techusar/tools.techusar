import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Tag,
  Shield,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Wrench,
} from 'lucide-react';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/data/blogData';
import { getToolBySlug } from '@/lib/data/toolsRepository';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { extractHeadings } from '@/lib/blog/tableOfContents';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { SEO_CONFIG, getCanonicalUrl } from '@/lib/seo/config';
import { ToolItem } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found - TechTools Blog',
      description: 'The requested technical guide could not be found.',
    };
  }

  const canonicalUrl = getCanonicalUrl(`/blog/${post.slug}`);
  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&cat=${encodeURIComponent(post.category)}`;

  return {
    title: `${post.title} | ${SEO_CONFIG.shortName} Guides`,
    description: post.excerpt,
    keywords: [
      ...(post.tags || []),
      post.category.toLowerCase(),
      'developer tutorial',
      'engineering guide',
      'tech tools',
      'best practices',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | ${SEO_CONFIG.shortName}`,
      description: post.excerpt,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.publishedAt || post.publishDate,
      authors: [post.author?.name || SEO_CONFIG.author],
      tags: post.tags,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: SEO_CONFIG.twitterHandle,
      images: [ogImageUrl],
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
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  // Fetch specifically associated tools for contextual internal linking
  const associatedToolSlugs = post.relatedTools && post.relatedTools.length > 0
    ? post.relatedTools
    : ['json-formatter', 'image-compressor', 'regex-tester'];

  const associatedTools = (
    await Promise.all(associatedToolSlugs.map((s) => getToolBySlug(s)))
  ).filter((t): t is ToolItem => Boolean(t));

  const headings = extractHeadings(post.content);

  const readTimeDisplay = post.readTime || post.readingTime || '5 min read';
  const publishDateDisplay = post.publishedAt || post.publishDate || 'Recent';
  const authorName = post.author?.name || 'TechTools Engineering Team';
  const authorRole = post.author?.role || 'Technical Architecture';

  const canonicalUrl = getCanonicalUrl(`/blog/${post.slug}`);

  // Schema.org BlogPosting
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt || post.publishDate || new Date().toISOString(),
    dateModified: post.publishedAt || post.publishDate || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      logo: `${SEO_CONFIG.siteUrl}/icon.png`,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SEO_CONFIG.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: getCanonicalUrl('/blog'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      {/* Dynamic Scroll-Tracking Reading Progress Bar at Top of Page */}
      <ReadingProgressBar targetSelector="#blog-article-body" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-10">
        {/* Breadcrumb Navigation & Back to Guides */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title, current: true },
            ]}
          />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Guides</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {readTimeDisplay}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {publishDateDisplay}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author box */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {authorName[0]}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {authorName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {post.tags?.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content Layout with Table of Contents & Relevant Tools */}
        {headings.length > 0 ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Main Article Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Mobile / Tablet Table of Contents */}
              <div className="lg:hidden">
                <TableOfContents
                  items={headings}
                  variant="mobile"
                  articleTitle={post.title}
                />
              </div>

              {/* Article Body Content */}
              <article
                id="blog-article-body"
                className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-6"
              >
                <ArticleContent content={post.content} headings={headings} />

                {/* Direct High-Converting Tool CTA Box */}
                {associatedTools.length > 0 && (
                  <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 border border-cyan-500/20 text-slate-900 dark:text-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                          <Wrench className="w-5 h-5" />
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Put This Guide into Practice with Free Online Tools
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            100% in-browser processing, zero data retention, and instant execution.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {associatedTools.map((t) => (
                        <Link
                          key={t.id}
                          href={`/tools/${t.slug}`}
                          className="p-3.5 rounded-xl bg-white dark:bg-[#171A21] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500 dark:hover:border-cyan-500/60 shadow-xs transition-all group flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                              {t.categoryName}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {t.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                              {t.description}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                            <span>Launch Tool</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              {/* Ad Placement: Bottom of blog article */}
              <AdWrapper slot="blogArticleBottom" placement="blog-bottom" />
            </div>

            {/* Desktop Sticky Sidebar */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              <TableOfContents
                items={headings}
                variant="sidebar"
                articleTitle={post.title}
              />

              {/* Related Interactive Tools Card in Sidebar */}
              {associatedTools.length > 0 && (
                <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Recommended Tools
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {associatedTools.map((t) => (
                      <Link
                        key={t.id}
                        href={`/tools/${t.slug}`}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="truncate pr-2">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 block truncate">
                            {t.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {t.categoryName}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/tools"
                    className="block text-center text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    Explore all {SEO_CONFIG.shortName} tools →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <article className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-6">
              <ArticleContent content={post.content} headings={[]} />
            </article>
            <AdWrapper slot="blogArticleBottom" placement="blog-bottom" />
          </div>
        )}

        {/* Related Reading */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Related Technical Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 space-y-2 block transition-all group"
                >
                  <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                    {rp.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {rp.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{rp.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
