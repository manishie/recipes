import { prisma } from '../prisma';

export type ImportJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ImportJob {
  id: string;
  url: string;
  status: ImportJobStatus;
  errorMessage?: string | null;
  recipeId?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
}

export async function createImportJob(url: string): Promise<ImportJob> {
  return await prisma.importJob.create({
    data: {
      url,
      status: 'pending',
    },
  });
}

export async function createBulkImportJobs(urls: string[]): Promise<ImportJob[]> {
  const jobs = await prisma.importJob.createMany({
    data: urls.map((url) => ({
      url,
      status: 'pending',
    })),
  });

  // Fetch the created jobs
  return await prisma.importJob.findMany({
    where: {
      url: { in: urls },
      status: 'pending',
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: urls.length,
  });
}

export async function updateJobStatus(
  jobId: string,
  status: ImportJobStatus,
  data?: {
    errorMessage?: string;
    recipeId?: string;
  }
): Promise<ImportJob> {
  return await prisma.importJob.update({
    where: { id: jobId },
    data: {
      status,
      errorMessage: data?.errorMessage,
      recipeId: data?.recipeId,
      completedAt: status === 'completed' || status === 'failed' ? new Date() : undefined,
    },
  });
}

export async function getPendingJobs(limit: number = 10): Promise<ImportJob[]> {
  return await prisma.importJob.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}

export async function getAllJobs(): Promise<ImportJob[]> {
  return await prisma.importJob.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getJobById(jobId: string): Promise<ImportJob | null> {
  return await prisma.importJob.findUnique({
    where: { id: jobId },
  });
}

export async function getJobStats() {
  const [pending, processing, completed, failed] = await Promise.all([
    prisma.importJob.count({ where: { status: 'pending' } }),
    prisma.importJob.count({ where: { status: 'processing' } }),
    prisma.importJob.count({ where: { status: 'completed' } }),
    prisma.importJob.count({ where: { status: 'failed' } }),
  ]);

  return { pending, processing, completed, failed };
}
