# Deployment Guide: Vercel + Supabase

This guide will help you deploy your Recipe Manager app to Vercel (free) with a Supabase PostgreSQL database (also free).

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Supabase account (sign up at https://supabase.com)

## Step 1: Set Up Supabase Database (5 minutes)

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the details:
   - Name: `recipe-manager` (or any name)
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to you
   - Click "Create new project"

4. Wait for the project to be created (takes ~2 minutes)

5. Get your database connection string:
   - Go to Project Settings (gear icon) → Database
   - Scroll down to "Connection string"
   - Select "URI" tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with the password you created
   - This is your `DATABASE_URL`

Example:
```
postgresql://postgres.xxxxx:YourPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Step 2: Push Code to GitHub

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Recipe Manager"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it `recipe-manager`
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. Push your code:
```bash
git remote add origin https://github.com/YOUR-USERNAME/recipe-manager.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel (5 minutes)

1. Go to https://vercel.com and sign in

2. Click "Add New..." → "Project"

3. Import your GitHub repository:
   - Find `recipe-manager` in the list
   - Click "Import"

4. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `prisma generate && next build` (will use vercel.json)
   - **Install Command**: `npm install` (default)

5. Add Environment Variables:
   Click "Environment Variables" and add:

   **Key**: `DATABASE_URL`
   **Value**: Your Supabase connection string from Step 1

   **Key**: `NEXT_PUBLIC_APP_URL`
   **Value**: Leave empty for now (we'll update after deployment)

6. Click "Deploy"

7. Wait for deployment (~2-3 minutes)

## Step 4: Run Database Migrations

After your first deployment, you need to create the database tables.

### Option A: Use Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link your project:
```bash
vercel link
```

4. Pull environment variables:
```bash
vercel env pull .env.production
```

5. Run migration:
```bash
npx prisma migrate deploy --env-file=.env.production
```

### Option B: Run Locally with Production Database

1. Create a `.env.production` file:
```env
DATABASE_URL="your-supabase-connection-string-here"
```

2. Run migration:
```bash
npx prisma migrate deploy
```

## Step 5: Update App URL

1. After deployment, Vercel will give you a URL like:
   ```
   https://recipe-manager-xxxx.vercel.app
   ```

2. Go to your Vercel project → Settings → Environment Variables

3. Update `NEXT_PUBLIC_APP_URL`:
   - Edit the variable
   - Set value to your Vercel URL (e.g., `https://recipe-manager-xxxx.vercel.app`)
   - Save

4. Redeploy:
   - Go to Deployments tab
   - Click "..." on the latest deployment → "Redeploy"

## Step 6: Test Your Deployment

1. Visit your Vercel URL

2. Try importing a recipe:
   - Click "Import Recipe"
   - Paste a recipe URL (try AllRecipes or Serious Eats)
   - Click "Import Recipe"
   - Should redirect to the recipe page

3. Test bulk import:
   - Export Chrome bookmarks
   - Go to Import → Bulk Import tab
   - Paste bookmarks HTML
   - Start import
   - Check Import Status page

## Troubleshooting

### "Error connecting to database"

**Problem**: Database connection failing

**Solution**:
1. Check your `DATABASE_URL` in Vercel environment variables
2. Make sure you replaced `[YOUR-PASSWORD]` with your actual password
3. Try using the "Session pooler" connection string from Supabase instead of "Transaction pooler"

### "Prisma Client not initialized"

**Problem**: Database tables don't exist

**Solution**: Run the migration (Step 4)

### "Module not found" errors

**Problem**: Dependencies not installed correctly

**Solution**:
1. Go to Vercel project → Settings → General
2. Scroll to "Build & Development Settings"
3. Make sure "Install Command" is `npm install`
4. Redeploy

### Images not loading

**Problem**: Images stored locally aren't persisting on Vercel

**Solution**: This is expected with serverless. For production, you should:
1. Use Vercel Blob Storage (paid) or
2. Use Supabase Storage (free tier available):
   - Go to Supabase project → Storage
   - Create a bucket called "recipe-images"
   - Update image downloader to use Supabase Storage

**Quick fix for testing**: Images will work but won't persist between deployments. For a real deployment, implement Supabase Storage.

## Updating Your Deployment

Every time you push to GitHub, Vercel will automatically redeploy.

```bash
git add .
git commit -m "Update: description of changes"
git push
```

Vercel will automatically:
1. Pull the changes
2. Build the project
3. Deploy the new version

## Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to update DNS

## Monitoring

- **Vercel Dashboard**: View deployment logs, analytics
- **Supabase Dashboard**: Monitor database usage, run queries
- **Prisma Studio**: Connect remotely to view/edit data:
  ```bash
  DATABASE_URL="your-supabase-url" npx prisma studio
  ```

## Cost Estimate

- **Vercel Free Tier**:
  - 100GB bandwidth/month
  - Unlimited projects
  - Automatic HTTPS

- **Supabase Free Tier**:
  - 500MB database storage
  - 1GB file storage
  - 2GB bandwidth

This should be plenty for personal use!

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs

## Next Steps for Production

For a production-ready deployment, consider:

1. **Image Storage**: Implement Supabase Storage or Vercel Blob
2. **Error Monitoring**: Add Sentry or similar
3. **Analytics**: Add Vercel Analytics
4. **Rate Limiting**: Protect API endpoints
5. **Authentication**: Add user accounts with NextAuth.js
6. **Backup**: Set up automated database backups
