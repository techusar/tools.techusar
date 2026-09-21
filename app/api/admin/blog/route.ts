import { NextRequest, NextResponse } from 'next/server';
import { BlogRepository } from '@/lib/data/blogData';
import { BlogPost } from '@/lib/types';

export async function GET() {
  try {
    const posts = BlogRepository.getAll();
    return NextResponse.json({ success: true, posts });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { post } = body;

    if (!post || !post.title || !post.slug) {
      return NextResponse.json({ error: 'Valid blog post with title and slug required' }, { status: 400 });
    }

    const postData: BlogPost = {
      id: post.id || `post-${Date.now()}`,
      slug: post.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'General',
      readTime: post.readTime || post.readingTime || '5 min read',
      readingTime: post.readingTime || post.readTime || '5 min read',
      publishedAt: post.publishedAt || post.publishDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      publishDate: post.publishDate || post.publishedAt || new Date().toISOString(),
      author: {
        name: post.author?.name || 'TechUsar Team',
        role: post.author?.role || 'Staff Editor',
        avatar: post.author?.avatar || 'https://picsum.photos/seed/techtools/100/100',
      },
      tags: Array.isArray(post.tags) ? post.tags : (post.tags ? String(post.tags).split(',').map((t: string) => t.trim()) : []),
      relatedTools: Array.isArray(post.relatedTools) ? post.relatedTools : [],
      featured: Boolean(post.featured),
    };

    BlogRepository.savePost(postData);
    return NextResponse.json({ success: true, message: 'Blog post published successfully', post: postData });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error saving blog post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || searchParams.get('id');
    if (!slug) {
      return NextResponse.json({ error: 'Slug or ID required to delete post' }, { status: 400 });
    }
    BlogRepository.deletePost(slug);
    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error deleting blog post' }, { status: 500 });
  }
}
