'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

interface ImportJob {
  id: string;
  url: string;
  status: string;
  errorMessage?: string | null;
  recipeId?: string | null;
  createdAt: string;
  completedAt?: string | null;
}

interface ImportStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export function ImportProgress() {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        fetch('/api/recipes/import/jobs'),
        fetch('/api/recipes/import/jobs?stats=true'),
      ]);

      const jobsData = await jobsRes.json();
      const statsData = await statsRes.json();

      if (jobsData.success) {
        setJobs(jobsData.jobs);
      }

      if (statsData.success) {
        setStats(statsData.stats);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Poll every 3 seconds if there are pending or processing jobs
    const interval = setInterval(() => {
      if (stats && (stats.pending > 0 || stats.processing > 0)) {
        fetchJobs();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [stats]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return <Badge variant="outline">Processing</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.processing}</div>
              <div className="text-sm text-gray-600">Processing</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Import Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No import jobs found
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  {getStatusIcon(job.status)}

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{job.url}</div>
                    {job.errorMessage && (
                      <div className="text-xs text-red-600 truncate">
                        {job.errorMessage}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {getStatusBadge(job.status)}
                  </div>

                  {job.recipeId && (
                    <a
                      href={`/recipes/${job.recipeId}`}
                      className="text-sm text-blue-600 hover:underline flex-shrink-0"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
