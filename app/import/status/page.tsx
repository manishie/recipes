import { ImportProgress } from '@/components/recipes/ImportProgress';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ImportStatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">Import Status</h1>

      <ImportProgress />
    </div>
  );
}
