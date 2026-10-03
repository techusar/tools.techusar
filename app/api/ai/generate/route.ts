import { NextRequest, NextResponse } from 'next/server';
import { generateAIText } from '@/lib/ai/gemini';
import { AnalyticsRepository } from '@/lib/data/analytics-repository';
import { UsageRepository } from '@/lib/data/usage-repository';
import { ToolRepository } from '@/lib/data/tool-repository';
import { UserRepository } from '@/lib/data/user-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, toolSlug, anonymousId, userId, systemPrompt, temperature, model } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt cannot be empty' }, { status: 400 });
    }

    const identifier = userId || anonymousId || `anon-${Date.now()}`;
    const tool = toolSlug ? ToolRepository.getBySlug(toolSlug) : undefined;
    const isMasterAdmin = userId === 'admin-techusar-01' || (typeof userId === 'string' && userId.includes('admin'));

    // Check usage limits if tool is specified
    if (tool && !tool.unlimited && !isMasterAdmin) {
      const isAuth = Boolean(userId);
      const limitCheck = UsageRepository.checkLimitExceeded(identifier, tool, isAuth);
      if (limitCheck.exceeded) {
        AnalyticsRepository.logEvent({
          event: 'limit_reached',
          toolSlug: tool.slug,
          toolName: tool.name,
          category: tool.category,
          userId,
          anonymousId: anonymousId || 'anon',
          metadata: { limit: limitCheck.limit, current: limitCheck.current },
        });

        return NextResponse.json(
          {
            error: 'USAGE_LIMIT_REACHED',
            message: `You have reached your limit of ${limitCheck.limit} uses for this AI tool.`,
            limit: limitCheck.limit,
            current: limitCheck.current,
          },
          { status: 429 }
        );
      }
    }

    // Call server-side Gemini service
    const aiResult = await generateAIText(prompt, {
      systemPrompt: systemPrompt || tool?.aiConfig?.systemPrompt,
      temperature: temperature ?? tool?.aiConfig?.temperature ?? 0.3,
      model: model || tool?.aiConfig?.model || 'gemini-3.8-flash',
    });

    // Record usage and analytics
    if (tool) {
      UsageRepository.incrementUsage(identifier, tool.slug);
    }
    if (userId) {
      UserRepository.incrementUsageStats(userId, true);
    }

    AnalyticsRepository.logEvent({
      event: 'ai_generation',
      toolSlug: tool?.slug || 'ai-custom',
      toolName: tool?.name || 'Custom AI Generation',
      category: tool?.category || 'ai-tools',
      userId,
      anonymousId: anonymousId || 'anon',
      metadata: { isSimulated: Boolean(aiResult.isSimulated) },
    });

    return NextResponse.json({
      text: aiResult.text,
      isSimulated: aiResult.isSimulated || false,
    });
  } catch (err: any) {
    console.error('AI Route error:', err);
    return NextResponse.json({ error: 'Failed to process AI request', details: err?.message }, { status: 500 });
  }
}
