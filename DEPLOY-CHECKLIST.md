# Deployment Checklist

Use this checklist to ensure smooth deployment to Vercel + Supabase.

## Pre-Deployment

- [ ] Code is committed to git
- [ ] All tests pass locally (if applicable)
- [ ] `.env.example` is up to date
- [ ] README.md is complete

## Supabase Setup

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Saved database password securely
- [ ] Copied connection string (URI format)
- [ ] Replaced `[YOUR-PASSWORD]` in connection string
- [ ] Tested connection locally (optional)

## GitHub Setup

- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
  ```bash
  git remote add origin https://github.com/YOUR-USERNAME/recipe-manager.git
  git push -u origin main
  ```

## Vercel Setup

- [ ] Created Vercel account
- [ ] Imported GitHub repository
- [ ] Added `DATABASE_URL` environment variable
- [ ] Added `NEXT_PUBLIC_APP_URL` (can be empty initially)
- [ ] Clicked "Deploy"
- [ ] Deployment completed successfully
- [ ] Copied Vercel deployment URL

## Database Migration

Choose ONE method:

### Method A: Vercel CLI
- [ ] Installed Vercel CLI: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Linked project: `vercel link`
- [ ] Pulled env vars: `vercel env pull .env.production`
- [ ] Deployed migrations: `npm run vercel:deploy-db`
- [ ] Verified tables created (check Supabase dashboard)

### Method B: Local Script
- [ ] Created `.env.production` with `DATABASE_URL`
- [ ] Ran deploy script: `./scripts/deploy-db.sh`
- [ ] Verified tables created (check Supabase dashboard)

## Post-Deployment Configuration

- [ ] Updated `NEXT_PUBLIC_APP_URL` in Vercel with actual URL
- [ ] Triggered redeploy from Vercel dashboard
- [ ] Waited for redeploy to complete

## Testing

- [ ] Visited deployment URL
- [ ] Homepage loads correctly
- [ ] Tested single recipe import
  - [ ] Entered recipe URL
  - [ ] Import completed successfully
  - [ ] Recipe displays correctly
  - [ ] Images load (may not persist on redeploy - this is expected)
- [ ] Tested bulk import
  - [ ] Pasted Chrome bookmarks HTML
  - [ ] Import jobs created
  - [ ] Checked import status page
  - [ ] Jobs processed successfully
- [ ] Tested recipe search (if recipes exist)
- [ ] Tested navigation (all links work)
- [ ] Checked mobile responsiveness (optional)

## Troubleshooting (If Needed)

- [ ] Checked Vercel deployment logs
- [ ] Checked Vercel runtime logs
- [ ] Verified environment variables are correct
- [ ] Confirmed database connection from Vercel
- [ ] Redeployed if needed

## Optional Enhancements

- [ ] Added custom domain in Vercel
- [ ] Set up Supabase Storage for images (recommended for production)
- [ ] Enabled Vercel Analytics
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Added authentication (NextAuth.js)
- [ ] Set up automated database backups

## Maintenance

- [ ] Documented deployment process for team
- [ ] Saved environment variables securely
- [ ] Set up monitoring alerts (optional)
- [ ] Scheduled regular backups (optional)

## Success! 🎉

Your Recipe Manager is now live! Share the URL:

**Your App**: `https://your-app-name.vercel.app`

---

## Quick Reference

### Update Deployment
```bash
git add .
git commit -m "Your update message"
git push
# Vercel auto-deploys
```

### View Logs
- Vercel Dashboard → Your Project → Deployments → Click latest → Runtime Logs

### Access Database
```bash
DATABASE_URL="your-supabase-url" npm run db:studio
```

### Run Migration After Schema Change
```bash
# Local
npm run db:migrate

# Production
npm run vercel:deploy-db
```

### Check Environment Variables
- Vercel Dashboard → Your Project → Settings → Environment Variables

---

## Support

If you encounter issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review Vercel logs
3. Verify Supabase connection
4. Open an issue on GitHub

## Done?

**Share your deployment!** Tweet your Recipe Manager app with #RecipeManager 🎉
