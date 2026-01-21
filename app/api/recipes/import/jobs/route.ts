import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, getJobStats } from '@/lib/import/job-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statsOnly = searchParams.get('stats') === 'true';

    if (statsOnly) {
      const stats = await getJobStats();
      return NextResponse.json({ success: true, stats });
    }

    const jobs = await getAllJobs();

    return NextResponse.json({
      success: true,
      jobs,
    });
  } catch (error: any) {
    console.error('Get jobs error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
