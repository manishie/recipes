import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description?: string | null;
    mainImageUrl?: string | null;
    totalTime?: number | null;
    servings?: number | null;
    categories?: string[];
    images?: Array<{
      localPath?: string | null;
      url: string;
    }>;
  };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const imageUrl = recipe.images?.[0]?.localPath || recipe.mainImageUrl;

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-2 text-lg">{recipe.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {recipe.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {recipe.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {recipe.totalTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(recipe.totalTime)}</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>

          {recipe.categories && recipe.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
