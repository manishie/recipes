'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BulkImportForm() {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ count: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('/api/recipes/import/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to start bulk import');
        setLoading(false);
        return;
      }

      setSuccess({ count: data.count });
      setHtml('');
      setLoading(false);
    } catch (err) {
      setError('An error occurred while starting bulk import');
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import from Chrome Bookmarks</CardTitle>
        <CardDescription>
          Export your bookmarks from Chrome (Bookmarks → Bookmark Manager → ⋮ → Export bookmarks) and paste the HTML content here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Paste Chrome bookmarks HTML here..."
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              required
              disabled={loading}
              className="min-h-[200px] font-mono text-xs"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
              Successfully created {success.count} import jobs! They will be processed in the background.
              You can check the progress on the import status page.
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !html}>
              {loading ? 'Starting Import...' : 'Start Bulk Import'}
            </Button>

            {success && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.href = '/import/status'}
              >
                View Import Status
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
