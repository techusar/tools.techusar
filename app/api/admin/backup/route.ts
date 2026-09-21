import { NextRequest, NextResponse } from 'next/server';
import { BackupRepository } from '@/lib/data/backup-repository';

export async function GET() {
  try {
    const backup = BackupRepository.exportFullBackup();
    return NextResponse.json(backup);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Export failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = BackupRepository.restoreBackup(body);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: result.message });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Restore failed' }, { status: 500 });
  }
}
