import * as cheerio from 'cheerio';
import { RecipeData } from '../validation/recipe-schema';

export async function scrapeHtml(html: string, url: string): Promise<RecipeData | null> {
  const $ = cheerio.load(html);

  // Extract basic meta information
  const title =
    $('h1').first().text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    $('title').text().trim();

  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';

  const siteName =
    $('meta[property="og:site_name"]').attr('content') ||
    new URL(url).hostname;

  // Try to find ingredients
  const ingredients: string[] = [];

  // Common ingredient selectors
  $(
    '.ingredient, .recipe-ingredient, [class*="ingredient"], ' +
    '[itemprop="recipeIngredient"], [itemprop="ingredients"]'
  ).each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 0) {
      ingredients.push(text);
    }
  });

  // If no ingredients found, try list items within ingredient sections
  if (ingredients.length === 0) {
    $('[class*="ingredient"] li, [id*="ingredient"] li').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 0) {
        ingredients.push(text);
      }
    });
  }

  // Try to find instructions
  const instructions: any[] = [];

  // Common instruction selectors
  $(
    '.instruction, .recipe-instruction, [class*="instruction"], ' +
    '[class*="direction"], [itemprop="recipeInstructions"]'
  ).each((index, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 0) {
      instructions.push({ text, order: index + 1 });
    }
  });

  // If no instructions found, try ordered list
  if (instructions.length === 0) {
    $('[class*="instruction"] li, [id*="instruction"] li, [class*="direction"] li, [id*="direction"] li').each((index, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 0) {
        instructions.push({ text, order: index + 1 });
      }
    });
  }

  // Try to find images
  const images: { url: string; alt?: string }[] = [];

  // Look for images with recipe-related attributes
  $(
    'img[class*="recipe"], img[id*="recipe"], ' +
    '[itemprop="image"] img, img[class*="featured"]'
  ).each((_, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt');
    if (src && !src.includes('logo') && !src.includes('icon')) {
      images.push({ url: src, alt });
    }
  });

  // Fallback to og:image
  if (images.length === 0) {
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      images.push({ url: ogImage });
    }
  }

  // Extract time information if available
  const prepTimeEl = $('[itemprop="prepTime"]').attr('datetime') ||
                     $('[class*="prep-time"], [id*="prep-time"]').first().text();
  const cookTimeEl = $('[itemprop="cookTime"]').attr('datetime') ||
                     $('[class*="cook-time"], [id*="cook-time"]').first().text();

  // Basic validation - we need at least title and some content
  if (!title || (ingredients.length === 0 && instructions.length === 0)) {
    return null;
  }

  return {
    title,
    description,
    url,

    ingredients,
    instructions,

    images,
    mainImageUrl: images[0]?.url,

    siteName,

    rawData: {
      method: 'html-fallback',
      html: html.substring(0, 1000), // Store first 1000 chars for debugging
    },
  };
}
