import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles, Tag, Shield } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/data/blogData';
import { AdWrapper } from '@/components/ads/AdWrapper';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

export const metadata: Metadata = {
  title: 'Engineering Guides & Articles - TechTools by TechUsar',
  description:
    'Deep dives into client-side cryptography, regex mastering, WebP image optimization, JSON schema validation, and financial calculations.',
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog & Guides', current: true },
        ]}
      />

      {/* Header */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Base & Engineering Guides</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          TechTools Developer & Tech Blog
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          In-depth technical tutorials, mathematical breakdowns, security whitepapers, and best-practice guides for software engineers, product designers, and power users.
        </p>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <article
            key={post.slug}
            className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col justify-between space-y-6 transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {post.author.name[0]}
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {post.author.name}
                </span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-1 transition-all"
              >
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Ad Placement: Bottom of blog directory */}
      <AdWrapper slot="blogArticleBottom" placement="blog-bottom" label="Sponsored Content" />
    </div>
  );
}
