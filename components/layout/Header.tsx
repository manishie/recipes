import Link from 'next/link';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <ChefHat className="h-6 w-6" />
            Recipe Manager
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Recipes</Button>
            </Link>
            <Link href="/recipes/new">
              <Button variant="outline">Import Recipe</Button>
            </Link>
            <Link href="/import/status">
              <Button variant="ghost">Import Status</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
