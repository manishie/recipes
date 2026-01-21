import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  isFavorite: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        tags: true,
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      recipe,
    });
  } catch (error: any) {
    console.error('Get recipe error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    // Handle tags separately
    const { tags, ...recipeData } = data;

    let tagConnect: any = undefined;

    if (tags) {
      // Create tags that don't exist and get all tag IDs
      const tagRecords = await Promise.all(
        tags.map((tagName) =>
          prisma.tag.upsert({
            where: { name: tagName },
            create: { name: tagName },
            update: {},
          })
        )
      );

      tagConnect = {
        set: tagRecords.map((tag) => ({ id: tag.id })),
      };
    }

    const recipe = await prisma.recipe.update({
      where: { id: params.id },
      data: {
        ...recipeData,
        ...(tagConnect && { tags: tagConnect }),
      },
      include: {
        images: true,
        tags: true,
      },
    });

    return NextResponse.json({
      success: true,
      recipe,
    });
  } catch (error: any) {
    console.error('Update recipe error:', error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.recipe.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted',
    });
  } catch (error: any) {
    console.error('Delete recipe error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
