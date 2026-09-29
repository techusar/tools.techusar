import { NextRequest, NextResponse } from 'next/server';
import { FeedbackRepository } from '@/lib/data/feedback-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { commentId, toolSlug } = body;

    if (!commentId || !toolSlug) {
      return NextResponse.json({ success: false, error: 'commentId and toolSlug are required' }, { status: 400 });
    }

    const result = FeedbackRepository.likeComment(commentId, toolSlug);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to upvote comment' }, { status: 500 });
  }
}
