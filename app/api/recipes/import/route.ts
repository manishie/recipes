import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scrapeRecipe } from '@/lib/scrapers';
import { prisma } from '@/lib/prisma';

const importSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = importSchema.parse(body);

    // Check if recipe already exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { url },
    });

    if (existingRecipe) {
      return NextResponse.json({
        success: true,
        recipe: existingRecipe,
        message: 'Recipe already exists',
      });
    }

    // Scrape the recipe
    const result = await scrapeRecipe(url);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to scrape recipe',
        },
        { status: 400 }
      );
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
        data: result.data.downloadedImages.map((img: any, index: number) => ({
          recipeId: recipe.id,
          url: img.originalUrl,
          localPath: img.localPath,
          alt: img.alt || null,
          order: index,
        })),
      });
    }

    // Fetch the complete recipe with images
    const completeRecipe = await prisma.recipe.findUnique({
      where: { id: recipe.id },
      include: {
        images: true,
        tags: true,
      },
    });

    return NextResponse.json({
      success: true,
      recipe: completeRecipe,
      method: result.method,
    });
  } catch (error: any) {
    console.error('Import error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
