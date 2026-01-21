import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface ImageDownloadResult {
  originalUrl: string;
  localPath: string;
  alt?: string;
}

export async function downloadImage(
  imageUrl: string,
  alt?: string
): Promise<ImageDownloadResult | null> {
  try {
    // Download the image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RecipeBot/1.0)',
      },
    });

    // Generate a unique filename
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
    const filename = `${hash}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Process and optimize the image
    await sharp(response.data)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toFile(filePath);

    return {
      originalUrl: imageUrl,
      localPath: `/uploads/${filename}`,
      alt,
    };
  } catch (error) {
    console.error(`Failed to download image ${imageUrl}:`, error);
    return null;
  }
}

export async function downloadImages(
  images: { url: string; alt?: string }[]
): Promise<ImageDownloadResult[]> {
  const results = await Promise.allSettled(
    images.map((img) => downloadImage(img.url, img.alt))
  );

  return results
    .filter((result): result is PromiseFulfilledResult<ImageDownloadResult | null> =>
      result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value!);
}
