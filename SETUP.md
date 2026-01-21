# Quick Setup Guide

## Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- PostgreSQL database (you can use a local instance or a hosted service like Supabase)

## Step 1: Install Dependencies

All dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Step 2: Configure Database

1. Create a `.env` file in the project root (a template `.env.example` is provided)

2. Add your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/recipes?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/recipes?schema=public"
```

### Option B: Supabase (Free Tier)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Project Settings → Database
4. Copy the "Connection string" (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password
6. Use this as your `DATABASE_URL`

## Step 3: Run Database Migrations

Create the database tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all necessary tables (Recipe, RecipeImage, Tag, ImportJob)
- Generate the Prisma client

## Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## First Time Usage

1. Open http://localhost:3000
2. Click "Import Recipe" to add your first recipe
3. Try the single import with a recipe URL like:
   - https://www.allrecipes.com/recipe/...
   - https://www.seriouseats.com/...
   - Any recipe site that uses Schema.org markup

## Bulk Import from Chrome Bookmarks

1. In Chrome, go to: Bookmarks → Bookmark Manager (Ctrl/Cmd+Shift+O)
2. Click the ⋮ menu → "Export bookmarks"
3. Save the HTML file
4. In Recipe Manager, click "Import Recipe" → "Bulk Import" tab
5. Open the HTML file in a text editor, copy all content
6. Paste into the textarea and click "Start Bulk Import"
7. Monitor progress at "Import Status"

## Troubleshooting

### "Error connecting to database"

- Verify your `DATABASE_URL` is correct
- Make sure PostgreSQL is running
- Test the connection: `npx prisma db pull`

### "Module not found" errors

Run:
```bash
npm install
npx prisma generate
```

### Images not displaying

- Check that `public/uploads` directory exists
- Verify Sharp is installed: `npm install sharp`

### Import fails for specific sites

- Some sites may block automated scraping
- Try a different recipe from a site that uses Schema.org markup
- Check browser console and server logs for errors

## Database Management

### View database in Prisma Studio

```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 to browse and edit data.

### Reset database (WARNING: deletes all data)

```bash
npx prisma migrate reset
```

### Create a new migration after schema changes

```bash
npx prisma migrate dev --name description_of_change
```

## Production Deployment

See README.md for deployment instructions to Vercel + Supabase or Railway.

## Need Help?

Check the main README.md for more detailed documentation and troubleshooting.
