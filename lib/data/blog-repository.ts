import { DataStore } from './json-store';
import { BlogPost } from '../types';

export const BlogRepository = {
  getAll(): BlogPost[] {
    return DataStore.getBlog();
  },

  getBySlug(slug: string): BlogPost | undefined {
    const posts = DataStore.getBlog();
    return posts.find((p) => p.slug === slug || p.id === slug);
  },

  search(query: string): BlogPost[] {
    if (!query) return [];
    const q = query.toLowerCase();
    const posts = DataStore.getBlog();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  },

  savePost(post: BlogPost): boolean {
    const posts = DataStore.getBlog();
    const idx = posts.findIndex((p) => p.id === post.id || p.slug === post.slug);
    if (idx === -1) {
      posts.unshift(post);
    } else {
      posts[idx] = post;
    }
    DataStore.saveBlog(posts);
    return true;
  },

  deletePost(slugOrId: string): boolean {
    const posts = DataStore.getBlog();
    const filtered = posts.filter((p) => p.id !== slugOrId && p.slug !== slugOrId);
    DataStore.saveBlog(filtered);
    return true;
  },
};
