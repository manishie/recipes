import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const dietary = searchParams.get('dietary');
    const isFavorite = searchParams.get('favorite') === 'true';

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    if (category) {
      where.categories = { has: category };
    }

    if (dietary) {
      where.dietary = { has: dietary };
    }

    if (isFavorite) {
      where.isFavorite = true;
    }

    // Fetch recipes
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.recipe.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get recipes error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
