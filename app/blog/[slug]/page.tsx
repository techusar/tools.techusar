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
} from 'lucide-react';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/data/blogData';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { extractHeadings } from '@/lib/blog/tableOfContents';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';

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
    };
  }

  const appUrl = 'https://techtools.techusar.com';

  return {
    title: `${post.title} - TechTools Engineering Guides`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt || post.publishDate,
      authors: [post.author?.name || 'TechTools Team'],
      tags: post.tags,
      url: `${appUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
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

  const headings = extractHeadings(post.content);

  const readTimeDisplay = post.readTime || post.readingTime || '5 min read';
  const publishDateDisplay = post.publishedAt || post.publishDate || 'Recent';
  const authorName = post.author?.name || 'TechTools Team';
  const authorRole = post.author?.role || 'Staff Editor';

  // Schema.org BlogPosting
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt || post.publishDate || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechTools by TechUsar',
      url: 'https://techtools.techusar.com',
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://techtools.techusar.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      {/* Dynamic Scroll-Tracking Reading Progress Bar at Top of Page */}
      <ReadingProgressBar targetSelector="#blog-article-body" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        />

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
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-5">
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
      </div>

      {/* Main Content Layout with Table of Contents */}
      {headings.length > 0 ? (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Main Article Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Mobile / Tablet Table of Contents: Rendered above article body */}
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

              <div className="my-8 p-5 sm:p-6 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-900 dark:text-cyan-200 space-y-2">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Try It Directly in TechTools
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  Put these concepts into practice instantly with our zero-data-retention interactive tools.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <Link
                    href="/tools/json-formatter"
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
                  >
                    Open JSON Formatter
                  </Link>
                  <Link
                    href="/tools/image-compressor"
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#171A21] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Open Image Compressor
                  </Link>
                  <Link
                    href="/tools"
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#171A21] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Browse All Tools
                  </Link>
                </div>
              </div>
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

            {/* Quick Interactive Tools Card in Sidebar */}
            <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Featured Utilities
                </h4>
              </div>

              <div className="space-y-2">
                <Link
                  href="/tools/json-formatter"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    JSON Formatter & Validator
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/tools/image-compressor"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    Client-Side Image Compressor
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/tools/regex-tester"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    Interactive RegEx Debugger
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>
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
