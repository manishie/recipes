import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),

  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  totalTime: z.number().optional(),
  servings: z.number().optional(),
  yield: z.string().optional(),

  ingredients: z.array(z.any()),
  instructions: z.array(z.any()),
  notes: z.string().optional(),

  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
  })).optional(),
  mainImageUrl: z.string().optional(),

  categories: z.array(z.string()).optional(),
  cuisine: z.string().optional(),
  dietary: z.array(z.string()).optional(),

  siteName: z.string().optional(),
  author: z.string().optional(),
  datePublished: z.string().optional(),

  rawData: z.any().optional(),
});

export type RecipeData = z.infer<typeof recipeSchema>;
