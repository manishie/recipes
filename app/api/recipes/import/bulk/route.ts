import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseChromeBookmarks, isValidBookmarksHtml } from '@/lib/parsers/chrome-bookmarks';
import { createBulkImportJobs } from '@/lib/import/job-manager';
import { processPendingJobs } from '@/lib/import/bulk-processor';

const bulkImportSchema = z.object({
  html: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html } = bulkImportSchema.parse(body);

    // Validate that this looks like a bookmarks file
    if (!isValidBookmarksHtml(html)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid bookmarks HTML format',
        },
        { status: 400 }
      );
    }

    // Parse bookmarks to extract URLs
    const bookmarks = parseChromeBookmarks(html);

    if (bookmarks.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No URLs found in bookmarks',
        },
        { status: 400 }
      );
    }

    // Create import jobs for all URLs
    const urls = bookmarks.map((b) => b.url);
    const jobs = await createBulkImportJobs(urls);

    // Start processing jobs in the background (fire and forget)
    // Don't await - let it process asynchronously
    processPendingJobs().catch((error) => {
      console.error('Background processing error:', error);
    });

    return NextResponse.json({
      success: true,
      message: `Created ${jobs.length} import jobs`,
      count: jobs.length,
      jobs: jobs.map((job) => ({
        id: job.id,
        url: job.url,
        status: job.status,
      })),
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
