import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, Zap, Shield, ArrowRight, Brain, Code, FileText, CheckCircle2 } from 'lucide-react';
import { getAllTools } from '@/lib/data/toolsRepository';
import { ToolCard } from '@/components/tools/ToolCard';
import { AIToolsPageClient } from '@/components/tools/AIToolsPageClient';

export const metadata: Metadata = {
  title: 'AI-Powered Developer & Content Tools - Powered by Gemini AI',
  description:
    'Instant SQL generation, text summarization, content rewriting, regex creation, and code debugging powered by Google Gemini 2.5 Flash.',
};

export default async function AIToolsPage() {
  const allTools = await getAllTools();
  const aiTools = allTools.filter((t) => t.type === 'ai' || t.category === 'ai-tools');

  return <AIToolsPageClient aiTools={aiTools} />;
}
