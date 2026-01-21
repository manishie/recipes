# Quick Deploy to Vercel (15 minutes)

The fastest way to get your Recipe Manager live on the internet!

## ⚡ Quick Steps

### 1. Create Supabase Database (5 min)

1. Go to https://supabase.com → Sign up/Login
2. Click **"New Project"**
3. Fill in:
   - Name: `recipe-manager`
   - Password: **Save this password!**
   - Region: Choose closest to you
4. Click **"Create new project"** and wait ~2 minutes

5. **Copy your database URL**:
   - Project Settings (⚙️) → Database → Connection string
   - Select **"URI"** tab
   - Copy the string
   - Replace `[YOUR-PASSWORD]` with your password from step 3

Your URL should look like:
```
postgresql://postgres.abc123:YourPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 2. Push to GitHub (2 min)

```bash
# Initialize git
git init
git add .
git commit -m "Recipe Manager initial commit"

# Create repo on GitHub (https://github.com/new) then:
git remote add origin https://github.com/YOUR-USERNAME/recipe-manager.git
git push -u origin main
```

### 3. Deploy to Vercel (5 min)

1. Go to https://vercel.com → Sign up/Login with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find and **Import** your `recipe-manager` repo
4. Under **"Environment Variables"**, add:

   ```
   DATABASE_URL = paste-your-supabase-url-here
   NEXT_PUBLIC_APP_URL = leave-empty-for-now
   ```

5. Click **"Deploy"** and wait ~2 minutes

### 4. Set Up Database Tables (3 min)

After deployment completes, you need to create the database tables.

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Deploy database
npx prisma migrate deploy
```

**Option B: Using Local Script**

```bash
# Create .env.production file
echo 'DATABASE_URL="your-supabase-url"' > .env.production

# Run deployment script
./scripts/deploy-db.sh
```

### 5. Update App URL (1 min)

1. Copy your Vercel URL (e.g., `https://recipe-manager-abc123.vercel.app`)
2. Go to Vercel project → Settings → Environment Variables
3. Edit `NEXT_PUBLIC_APP_URL` and paste your URL
4. Click Deployments → Click "..." on latest → **"Redeploy"**

## 🎉 Done!

Visit your Vercel URL and start importing recipes!

## 🧪 Test It

1. Click **"Import Recipe"**
2. Try this URL: `https://www.allrecipes.com/recipe/16354/easy-meatloaf/`
3. Should import successfully!

## 📱 Bookmark for Mobile

On your phone:
1. Open your Vercel URL in Safari/Chrome
2. Tap Share → Add to Home Screen
3. Now you have a "native" app!

## ⚠️ Important Notes

### Image Storage

Images are stored locally on Vercel's filesystem, which means:
- ✅ Works perfectly for testing
- ⚠️ Images will be lost on redeployments
- 🔧 For production, use Supabase Storage (see DEPLOYMENT.md)

### Free Tier Limits

- Vercel: 100GB bandwidth/month (plenty!)
- Supabase: 500MB database, 1GB files (great for personal use)

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` in Vercel → Settings → Environment Variables
- Make sure you replaced `[YOUR-PASSWORD]`
- Redeploy after fixing

### "Table does not exist"
- You forgot to run migrations (Step 4)
- Run: `npx prisma migrate deploy`

### "Module not found"
- Redeploy from Vercel dashboard
- Check Vercel logs for specific error

## 🚀 Next Steps

- Import your Chrome bookmarks (bulk import!)
- Customize the app
- Add your own domain
- Share with friends!

## 📚 Full Documentation

For advanced setup, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [README.md](./README.md) - Full documentation
- [SETUP.md](./SETUP.md) - Local development setup

## 💡 Tips

**Auto-deploy**: Every `git push` triggers a new deployment!

```bash
git add .
git commit -m "Added new feature"
git push
# Vercel automatically deploys! ✨
```

**View logs**: Vercel Dashboard → Deployments → Click deployment → Runtime Logs

**Database admin**: `DATABASE_URL="your-url" npx prisma studio`

---

Need help? Open an issue on GitHub!
