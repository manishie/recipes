import { scrapeRecipe } from '../scrapers';
import { prisma } from '../prisma';
import { updateJobStatus } from './job-manager';

const CONCURRENT_LIMIT = 3; // Process 3 recipes at a time
const RETRY_DELAY = 2000; // 2 second delay between retries

export async function processImportJob(jobId: string): Promise<void> {
  const job = await prisma.importJob.findUnique({
    where: { id: jobId },
  });

  if (!job || job.status !== 'pending') {
    return;
  }

  // Update status to processing
  await updateJobStatus(jobId, 'processing');

  try {
    // Check if recipe already exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { url: job.url },
    });

    if (existingRecipe) {
      // Mark as completed with existing recipe
      await updateJobStatus(jobId, 'completed', {
        recipeId: existingRecipe.id,
      });
      return;
    }

    // Scrape the recipe
    const result = await scrapeRecipe(job.url);

    if (!result.success || !result.data) {
      await updateJobStatus(jobId, 'failed', {
        errorMessage: result.error || 'Failed to scrape recipe',
      });
      return;
    }

    // Create the recipe in the database
    const recipe = await prisma.recipe.create({
      data: {
        url: result.data.url,
        title: result.data.title,
        description: result.data.description || null,
        prepTime: result.data.prepTime || null,
        cookTime: result.data.cookTime || null,
        totalTime: result.data.totalTime || null,
        servings: result.data.servings || null,
        yield: result.data.yield || null,
        ingredients: result.data.ingredients || [],
        instructions: result.data.instructions || [],
        notes: result.data.notes || null,
        mainImageUrl: result.data.mainImageUrl || null,
        categories: result.data.categories || [],
        cuisine: result.data.cuisine || null,
        dietary: result.data.dietary || [],
        siteName: result.data.siteName || null,
        author: result.data.author || null,
        datePublished: result.data.datePublished ? new Date(result.data.datePublished) : null,
        rawData: result.data.rawData || null,
      },
    });

    // Create image records
    if (result.data.downloadedImages && result.data.downloadedImages.length > 0) {
      await prisma.recipeImage.createMany({
        data: result.data.downloadedImages.map((img, index) => ({
          recipeId: recipe.id,
          url: img.originalUrl,
          localPath: img.localPath,
          alt: img.alt || null,
          order: index,
        })),
      });
    }

    // Mark job as completed
    await updateJobStatus(jobId, 'completed', {
      recipeId: recipe.id,
    });
  } catch (error: any) {
    console.error(`Error processing job ${jobId}:`, error);

    await updateJobStatus(jobId, 'failed', {
      errorMessage: error.message || 'Unknown error',
    });
  }
}

export async function processPendingJobs(limit: number = CONCURRENT_LIMIT): Promise<void> {
  const pendingJobs = await prisma.importJob.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });

  if (pendingJobs.length === 0) {
    return;
  }

  // Process jobs concurrently with limit
  await Promise.allSettled(
    pendingJobs.map((job) => processImportJob(job.id))
  );

  // Add a small delay to avoid rate limiting
  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

  // Check if there are more pending jobs
  const remainingJobs = await prisma.importJob.count({
    where: { status: 'pending' },
  });

  if (remainingJobs > 0) {
    // Continue processing
    await processPendingJobs(limit);
  }
}
