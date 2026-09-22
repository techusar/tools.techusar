import { NextRequest, NextResponse } from 'next/server';
import { NeonUserRepository } from '@/lib/db/neon';
import { AnalyticsRepository } from '@/lib/data/analytics-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, anonymousId } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const result = await NeonUserRepository.login(email, password);
    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error || 'Invalid credentials' }, { status: 401 });
    }

    AnalyticsRepository.logEvent({
      event: 'login',
      userId: result.user.id,
      anonymousId: anonymousId || 'anon',
    });

    const safeUser = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      favorites: result.user.favorites || [],
      createdAt: result.user.createdAt,
      toolsUsedCount: result.user.toolsUsedCount || 0,
      aiGenerationsCount: result.user.aiGenerationsCount || 0,
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Login failed' }, { status: 500 });
  }
}
