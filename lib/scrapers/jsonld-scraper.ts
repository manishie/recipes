import * as cheerio from 'cheerio';
import { RecipeData } from '../validation/recipe-schema';

interface JsonLdRecipe {
  '@type'?: string | string[];
  name?: string;
  description?: string;
  image?: string | string[] | { url: string }[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string | number;
  recipeIngredient?: string[];
  recipeInstructions?: any[];
  recipeCuisine?: string;
  recipeCategory?: string | string[];
  keywords?: string;
  author?: { name: string } | string;
  datePublished?: string;
  nutrition?: any;
}

function parseISODuration(duration: string): number {
  // Parse ISO 8601 duration format (PT1H30M)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  return hours * 60 + minutes;
}

function normalizeInstructions(instructions: any[]): any[] {
  if (!instructions) return [];

  return instructions.map((step, index) => {
    if (typeof step === 'string') {
      return { text: step, order: index + 1 };
    }
    if (step['@type'] === 'HowToStep' || step.type === 'HowToStep') {
      return {
        text: step.text || step.name || '',
        order: index + 1,
      };
    }
    if (step['@type'] === 'HowToSection' || step.type === 'HowToSection') {
      return {
        name: step.name || '',
        steps: step.itemListElement?.map((s: any, i: number) => ({
          text: s.text || '',
          order: i + 1,
        })) || [],
        order: index + 1,
      };
    }
    return { text: String(step), order: index + 1 };
  });
}

function normalizeImages(image: any): { url: string; alt?: string }[] {
  if (!image) return [];

  const images = Array.isArray(image) ? image : [image];
  return images.map((img) => {
    if (typeof img === 'string') {
      return { url: img };
    }
    if (img.url) {
      return { url: img.url, alt: img.caption };
    }
    return { url: String(img) };
  });
}

export async function scrapeJsonLd(html: string, url: string): Promise<RecipeData | null> {
  const $ = cheerio.load(html);

  // Find all JSON-LD scripts
  const jsonLdScripts = $('script[type="application/ld+json"]');

  let recipeData: JsonLdRecipe | null = null;

  jsonLdScripts.each((_, element) => {
    try {
      const content = $(element).html();
      if (!content) return;

      const json = JSON.parse(content);

      // Handle @graph array (multiple items)
      if (json['@graph']) {
        const recipe = json['@graph'].find((item: any) => {
          const type = item['@type'];
          return type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'));
        });
        if (recipe) {
          recipeData = recipe;
          return false; // break
        }
      }

      // Handle single recipe
      const type = json['@type'];
      if (type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'))) {
        recipeData = json;
        return false; // break
      }
    } catch (error) {
      // Skip invalid JSON
    }
  });

  if (!recipeData) return null;

  // Extract page title as fallback
  const pageTitle = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
  const siteName = $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname;

  // Parse the recipe data
  const images = normalizeImages(recipeData.image);
  const categories = Array.isArray(recipeData.recipeCategory)
    ? recipeData.recipeCategory
    : recipeData.recipeCategory
      ? [recipeData.recipeCategory]
      : [];

  const keywords = recipeData.keywords?.split(',').map(k => k.trim()) || [];
  const dietary = keywords.filter(k =>
    k.toLowerCase().includes('vegetarian') ||
    k.toLowerCase().includes('vegan') ||
    k.toLowerCase().includes('gluten-free') ||
    k.toLowerCase().includes('dairy-free')
  );

  return {
    title: recipeData.name || pageTitle,
    description: recipeData.description,
    url,

    prepTime: recipeData.prepTime ? parseISODuration(recipeData.prepTime) : undefined,
    cookTime: recipeData.cookTime ? parseISODuration(recipeData.cookTime) : undefined,
    totalTime: recipeData.totalTime ? parseISODuration(recipeData.totalTime) : undefined,
    servings: typeof recipeData.recipeYield === 'number' ? recipeData.recipeYield : undefined,
    yield: String(recipeData.recipeYield || ''),

    ingredients: recipeData.recipeIngredient || [],
    instructions: normalizeInstructions(recipeData.recipeInstructions || []),

    images,
    mainImageUrl: images[0]?.url,

    categories,
    cuisine: recipeData.recipeCuisine,
    dietary,

    siteName,
    author: typeof recipeData.author === 'string' ? recipeData.author : recipeData.author?.name,
    datePublished: recipeData.datePublished,

    rawData: recipeData,
  };
}
