'use client';

import { useState } from 'react';
import { RecipeImportForm } from '@/components/recipes/RecipeImportForm';
import { BulkImportForm } from '@/components/recipes/BulkImportForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewRecipePage() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">Import Recipes</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'single'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Single Import
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'bulk'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bulk Import
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'single' && <RecipeImportForm />}
      {activeTab === 'bulk' && <BulkImportForm />}
    </div>
  );
}
