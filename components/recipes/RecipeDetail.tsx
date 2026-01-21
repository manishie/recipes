import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, Calendar, User } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface RecipeDetailProps {
  recipe: {
    title: string;
    description?: string | null;
    mainImageUrl?: string | null;
    prepTime?: number | null;
    cookTime?: number | null;
    totalTime?: number | null;
    servings?: number | null;
    yield?: string | null;
    ingredients: any;
    instructions: any;
    notes?: string | null;
    categories?: string[];
    cuisine?: string | null;
    dietary?: string[];
    author?: string | null;
    datePublished?: Date | null;
    siteName?: string | null;
    url: string;
    images?: Array<{
      localPath?: string | null;
      url: string;
      alt?: string | null;
    }>;
    tags?: Array<{
      id: string;
      name: string;
    }>;
  };
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const imageUrl = recipe.images?.[0]?.localPath || recipe.mainImageUrl;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>

        {recipe.description && (
          <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
        )}

        {/* Meta information */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          {recipe.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{recipe.author}</span>
            </div>
          )}
          {recipe.siteName && (
            <div className="flex items-center gap-1">
              <span>from {recipe.siteName}</span>
            </div>
          )}
          {recipe.datePublished && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(recipe.datePublished).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {recipe.categories?.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
          {recipe.dietary?.map((diet) => (
            <Badge key={diet} variant="outline">
              {diet}
            </Badge>
          ))}
          {recipe.tags?.map((tag) => (
            <Badge key={tag.id} variant="default">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Image */}
      {imageUrl && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Time & Servings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
        {recipe.prepTime && (
          <div>
            <div className="text-sm text-gray-600">Prep Time</div>
            <div className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {formatTime(recipe.prepTime)}
            </div>
          </div>
        )}
        {recipe.cookTime && (
          <div>
            <div className="text-sm text-gray-600">Cook Time</div>
            <div className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {formatTime(recipe.cookTime)}
            </div>
          </div>
        )}
        {recipe.totalTime && (
          <div>
            <div className="text-sm text-gray-600">Total Time</div>
            <div className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {formatTime(recipe.totalTime)}
            </div>
          </div>
        )}
        {(recipe.servings || recipe.yield) && (
          <div>
            <div className="text-sm text-gray-600">Servings</div>
            <div className="text-lg font-semibold flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              {recipe.servings || recipe.yield}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {Array.isArray(recipe.ingredients) &&
              recipe.ingredients.map((ingredient: any, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{typeof ingredient === 'string' ? ingredient : ingredient.text || JSON.stringify(ingredient)}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Instructions</h2>
          <ol className="space-y-4">
            {Array.isArray(recipe.instructions) &&
              recipe.instructions.map((instruction: any, index: number) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <span className="flex-1 pt-1">
                    {typeof instruction === 'string' ? instruction : instruction.text || JSON.stringify(instruction)}
                  </span>
                </li>
              ))}
          </ol>
        </div>
      </div>

      {/* Notes */}
      {recipe.notes && (
        <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-gray-700">{recipe.notes}</p>
        </div>
      )}

      {/* Source Link */}
      <div className="mt-8 pt-6 border-t">
        <a
          href={recipe.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Original Recipe →
        </a>
      </div>
    </div>
  );
}
