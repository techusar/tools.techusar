import { BlogPost } from '@/lib/types';
import { DataStore } from './json-store';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-client-side-developer-tools-matter-for-privacy',
    title: 'Why Client-Side Developer Tools Matter: The Architecture of Zero Data Retention',
    excerpt: 'How modern browser sandboxing allows complex JSON formatting, image compression, and cryptography without ever sending a single byte to an external server.',
    category: 'Security & Architecture',
    readTime: '6 min read',
    publishedAt: 'September 12, 2026',
    author: {
      name: 'TechUsar Engineering Team',
      role: 'Core Platform Systems',
      avatar: 'https://picsum.photos/seed/techusar1/100/100',
    },
    tags: ['Security', 'Privacy', 'WebAssembly', 'Client-Side'],
    content: [
      'In today’s software development landscape, engineers frequently copy-paste production logs, authentication tokens, API payloads, and internal database schemas into random online formatters. What many developers do not realize is that the vast majority of legacy utility websites route these sensitive payloads through central backend servers—frequently logging request bodies, caching data, or exposing keys to third-party tracking scripts.',
      'At TechTools by TechUsar, our primary founding mandate was zero data interception. We believe developer utilities must execute in-browser by default, leveraging modern browser capabilities like the Web Cryptography API, WebAssembly (WASM), Canvas API, and JavaScript engines.',
      'When you use our JSON Formatter, Base64 Decoder, or UUID Generator, computation occurs entirely in your browser’s V8/SpiderMonkey engine memory space. The moment you close the tab, that memory is garbage-collected. No database writes occur, and no server-side telemetry captures your secrets.',
      'For heavy tasks like Image Compression, we utilize client-side HTML5 Canvas manipulation and progressive multi-pass WebP quantization algorithms directly on the device GPU/CPU. This not only protects user privacy but also eliminates network latency, delivering instant results regardless of file size.',
      'Only our dedicated AI tools (such as AI SQL Query Writer or Code Explainer) make encrypted outbound calls to the Gemini 2.5 Flash API proxy—and even then, prompt data is processed transiently without model retention or secondary storage.',
    ],
  },
  {
    slug: 'mastering-regular-expressions-complete-guide',
    title: 'Mastering Regular Expressions: From Basic Character Sets to Advanced Lookaheads',
    excerpt: 'A practical guide to building, testing, and optimizing high-performance RegEx patterns for form validation and data extraction.',
    category: 'Developer Guide',
    readTime: '8 min read',
    publishedAt: 'September 8, 2026',
    author: {
      name: 'Alex Mercer',
      role: 'Senior Staff Engineer',
      avatar: 'https://picsum.photos/seed/techusar2/100/100',
    },
    tags: ['RegEx', 'JavaScript', 'Python', 'Validation'],
    content: [
      'Regular expressions (RegEx) are one of the most powerful and misunderstood tools in a software engineer’s arsenal. Whether parsing system logs, sanitizing input fields, or extracting URLs from unstructured text, a well-crafted regex pattern saves hundreds of lines of procedural code.',
      'Understanding the anatomy of a pattern begins with tokens. Character classes like \\d (digits), \\w (alphanumerics), and \\s (whitespace) form the foundation. Quantifiers like +, *, and {min,max} control match frequency, while non-greedy operators like +? prevent catastrophic backtracking.',
      'Advanced developers frequently rely on Zero-Width Assertions: Positive Lookahead (?=...) and Negative Lookahead (?!...). For example, validating strong passwords requiring at least one lowercase letter, one uppercase letter, one number, and one symbol in any order is neatly expressed as: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      'Using our interactive TechTools Regex Tester, you can test flags (g for global, i for case-insensitive, m for multiline) with real-time match highlighting, index breakdowns, and performance execution benchmarking directly inside your browser.',
    ],
  },
  {
    slug: 'understanding-loan-amortization-and-emi-calculations',
    title: 'Understanding Loan Amortization: How EMI, Principal, and Compound Interest Work',
    excerpt: 'Demystifying the mathematical formulas behind monthly loan payments, interest amortization schedules, and strategies to save thousands in borrowing costs.',
    category: 'Financial Planning',
    readTime: '5 min read',
    publishedAt: 'August 29, 2026',
    author: {
      name: 'Priya Sharma',
      role: 'FinTech Systems Lead',
      avatar: 'https://picsum.photos/seed/techusar3/100/100',
    },
    tags: ['Finance', 'Calculators', 'Loans', 'Interest'],
    content: [
      'When taking out a mortgage, auto loan, or business credit line, understanding how your Equated Monthly Installment (EMI) is calculated is the single most effective way to optimize your repayment strategy.',
      'The standard mathematical formula for EMI calculation is: EMI = [P × R × (1 + R)^N] / [(1 + R)^N – 1], where P is the Principal Loan Amount, R is the Monthly Periodic Interest Rate (Annual Rate divided by 12 and 100), and N is the Loan Tenure in number of months.',
      'In the early years of any long-term loan, the vast majority of your monthly payment goes toward servicing interest rather than reducing the principal. As the principal gradually decreases, the interest portion diminishes while the principal repayment accelerates—a process known as Amortization.',
      'By making even small prepayments early in your loan cycle, you directly diminish the compounding principal balance, potentially saving tens of thousands of dollars in total interest and shaving years off your repayment timeline. Try our Loan EMI Calculator to simulate prepayment scenarios and download itemized amortization tables.',
    ],
  },
  {
    slug: 'how-to-optimize-web-images-for-core-web-vitals',
    title: 'The Ultimate Web Image Optimization Guide: Next-Gen Formats, Compression & Web Vitals',
    excerpt: 'Learn how modern WebP and AVIF formats combined with client-side quantization achieve 80%+ file reduction without perceptual loss.',
    category: 'Performance & Design',
    readTime: '7 min read',
    publishedAt: 'August 18, 2026',
    author: {
      name: 'Marcus Vance',
      role: 'Frontend Architect',
      avatar: 'https://picsum.photos/seed/techusar4/100/100',
    },
    tags: ['WebPerf', 'WebP', 'Images', 'SEO', 'CoreWebVitals'],
    content: [
      'Images consistently account for over 60% of total web page weight. Unoptimized hero banners, blog illustrations, and product thumbnails degrade Largest Contentful Paint (LCP), inflate bandwidth costs, and penalize organic search rankings on Google.',
      'Modern web standards favor next-generation formats like WebP and AVIF. WebP offers 25–34% smaller file sizes than comparable JPEGs at equivalent SSIM quality scores, while maintaining full support for 24-bit color depth and alpha transparency.',
      'Lossy compression works by discarding high-frequency spatial color variations that the human visual cortex cannot readily perceive (chroma subsampling). By tuning the compression factor between 75% and 85%, file sizes drop dramatically with zero noticeable degradation to the naked eye.',
      'With TechTools Image Compressor and Resizer, you can drag-and-drop JPEG, PNG, and WebP files to compress them in batches with instant before-and-after visual comparisons and byte savings stats.',
    ],
  },
  {
    slug: 'json-schema-validation-and-rest-api-best-practices',
    title: 'JSON Best Practices: Schema Validation, Formatting, and Clean API Payloads',
    excerpt: 'A deep dive into writing maintainable JSON contracts, validating schemas, handling deep serialization, and avoiding common REST pitfalls.',
    category: 'Developer Guide',
    readTime: '6 min read',
    publishedAt: 'August 5, 2026',
    author: {
      name: 'TechUsar Engineering Team',
      role: 'Core Platform Systems',
      avatar: 'https://picsum.photos/seed/techusar1/100/100',
    },
    tags: ['JSON', 'REST', 'APIs', 'Validation'],
    content: [
      'JSON (JavaScript Object Notation) has cemented itself as the universal lingua franca of web communication, microservice contracts, and cloud document databases.',
      'However, unformatted or malformed JSON payloads often cause runtime deserialization crashes. Common pitfalls include unescaped quotes, trailing commas in objects or arrays, IEEE 754 floating point precision limits on 64-bit integers, and circular references.',
      'Utilizing strict schema validation (JSON Schema Draft 7/2020-12) allows development teams to enforce payload contracts across API gateways, frontend clients, and background workers, preventing invalid data from entering the database pipeline.',
      'TechTools JSON Formatter provides instant syntax tree validation, error highlight pinpointing, indentation beautification (2 vs 4 spaces), one-click minification for production payloads, and tabular CSV conversion.',
    ],
  },
];

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const storePosts = DataStore.getBlog();
    if (storePosts && storePosts.length > 0) {
      return storePosts;
    }
  } catch {
    // fallback
  }
  return INITIAL_BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllBlogPosts();
  return posts.find((p) => p.slug === slug || p.id === slug);
}

export const BlogRepository = {
  getAll(): BlogPost[] {
    const posts = DataStore.getBlog();
    return posts.length > 0 ? posts : INITIAL_BLOG_POSTS;
  },

  getBySlug(slug: string): BlogPost | undefined {
    const posts = this.getAll();
    return posts.find((p) => p.slug === slug || p.id === slug);
  },

  savePost(post: BlogPost): boolean {
    const posts = this.getAll();
    const idx = posts.findIndex((p) => p.slug === post.slug || (p.id && post.id && p.id === post.id));
    if (idx === -1) {
      posts.unshift({
        ...post,
        id: post.id || `post-${Date.now()}`,
        publishedAt: post.publishedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      });
    } else {
      posts[idx] = {
        ...posts[idx],
        ...post,
      };
    }
    DataStore.saveBlog(posts);
    return true;
  },

  deletePost(slugOrId: string): boolean {
    const posts = this.getAll();
    const filtered = posts.filter((p) => p.slug !== slugOrId && p.id !== slugOrId);
    DataStore.saveBlog(filtered);
    return true;
  },
};
