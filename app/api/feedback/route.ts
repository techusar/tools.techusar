import { NextRequest, NextResponse } from 'next/server';
import { FeedbackRepository } from '@/lib/data/feedback-repository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const toolSlug = searchParams.get('toolSlug');
    const userId = searchParams.get('userId') || undefined;

    if (!toolSlug) {
      const allLikes = FeedbackRepository.getAllLikes();
      return NextResponse.json({ success: true, likesMap: allLikes });
    }

    const feedback = FeedbackRepository.getToolFeedback(toolSlug, userId);
    return NextResponse.json({ success: true, ...feedback });
  } catch (err: any) {
    console.error('Feedback GET error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to fetch feedback' }, { status: 500 });
  }
}
