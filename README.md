# Recipe Manager

A Next.js web application for saving and managing cooking recipes from online sources. Import recipes from URLs, preserve content locally (text and images), and never lose access to your favorite recipes even if the original sites go offline.

## Features

- **Single Recipe Import**: Import recipes from URLs with automatic scraping
- **Bulk Import**: Import multiple recipes from Chrome bookmarks HTML export
- **Smart Scraping**: Uses JSON-LD (Schema.org) with HTML fallback for maximum compatibility
- **Local Storage**: All recipe content and images are stored locally
- **Search & Filter**: Find recipes by title, description, categories, and more
- **Progress Tracking**: Real-time import job status monitoring
- **Image Optimization**: Automatic image processing and optimization

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Scraping**: Cheerio for HTML parsing, JSON-LD for structured data
- **Image Processing**: Sharp for optimization

## 🚀 Quick Deploy to Vercel (15 minutes)

Want to get this running live on the internet?

**[👉 Follow the Quick Deploy Guide](./QUICKSTART-DEPLOY.md)**

This guide will walk you through:
1. Setting up a free Supabase database (5 min)
2. Deploying to Vercel (5 min)
3. Running database migrations (3 min)
4. Testing your live app (2 min)

For detailed deployment options and troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your database:

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/recipes?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Run database migrations:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Importing a Single Recipe

1. Click "Import Recipe" in the header
2. Select the "Single Import" tab
3. Paste a recipe URL
4. Click "Import Recipe"
5. The recipe will be scraped and saved to your database

### Bulk Import from Chrome Bookmarks

1. Export your bookmarks from Chrome:
   - Open Chrome
   - Go to Bookmarks → Bookmark Manager (Ctrl/Cmd+Shift+O)
   - Click the ⋮ menu → Export bookmarks
   - Save the HTML file

2. In the Recipe Manager:
   - Click "Import Recipe"
   - Select the "Bulk Import" tab
   - Open the exported HTML file in a text editor
   - Copy all the HTML content
   - Paste it into the textarea
   - Click "Start Bulk Import"

3. Monitor progress:
   - Click "Import Status" in the header
   - View real-time progress of all import jobs
   - Failed imports will show error messages

### Viewing Recipes

- Browse all recipes on the homepage
- Click any recipe card to view full details
- See ingredients, instructions, cooking times, and more

## Database Schema

The application uses the following main models:

- **Recipe**: Stores recipe data (title, ingredients, instructions, images, etc.)
- **RecipeImage**: Stores image URLs and local file paths
- **Tag**: Custom tags for organizing recipes
- **ImportJob**: Tracks bulk import progress

## API Endpoints

- `POST /api/recipes/import` - Import single recipe from URL
- `POST /api/recipes/import/bulk` - Start bulk import from bookmarks
- `GET /api/recipes/import/jobs` - Get import job status
- `GET /api/recipes` - List all recipes (with pagination)
- `GET /api/recipes/:id` - Get single recipe
- `PATCH /api/recipes/:id` - Update recipe (rating, tags, notes)
- `DELETE /api/recipes/:id` - Delete recipe
- `GET /api/recipes/search` - Search recipes
- `GET /api/tags` - List all tags

## Deployment

### Vercel + Supabase (Recommended)

1. Create a Supabase project:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy the PostgreSQL connection string

2. Deploy to Vercel:
   - Push your code to GitHub
   - Import the repository in Vercel
   - Add environment variables:
     - `DATABASE_URL`: Your Supabase connection string
     - `NEXT_PUBLIC_APP_URL`: Your Vercel URL

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Alternative: Railway

1. Create a Railway project
2. Add PostgreSQL service
3. Add Next.js service (connect to GitHub)
4. Railway auto-provides `DATABASE_URL`
5. Deploy

## Troubleshooting

### Recipe Import Fails

- Ensure the URL is accessible and contains recipe data
- Check that the site uses Schema.org JSON-LD or standard HTML markup
- Some sites may block automated scraping

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings for remote databases

### Images Not Loading

- Check that the `public/uploads` directory exists
- Verify Sharp is installed correctly
- Ensure sufficient disk space

## Future Enhancements

- Recipe scaling (adjust servings)
- Shopping list generation
- Meal planning calendar
- Browser extension for one-click save
- Nutrition calculation
- Multi-user support with authentication
- Export recipes to PDF

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
