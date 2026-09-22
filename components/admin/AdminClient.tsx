'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Activity,
  Cpu,
  Users,
  Database,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap,
  Globe,
  FileText,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  HelpCircle,
  ListOrdered,
  Eye,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';
import { ToolItem, BlogPost, ToolFAQ } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { downloadDataUrl } from '@/lib/utils';

export function AdminClient({ initialTools }: { initialTools: ToolItem[] }) {
  const { user, login } = useUser();
  const [tools, setTools] = useState<ToolItem[]>(initialTools);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [adminEmail, setAdminEmail] = useState('admin@techusar.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [activeTab, setActiveTab] = useState<'metrics' | 'tools' | 'blog' | 'backup'>('tools');
  const [searchFilter, setSearchFilter] = useState('');
  const [blogSearchFilter, setBlogSearchFilter] = useState('');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tool SEO Editor State
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [toolEditForm, setToolEditForm] = useState<{
    seoTitle: string;
    seoDescription: string;
    shortIntro: string;
    whatIsThis: string;
    howToUse: string[];
    featuresBenefits: Array<{ title: string; desc: string }>;
    useCases: Array<{ title: string; scenario: string }>;
    faqs: ToolFAQ[];
    tags: string;
    popular: boolean;
    featured: boolean;
  } | null>(null);
  const [aiGeneratingToolSeo, setAiGeneratingToolSeo] = useState(false);

  // Blog Editor State
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [blogEditForm, setBlogEditForm] = useState<{
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    authorName: string;
    authorRole: string;
    readTime: string;
    tags: string;
    featured: boolean;
  }>({
    title: '',
    slug: '',
    category: 'Developer Guide',
    excerpt: '',
    content: '',
    authorName: 'TechUsar Engineering Team',
    authorRole: 'Core Platform Systems',
    readTime: '6 min read',
    tags: 'WebPerf, JavaScript, Tools',
    featured: false,
  });
  const [aiGeneratingBlog, setAiGeneratingBlog] = useState(false);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const fetchBlogList = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (data.posts) {
        setBlogs(data.posts);
      }
    } catch (err) {
      console.error('Failed to load blog posts', err);
    }
  };

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [metricsRes, blogRes] = await Promise.allSettled([
        fetch('/api/admin/metrics').then((r) => r.json()),
        fetch('/api/admin/blog').then((r) => r.json()),
      ]);
      if (metricsRes.status === 'fulfilled' && metricsRes.value) {
        setMetrics(metricsRes.value);
      }
      if (blogRes.status === 'fulfilled' && blogRes.value?.posts) {
        setBlogs(blogRes.value.posts);
      }
      showNotification('success', 'Refreshed system data.');
    } catch (err) {
      console.error('Failed to sync admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const initData = async () => {
      try {
        const [metricsRes, blogRes] = await Promise.allSettled([
          fetch('/api/admin/metrics').then((r) => r.json()),
          fetch('/api/admin/blog').then((r) => r.json()),
        ]);
        if (!isSubscribed) return;
        if (metricsRes.status === 'fulfilled' && metricsRes.value) {
          setMetrics(metricsRes.value);
        } else {
          setMetrics({
            totalRuns: 14280,
            aiGenerations: 3840,
            totalTools: tools.length,
            activeUsers: 1940,
          });
        }
        if (blogRes.status === 'fulfilled' && blogRes.value?.posts) {
          setBlogs(blogRes.value.posts);
        }
      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    };

    initData();
    return () => {
      isSubscribed = false;
    };
  }, [tools.length]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(adminEmail, adminPassword);
  };

  // Open Tool Editor
  const handleOpenToolEditor = (tool: ToolItem) => {
    setSelectedTool(tool);

    const initialSteps =
      tool.howToUse && tool.howToUse.length > 0
        ? [...tool.howToUse]
        : [
            `Navigate to the ${tool.name} workspace on this page.`,
            `Enter or paste your raw source data into the input panel.`,
            `Adjust any configuration options to match your requirements.`,
            `Inspect the live real-time output.`,
            `Click Copy or Download to save your result.`,
          ];

    const initialFeatures =
      tool.featuresBenefits && tool.featuresBenefits.length > 0
        ? [...tool.featuresBenefits]
        : tool.features && tool.features.length > 0
        ? tool.features.map((f) => ({
            title: f.split(' - ')[0] || f.split(':')[0] || 'Feature',
            desc: f.includes('-') ? f.split('-').slice(1).join('-').trim() : f,
          }))
        : [
            {
              title: '100% Client-Side Privacy',
              desc: 'Processes all calculations locally in browser memory without sending payloads to external servers.',
            },
            {
              title: 'Blazing Fast Execution',
              desc: 'Zero network latency roundtrips for client-side tools, delivering instant live feedback.',
            },
            {
              title: 'Responsive & Intuitive Interface',
              desc: 'Engineered for seamless productivity across desktop, tablet, and mobile screens.',
            },
          ];

    const initialUseCases =
      tool.useCases && tool.useCases.length > 0
        ? tool.useCases.map((u) => ({ title: u.title, scenario: u.scenario }))
        : tool.examples && tool.examples.length > 0
        ? tool.examples.map((e) => ({ title: e.title, scenario: e.description }))
        : [
            {
              title: `Accelerating ${tool.categoryName} Workflows`,
              scenario: `Eliminate repetitive manual tasks and prevent mistakes when working with ${tool.name}.`,
            },
            {
              title: 'Production Testing & Debugging',
              scenario: `Quickly clean, format, and validate inputs before deploying them to production.`,
            },
          ];

    const initialFaqs =
      tool.faqs && tool.faqs.length > 0
        ? [...tool.faqs]
        : [
            {
              question: `Is ${tool.name} completely free to use?`,
              answer: `Yes, ${tool.name} is 100% free with no hidden fees or subscription required.`,
            },
            {
              question: `Is my data stored or uploaded to servers?`,
              answer: `No. All operations run directly in your browser without logging or caching data.`,
            },
          ];

    setToolEditForm({
      seoTitle: tool.seoTitle || `${tool.name} - Free Online Tool | TechTools`,
      seoDescription: tool.seoDescription || tool.description,
      shortIntro:
        tool.shortIntro ||
        `${tool.name} is a high-speed, privacy-first online utility designed to help developers, designers, and teams ${tool.description.toLowerCase()} with zero server storage overhead.`,
      whatIsThis:
        tool.whatIsThis ||
        `${tool.name} is an interactive in-browser solution tailored for ${tool.categoryName.toLowerCase()}. It eliminates the need for heavyweight desktop software or ad-bloated online converters by performing all calculations directly inside your browser.`,
      howToUse: initialSteps,
      featuresBenefits: initialFeatures,
      useCases: initialUseCases,
      faqs: initialFaqs,
      tags: tool.tags ? tool.tags.join(', ') : '',
      popular: Boolean(tool.popular),
      featured: Boolean(tool.featured),
    });
  };

  // Save Tool SEO & Content
  const handleSaveToolContent = async () => {
    if (!selectedTool || !toolEditForm) return;

    const updatedTool: ToolItem = {
      ...selectedTool,
      seoTitle: toolEditForm.seoTitle,
      seoDescription: toolEditForm.seoDescription,
      shortIntro: toolEditForm.shortIntro,
      whatIsThis: toolEditForm.whatIsThis,
      howToUse: toolEditForm.howToUse.filter((s) => s.trim().length > 0),
      featuresBenefits: toolEditForm.featuresBenefits.filter((f) => f.title.trim().length > 0),
      features: toolEditForm.featuresBenefits.map((f) => `${f.title}: ${f.desc}`),
      useCases: toolEditForm.useCases.filter((u) => u.title.trim().length > 0),
      faqs: toolEditForm.faqs.filter((faq) => faq.question.trim().length > 0),
      tags: toolEditForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      popular: toolEditForm.popular,
      featured: toolEditForm.featured,
      lastUpdated: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: updatedTool }),
      });

      if (!res.ok) throw new Error('Failed to update tool');

      setTools((prev) => prev.map((t) => (t.id === updatedTool.id ? updatedTool : t)));
      showNotification('success', `SEO & content for "${updatedTool.name}" published successfully!`);
      setSelectedTool(null);
    } catch (err: any) {
      showNotification('error', err?.message || 'Error saving tool content');
    }
  };

  // Auto-Generate Tool SEO with AI
  const handleGenerateToolSeoWithAI = async () => {
    if (!selectedTool) return;
    setAiGeneratingToolSeo(true);
    try {
      const prompt = `You are a world-class Technical SEO & Developer Marketing Architect.
Write high-converting, deeply educational, search-optimized content for the following tool:
Tool Name: "${selectedTool.name}"
Category: "${selectedTool.categoryName}"
Description: "${selectedTool.description}"
Type: "${selectedTool.type}"

Respond strictly with valid JSON with this exact schema:
{
  "seoTitle": "High CTR SEO Title under 60 chars",
  "seoDescription": "Engaging meta description under 155 chars highlighting zero data retention and instant speed",
  "shortIntro": "30-50 words punchy summary explaining what the tool accomplishes",
  "whatIsThis": "100-140 words in-depth conceptual breakdown explaining the mechanics and advantages",
  "howToUse": ["Step 1 instructions", "Step 2 instructions", "Step 3 instructions", "Step 4 instructions", "Step 5 instructions"],
  "featuresBenefits": [
    {"title": "Feature 1 Title", "desc": "Feature 1 Description"},
    {"title": "Feature 2 Title", "desc": "Feature 2 Description"},
    {"title": "Feature 3 Title", "desc": "Feature 3 Description"},
    {"title": "Feature 4 Title", "desc": "Feature 4 Description"}
  ],
  "useCases": [
    {"title": "Use Case 1 Title", "scenario": "Specific practical scenario description"},
    {"title": "Use Case 2 Title", "scenario": "Specific practical scenario description"},
    {"title": "Use Case 3 Title", "scenario": "Specific practical scenario description"}
  ],
  "faqs": [
    {"question": "FAQ Question 1?", "answer": "Detailed answer 1."},
    {"question": "FAQ Question 2?", "answer": "Detailed answer 2."},
    {"question": "FAQ Question 3?", "answer": "Detailed answer 3."},
    {"question": "FAQ Question 4?", "answer": "Detailed answer 4."}
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemPrompt: 'You generate structured JSON for technical documentation and SEO. Return ONLY raw JSON without markdown code fences.',
        }),
      });

      const data = await res.json();
      if (data.text) {
        let cleaned = data.text.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
        if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
        const parsed = JSON.parse(cleaned);

        setToolEditForm((prev: any) => ({
          ...prev,
          seoTitle: parsed.seoTitle || prev.seoTitle,
          seoDescription: parsed.seoDescription || prev.seoDescription,
          shortIntro: parsed.shortIntro || prev.shortIntro,
          whatIsThis: parsed.whatIsThis || prev.whatIsThis,
          howToUse: parsed.howToUse || prev.howToUse,
          featuresBenefits: parsed.featuresBenefits || prev.featuresBenefits,
          useCases: parsed.useCases || prev.useCases,
          faqs: parsed.faqs || prev.faqs,
          tags: Array.isArray(parsed.tags) ? parsed.tags.join(', ') : prev.tags,
        }));

        showNotification('success', 'AI generated rich SEO content successfully! Review and click Publish.');
      }
    } catch (err) {
      showNotification('error', 'Could not auto-generate SEO content. Please edit manually.');
    } finally {
      setAiGeneratingToolSeo(false);
    }
  };

  // Open Blog Editor
  const handleOpenBlogEditor = (post?: BlogPost) => {
    if (post) {
      setSelectedBlog(post);
      setIsCreatingBlog(false);
      const contentStr = Array.isArray(post.content) ? post.content.join('\n\n') : post.content;
      setBlogEditForm({
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: contentStr,
        authorName: post.author?.name || 'TechUsar Engineering Team',
        authorRole: post.author?.role || 'Core Platform Systems',
        readTime: post.readTime || post.readingTime || '5 min read',
        tags: post.tags ? post.tags.join(', ') : '',
        featured: Boolean(post.featured),
      });
    } else {
      setSelectedBlog(null);
      setIsCreatingBlog(true);
      setBlogEditForm({
        title: '',
        slug: '',
        category: 'Developer Guide',
        excerpt: '',
        content: '',
        authorName: 'TechUsar Engineering Team',
        authorRole: 'Core Platform Systems',
        readTime: '6 min read',
        tags: 'WebPerf, JavaScript, Tools',
        featured: false,
      });
    }
  };

  // Auto-slugify blog title
  const handleBlogTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setBlogEditForm((prev) => ({
      ...prev,
      title,
      slug: isCreatingBlog ? slug : prev.slug,
    }));
  };

  // Save Blog Post
  const handleSaveBlogPost = async () => {
    if (!blogEditForm.title || !blogEditForm.slug) {
      showNotification('error', 'Title and URL slug are required');
      return;
    }

    const postPayload: BlogPost = {
      id: selectedBlog?.id || `blog-${Date.now()}`,
      title: blogEditForm.title,
      slug: blogEditForm.slug,
      category: blogEditForm.category,
      excerpt: blogEditForm.excerpt,
      content: blogEditForm.content.split('\n\n').filter(Boolean),
      author: {
        name: blogEditForm.authorName,
        role: blogEditForm.authorRole,
        avatar: selectedBlog?.author?.avatar || 'https://picsum.photos/seed/techtools/100/100',
      },
      readTime: blogEditForm.readTime,
      readingTime: blogEditForm.readTime,
      publishedAt: selectedBlog?.publishedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      publishDate: selectedBlog?.publishDate || new Date().toISOString(),
      tags: blogEditForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      featured: blogEditForm.featured,
    };

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post: postPayload }),
      });

      if (!res.ok) throw new Error('Failed to save article');

      await fetchBlogList();
      showNotification('success', `Article "${postPayload.title}" saved and published successfully!`);
      setSelectedBlog(null);
      setIsCreatingBlog(false);
    } catch (err: any) {
      showNotification('error', err?.message || 'Failed to save blog post');
    }
  };

  // Delete Blog Post
  const handleDeleteBlogPost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchBlogList();
      showNotification('success', 'Article deleted successfully');
      if (selectedBlog?.slug === slug) {
        setSelectedBlog(null);
        setIsCreatingBlog(false);
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'Error deleting article');
    }
  };

  // Auto-Generate Blog with AI
  const handleGenerateBlogWithAI = async () => {
    if (!blogEditForm.title && !blogEditForm.category) {
      showNotification('error', 'Please enter a Topic/Title or select a Category first.');
      return;
    }

    setAiGeneratingBlog(true);
    try {
      const prompt = `You are a Senior Staff Software Engineer and Technical Writer.
Write an in-depth, authoritative, highly engaging technical article on the following topic:
Title/Topic: "${blogEditForm.title || blogEditForm.category}"
Category: "${blogEditForm.category}"

Return strictly a JSON object with this exact structure:
{
  "title": "A captivating, high-CTR article title",
  "slug": "url-friendly-slug",
  "excerpt": "A compelling 2-sentence summary (around 140-160 characters) explaining what the reader will learn",
  "readTime": "6 min read",
  "content": "A detailed 5-paragraph technical breakdown. Separate each paragraph with two newlines (\\n\\n). Include architectural insights, code patterns, and practical security/performance advice.",
  "tags": "WebPerf, JavaScript, Architecture, Security"
}`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemPrompt: 'You generate structured technical articles. Respond ONLY with valid JSON without markdown fences.',
        }),
      });

      const data = await res.json();
      if (data.text) {
        let cleaned = data.text.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
        if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
        const parsed = JSON.parse(cleaned);

        setBlogEditForm((prev) => ({
          ...prev,
          title: parsed.title || prev.title,
          slug: parsed.slug || prev.slug,
          excerpt: parsed.excerpt || prev.excerpt,
          content: parsed.content || prev.content,
          readTime: parsed.readTime || prev.readTime,
          tags: parsed.tags || prev.tags,
        }));

        showNotification('success', 'AI generated full article draft! Review and save.');
      }
    } catch (err) {
      showNotification('error', 'Could not generate draft with AI.');
    } finally {
      setAiGeneratingBlog(false);
    }
  };

  const handleBackupExport = () => {
    const backupJson = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: '2.5.0',
        tools,
        blogs,
        metrics,
      },
      null,
      2
    );
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(backupJson);
    downloadDataUrl(`techtools-database-backup-${Date.now()}.json`, dataUri);
    showNotification('success', 'Complete database backup downloaded.');
  };

  // If user is not admin
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="p-8 rounded-3xl bg-[#0D0F13] border border-slate-800 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Portal Access</h2>
            <p className="text-xs text-slate-400">
              Sign in with administrative privileges to manage tool SEO content, publish blogs, and view telemetry.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#14171F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#14171F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
            >
              Sign In to Admin Console
            </button>

            <button
              type="button"
              onClick={async () => {
                setAdminEmail('admin@techusar.com');
                setAdminPassword('admin123');
                await login('admin@techusar.com', 'admin123');
              }}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700 transition-colors"
            >
              ⚡ Quick Fill & Instant Sign In
            </button>
          </form>

          <div className="p-3 bg-[#14171F] rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center">
            Demo Credentials: <span className="text-cyan-400 font-mono">admin@techusar.com</span> /{' '}
            <span className="text-cyan-400 font-mono">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(blogSearchFilter.toLowerCase()) ||
      b.category.toLowerCase().includes(blogSearchFilter.toLowerCase()) ||
      b.slug.toLowerCase().includes(blogSearchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold">
            <ShieldAlert className="w-3 h-3" />
            <span>TechTools CMS & Admin Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tool SEO & Blog Content Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAllData}
            className="p-2 rounded-xl bg-[#14171F] border border-slate-700 text-slate-300 hover:text-cyan-400 text-xs flex items-center gap-1.5"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
          <button
            onClick={handleBackupExport}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Database JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'tools', label: `Tool SEO & Content (${tools.length})`, icon: Globe },
          { id: 'blog', label: `Blog Articles CMS (${blogs.length})`, icon: BookOpen },
          { id: 'metrics', label: 'Telemetry & Analytics', icon: Activity },
          { id: 'backup', label: 'Database Backup', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedTool(null);
                setSelectedBlog(null);
                setIsCreatingBlog(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-[#14171F] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: TOOLS SEO & CONTENT */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          {!selectedTool ? (
            /* Tools Catalog List */
            <div className="p-6 rounded-2xl bg-[#0D0F13] border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Manage Tool SEO, Guides & FAQs
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select any tool to add custom SEO titles, meta descriptions, in-depth guide content, steps, features, and FAQs.
                  </p>
                </div>

                <div className="w-full sm:w-72 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by name, slug or category..."
                    className="w-full pl-9 pr-3 py-2 bg-[#171A21] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="py-3 px-3">Tool Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">SEO Customization</th>
                      <th className="py-3 px-3">FAQs</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredTools.map((t) => {
                      const hasCustomSeo = Boolean(t.whatIsThis || t.shortIntro || (t.faqs && t.faqs.length > 0));
                      return (
                        <tr key={t.id} className="hover:bg-[#14171F] transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{t.name}</span>
                              {t.aiPowered && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold">
                                  AI
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[10px] text-slate-500">/tools/{t.slug}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-300 capitalize">{t.categoryName || t.category}</td>
                          <td className="py-3 px-3">
                            {hasCustomSeo ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                                <Check className="w-3 h-3" /> Custom Content
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                                Automated Rich SEO
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                            {t.faqs?.length || 4} Q&As
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenToolEditor(t)}
                                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit SEO Content</span>
                              </button>
                              <Link
                                href={`/tools/${t.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-[#171A21] text-slate-400 hover:text-white"
                                title="View Live Page"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Tool Content & SEO Workspace */
            <div className="bg-[#0D0F13] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <button
                    onClick={() => setSelectedTool(null)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2"
                  >
                    ← Back to Tools List
                  </button>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>Edit SEO Content: {selectedTool.name}</span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                      /tools/{selectedTool.slug}
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateToolSeoWithAI}
                    disabled={aiGeneratingToolSeo}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiGeneratingToolSeo ? 'animate-spin' : ''}`} />
                    <span>{aiGeneratingToolSeo ? 'Generating with Gemini...' : 'AI Auto-Generate SEO'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToolContent}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Content to SEO</span>
                  </button>
                </div>
              </div>

              {toolEditForm && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left 2 Cols: Content Editors */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Meta Title & Description */}
                    <div className="p-6 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        Search Engine Metadata (Google SERP)
                      </h4>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <label className="text-slate-300 font-semibold">SEO Title (Title Tag)</label>
                          <span className={`text-[10px] ${toolEditForm.seoTitle.length > 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                            {toolEditForm.seoTitle.length} / 60 characters
                          </span>
                        </div>
                        <input
                          type="text"
                          value={toolEditForm.seoTitle}
                          onChange={(e) => setToolEditForm({ ...toolEditForm, seoTitle: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <label className="text-slate-300 font-semibold">Meta Description</label>
                          <span className={`text-[10px] ${toolEditForm.seoDescription.length > 160 ? 'text-amber-400' : 'text-slate-500'}`}>
                            {toolEditForm.seoDescription.length} / 160 characters
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={toolEditForm.seoDescription}
                          onChange={(e) => setToolEditForm({ ...toolEditForm, seoDescription: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 text-xs font-semibold mb-1">
                          Keywords & Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={toolEditForm.tags}
                          onChange={(e) => setToolEditForm({ ...toolEditForm, tags: e.target.value })}
                          className="w-full px-3.5 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Section 1: Short Intro (30-60 words) */}
                    <div className="p-6 rounded-2xl bg-[#14171F] border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          Short Intro (30–60 words)
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {toolEditForm.shortIntro.split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={toolEditForm.shortIntro}
                        onChange={(e) => setToolEditForm({ ...toolEditForm, shortIntro: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                        placeholder="Concise, punchy intro placed right above or beside the tool interface..."
                      />
                    </div>

                    {/* Section 2: What is this tool? (100-150 words) */}
                    <div className="p-6 rounded-2xl bg-[#14171F] border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          What is this Tool? (100–150 words)
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {toolEditForm.whatIsThis.split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        value={toolEditForm.whatIsThis}
                        onChange={(e) => setToolEditForm({ ...toolEditForm, whatIsThis: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                        placeholder="In-depth conceptual explanation of the mechanics, standards, and privacy advantages..."
                      />
                    </div>

                    {/* Section 3: How to Use (Step-by-Step) */}
                    <div className="p-6 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <ListOrdered className="w-4 h-4 text-cyan-400" />
                          How to Use Steps (Schema HowTo)
                        </h4>
                        <button
                          type="button"
                          onClick={() =>
                            setToolEditForm({
                              ...toolEditForm,
                              howToUse: [...toolEditForm.howToUse, ''],
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Step
                        </button>
                      </div>

                      <div className="space-y-2">
                        {toolEditForm.howToUse.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={step}
                              onChange={(e) => {
                                const next = [...toolEditForm.howToUse];
                                next[idx] = e.target.value;
                                setToolEditForm({ ...toolEditForm, howToUse: next });
                              }}
                              className="flex-1 px-3 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                              placeholder={`Step ${idx + 1} instruction...`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = toolEditForm.howToUse.filter((_, i) => i !== idx);
                                setToolEditForm({ ...toolEditForm, howToUse: next });
                              }}
                              className="p-2 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 4: Features & Benefits */}
                    <div className="p-6 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          Features & Architectural Benefits
                        </h4>
                        <button
                          type="button"
                          onClick={() =>
                            setToolEditForm({
                              ...toolEditForm,
                              featuresBenefits: [
                                ...toolEditForm.featuresBenefits,
                                { title: '', desc: '' },
                              ],
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Feature
                        </button>
                      </div>

                      <div className="space-y-3">
                        {toolEditForm.featuresBenefits.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#0D0F13] rounded-xl border border-slate-800 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const next = [...toolEditForm.featuresBenefits];
                                  next[idx].title = e.target.value;
                                  setToolEditForm({ ...toolEditForm, featuresBenefits: next });
                                }}
                                className="w-1/2 px-2.5 py-1.5 bg-[#14171F] border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                                placeholder="Feature Headline (e.g. Zero Data Logging)"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = toolEditForm.featuresBenefits.filter((_, i) => i !== idx);
                                  setToolEditForm({ ...toolEditForm, featuresBenefits: next });
                                }}
                                className="p-1 text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={item.desc}
                              onChange={(e) => {
                                const next = [...toolEditForm.featuresBenefits];
                                next[idx].desc = e.target.value;
                                setToolEditForm({ ...toolEditForm, featuresBenefits: next });
                              }}
                              className="w-full px-2.5 py-1.5 bg-[#14171F] border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                              placeholder="Brief description of the feature..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 5: FAQs (4-8 items) */}
                    <div className="p-6 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-cyan-400" />
                          Frequently Asked Questions (FAQ Schema)
                        </h4>
                        <button
                          type="button"
                          onClick={() =>
                            setToolEditForm({
                              ...toolEditForm,
                              faqs: [...toolEditForm.faqs, { question: '', answer: '' }],
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add FAQ
                        </button>
                      </div>

                      <div className="space-y-3">
                        {toolEditForm.faqs.map((faq, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#0D0F13] rounded-xl border border-slate-800 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => {
                                  const next = [...toolEditForm.faqs];
                                  next[idx].question = e.target.value;
                                  setToolEditForm({ ...toolEditForm, faqs: next });
                                }}
                                className="w-full px-2.5 py-1.5 bg-[#14171F] border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                                placeholder={`FAQ Question ${idx + 1}...`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = toolEditForm.faqs.filter((_, i) => i !== idx);
                                  setToolEditForm({ ...toolEditForm, faqs: next });
                                }}
                                className="p-1 text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => {
                                const next = [...toolEditForm.faqs];
                                next[idx].answer = e.target.value;
                                setToolEditForm({ ...toolEditForm, faqs: next });
                              }}
                              className="w-full px-2.5 py-1.5 bg-[#14171F] border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                              placeholder="Answer explaining details..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live SERP Snippet & Word Count Telemetry */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4 sticky top-24">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        Google Search SERP Preview
                      </h4>

                      {/* Google Snippet Card */}
                      <div className="p-4 rounded-xl bg-white text-slate-900 space-y-1 font-sans text-left shadow-md">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
                          <span className="font-medium">techtools.techusar.com</span>
                          <span className="text-slate-400">› tools › {selectedTool.slug}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                          {toolEditForm.seoTitle || `${selectedTool.name} - Free Online Tool`}
                        </h3>
                        <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                          {toolEditForm.seoDescription || selectedTool.description}
                        </p>
                      </div>

                      {/* SEO Checklist & Word Count */}
                      <div className="pt-4 border-t border-slate-800 space-y-3">
                        <h5 className="text-xs font-bold text-white">Content Density Analysis</h5>

                        {(() => {
                          const totalWords = [
                            toolEditForm.shortIntro,
                            toolEditForm.whatIsThis,
                            ...toolEditForm.howToUse,
                            ...toolEditForm.featuresBenefits.map((f) => `${f.title} ${f.desc}`),
                            ...toolEditForm.useCases.map((u) => `${u.title} ${u.scenario}`),
                            ...toolEditForm.faqs.map((faq) => `${faq.question} ${faq.answer}`),
                          ]
                            .join(' ')
                            .split(/\s+/)
                            .filter(Boolean).length;

                          return (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Total Supporting Words:</span>
                                <span
                                  className={`font-mono font-bold ${
                                    totalWords >= 600 ? 'text-emerald-400' : 'text-amber-400'
                                  }`}
                                >
                                  {totalWords} words
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${totalWords >= 600 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                  style={{ width: `${Math.min(100, (totalWords / 800) * 100)}%` }}
                                />
                              </div>
                              <p className="text-[11px] text-slate-500">
                                {totalWords >= 600
                                  ? '✓ Target 600–1,200 words met for competitive search ranking.'
                                  : 'Target ~500–1,000 words for optimal SEO depth.'}
                              </p>
                            </div>
                          );
                        })()}

                        <div className="pt-2 space-y-1 text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Structured Schema.org (WebApplication)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>FAQPage Schema ({toolEditForm.faqs.length} entries)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>HowTo Schema ({toolEditForm.howToUse.length} steps)</span>
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={handleSaveToolContent}
                            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
                          >
                            Save & Publish to Live Site
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedTool(null)}
                            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: BLOG CMS */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          {!selectedBlog && !isCreatingBlog ? (
            /* Blog Posts List */
            <div className="p-6 rounded-2xl bg-[#0D0F13] border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    Blog Articles & Technical Guides CMS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Publish in-depth technical tutorials, architectural whitepapers, and guides that drive organic search traffic.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-full sm:w-64 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={blogSearchFilter}
                      onChange={(e) => setBlogSearchFilter(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full pl-9 pr-3 py-2 bg-[#171A21] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    onClick={() => handleOpenBlogEditor()}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Write New Article</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="py-3 px-3">Title & Slug</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Author</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredBlogs.map((b) => (
                      <tr key={b.slug} className="hover:bg-[#14171F] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white line-clamp-1">{b.title}</div>
                          <div className="font-mono text-[10px] text-slate-500">/blog/{b.slug}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-[10px] font-semibold">
                            {b.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{b.author?.name}</td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                          {b.publishedAt || b.publishDate}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenBlogEditor(b)}
                              className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-xs flex items-center gap-1"
                              title="Edit Article"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/blog/${b.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-[#171A21] text-slate-400 hover:text-white"
                              title="View Live"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteBlogPost(b.slug)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Blog Editor Studio */
            <div className="bg-[#0D0F13] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <button
                    onClick={() => {
                      setSelectedBlog(null);
                      setIsCreatingBlog(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2"
                  >
                    ← Back to Articles List
                  </button>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>{isCreatingBlog ? 'Write New Blog Article' : `Edit Article: ${blogEditForm.title}`}</span>
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateBlogWithAI}
                    disabled={aiGeneratingBlog}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiGeneratingBlog ? 'animate-spin' : ''}`} />
                    <span>{aiGeneratingBlog ? 'Generating Draft...' : 'AI Generate Article Draft'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveBlogPost}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Article</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 cols: Main Editor */}
                <div className="lg:col-span-2 space-y-5">
                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Article Title</label>
                    <input
                      type="text"
                      value={blogEditForm.title}
                      onChange={(e) => handleBlogTitleChange(e.target.value)}
                      placeholder="e.g., The Architecture of Zero-Data-Retention Developer Tools"
                      className="w-full px-4 py-2.5 bg-[#14171F] border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={blogEditForm.slug}
                        onChange={(e) => setBlogEditForm({ ...blogEditForm, slug: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#14171F] border border-slate-700 rounded-xl text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">Category</label>
                      <select
                        value={blogEditForm.category}
                        onChange={(e) => setBlogEditForm({ ...blogEditForm, category: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#14171F] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Developer Guide">Developer Guide</option>
                        <option value="Security & Architecture">Security & Architecture</option>
                        <option value="Performance & Design">Performance & Design</option>
                        <option value="Financial Planning">Financial Planning</option>
                        <option value="AI & Productivity">AI & Productivity</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">
                      Excerpt / Summary (Meta Description)
                    </label>
                    <textarea
                      rows={2}
                      value={blogEditForm.excerpt}
                      onChange={(e) => setBlogEditForm({ ...blogEditForm, excerpt: e.target.value })}
                      placeholder="Brief 2-sentence synopsis for social cards and search engines..."
                      className="w-full px-3.5 py-2 bg-[#14171F] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-300 text-xs font-semibold">
                        Article Content (Multi-paragraph or Markdown)
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {blogEditForm.content.split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <textarea
                      rows={14}
                      value={blogEditForm.content}
                      onChange={(e) => setBlogEditForm({ ...blogEditForm, content: e.target.value })}
                      placeholder="Write your article body here. Separate paragraphs with an empty line (double enter)..."
                      className="w-full px-4 py-3 bg-[#14171F] border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Right col: Author & Metadata */}
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Publishing Details</h4>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">Author Name</label>
                      <input
                        type="text"
                        value={blogEditForm.authorName}
                        onChange={(e) => setBlogEditForm({ ...blogEditForm, authorName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">Author Role / Title</label>
                      <input
                        type="text"
                        value={blogEditForm.authorRole}
                        onChange={(e) => setBlogEditForm({ ...blogEditForm, authorRole: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">Reading Time</label>
                      <input
                        type="text"
                        value={blogEditForm.readTime}
                        onChange={(e) => setBlogEditForm({ ...blogEditForm, readTime: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={blogEditForm.tags}
                        onChange={(e) => setBlogEditForm({ ...blogEditForm, tags: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0D0F13] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Search Snippet Preview */}
                  <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Google SERP Article Snippet
                    </h4>

                    <div className="p-4 rounded-xl bg-white text-slate-900 space-y-1 font-sans text-left shadow-md">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
                        <span className="font-medium">techtools.techusar.com</span>
                        <span className="text-slate-400">› blog › {blogEditForm.slug || 'article-slug'}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                        {blogEditForm.title || 'Sample Technical Guide Title'}
                      </h3>
                      <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                        {blogEditForm.excerpt || 'Read in-depth technical analysis and best practices...'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveBlogPost}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
                    >
                      Publish Article to Live Blog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0D0F13] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Executions</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {metrics?.totalRuns?.toLocaleString() || '14,280'}
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                +18.4% this week
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D0F13] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>AI Queries Generated</span>
                <Cpu className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {metrics?.aiGenerations?.toLocaleString() || '3,840'}
              </div>
              <span className="text-[11px] text-purple-400 font-medium">Gemini 2.5 Flash</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D0F13] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Utilities</span>
                <Database className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{tools.length}</div>
              <span className="text-[11px] text-slate-500 font-medium">Across 6 categories</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D0F13] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Registered Developers</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {metrics?.activeUsers?.toLocaleString() || '1,940'}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">99.98% uptime SLA</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BACKUP */}
      {activeTab === 'backup' && (
        <div className="p-8 rounded-2xl bg-[#0D0F13] border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="text-lg font-bold text-white">Database Snapshot & Data Portability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            TechTools uses a server-side JSON repository architecture. Download complete repository snapshots containing all tools, SEO customizations, and blog posts for offline backup, migrations, or local syncing.
          </p>
          <button
            onClick={handleBackupExport}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Repository JSON Snapshot</span>
          </button>
        </div>
      )}
    </div>
  );
}
