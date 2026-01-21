import axios from 'axios';
import { scrapeJsonLd } from './jsonld-scraper';
import { scrapeHtml } from './html-scraper';
import { downloadImages } from './image-downloader';
import { RecipeData, recipeSchema } from '../validation/recipe-schema';

export interface ScrapeResult {
  success: boolean;
  data?: RecipeData & { downloadedImages?: any[] };
  error?: string;
  method?: 'jsonld' | 'html';
}

export async function scrapeRecipe(url: string): Promise<ScrapeResult> {
  try {
    // Fetch the HTML content
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RecipeBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const html = response.data;

    // Try JSON-LD first (most reliable)
    let recipeData = await scrapeJsonLd(html, url);
    let method: 'jsonld' | 'html' = 'jsonld';

    // Fallback to HTML scraping
    if (!recipeData) {
      recipeData = await scrapeHtml(html, url);
      method = 'html';
    }

    if (!recipeData) {
      return {
        success: false,
        error: 'Could not extract recipe data from this URL',
      };
    }

    // Validate the data
    const validated = recipeSchema.parse(recipeData);

    // Download and save images
    let downloadedImages: any[] = [];
    if (validated.images && validated.images.length > 0) {
      try {
        downloadedImages = await downloadImages(validated.images);
      } catch (error) {
        console.error('Error downloading images:', error);
      }
    }

    return {
      success: true,
      data: {
        ...validated,
        downloadedImages,
      },
      method,
    };
  } catch (error: any) {
    console.error('Scraping error:', error);

    return {
      success: false,
      error: error.message || 'Unknown error occurred while scraping',
    };
  }
}
