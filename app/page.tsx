import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getRecipes() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export default async function Home() {
  const recipes = await getRecipes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Recipes</h1>
          <p className="text-gray-600">
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        </div>

        <Link href="/recipes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No recipes yet</h2>
          <p className="text-gray-600 mb-6">
            Start building your recipe collection by importing your first recipe
          </p>
          <Link href="/recipes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Import Your First Recipe
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
