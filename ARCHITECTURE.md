# Recipe Manager Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User's Browser                       │
│                    (https://your-app.vercel.app)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js Application (Serverless)           │  │
│  │                                                       │  │
│  │  • React Frontend (App Router)                      │  │
│  │  • API Routes (Server-side)                         │  │
│  │  • Recipe Scraper (Cheerio, JSON-LD)               │  │
│  │  • Image Processor (Sharp)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬─────────────────────────┬──────────────────────┘
             │                         │
             │ PostgreSQL              │ HTTP/HTTPS
             │ Connection              │ (Recipe Sites)
             │                         │
┌────────────▼──────────┐  ┌──────────▼──────────────────────┐
│  Supabase Database    │  │     External Recipe Sites       │
│                       │  │                                  │
│  • Recipe Data        │  │  • AllRecipes.com               │
│  • Images Metadata    │  │  • SeriousEats.com              │
│  • Import Jobs        │  │  • NYT Cooking                  │
│  • Tags               │  │  • Food blogs                   │
└───────────────────────┘  └─────────────────────────────────┘
```

## Components

### Frontend (Next.js + React)
- **Homepage**: Recipe grid with search and filters
- **Recipe Detail Page**: Full recipe view
- **Import Pages**: Single and bulk import forms
- **Import Status**: Real-time job tracking

### Backend (Next.js API Routes)
- **Import API**: Scrape and save recipes
- **Recipe CRUD**: Create, read, update, delete
- **Search API**: Full-text search
- **Jobs API**: Import status tracking

### Database (PostgreSQL via Supabase)
```
┌─────────────┐     ┌──────────────┐     ┌──────┐
│   Recipe    │────▶│ RecipeImage  │     │ Tag  │
│             │     │              │     │      │
│ • title     │     │ • url        │     │• name│
│ • url       │     │ • localPath  │     └───┬──┘
│ • content   │     └──────────────┘         │
└──────┬──────┘                              │
       │                                     │
       │            Many-to-Many             │
       └─────────────────────────────────────┘

┌──────────────┐
│  ImportJob   │
│              │
│ • url        │
│ • status     │
│ • recipeId   │
└──────────────┘
```

## Data Flow

### Single Recipe Import

```
1. User pastes URL
   │
   ▼
2. POST /api/recipes/import
   │
   ├──▶ Fetch HTML from URL
   │
   ├──▶ Try JSON-LD parser (Schema.org)
   │    └──▶ If found: Extract recipe data
   │
   ├──▶ Fallback: HTML parser
   │    └──▶ Find recipe using selectors
   │
   ├──▶ Download images
   │    └──▶ Optimize with Sharp
   │    └──▶ Save to /public/uploads
   │
   ├──▶ Save to database
   │    ├──▶ Create Recipe record
   │    └──▶ Create RecipeImage records
   │
   └──▶ Return recipe ID
        │
        ▼
3. Redirect to /recipes/{id}
```

### Bulk Import (Chrome Bookmarks)

```
1. User pastes bookmarks HTML
   │
   ▼
2. POST /api/recipes/import/bulk
   │
   ├──▶ Parse HTML (Cheerio)
   │    └──▶ Extract all URLs
   │
   ├──▶ Create ImportJob records
   │    └──▶ Status: "pending"
   │
   ├──▶ Start background processor
   │    └──▶ Process 3 jobs concurrently
   │         │
   │         ├──▶ For each job:
   │         │    ├──▶ Check if URL exists
   │         │    ├──▶ Scrape recipe
   │         │    ├──▶ Save to database
   │         │    └──▶ Update job status
   │         │
   │         └──▶ Continue until all done
   │
   └──▶ Return job IDs
        │
        ▼
3. User polls /api/recipes/import/jobs
   └──▶ Display real-time progress
```

## Technology Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

### Backend
- **Next.js API Routes**: Serverless functions
- **Prisma**: Database ORM
- **Cheerio**: HTML parsing
- **Axios**: HTTP client
- **Sharp**: Image processing

### Database
- **PostgreSQL**: Relational database
- **Supabase**: Managed PostgreSQL hosting

### Deployment
- **Vercel**: Application hosting
- **Vercel Edge Network**: CDN
- **Supabase**: Database hosting

## Scalability

### Current Architecture (Free Tier)
- **Requests**: Unlimited (Vercel serverless)
- **Database**: 500MB (Supabase)
- **Bandwidth**: 100GB/month (Vercel)
- **Good for**: ~1000-5000 recipes with images

### Upgrade Path
1. **More recipes**: Upgrade Supabase ($25/mo for 8GB)
2. **More traffic**: Vercel Pro ($20/mo for 1TB bandwidth)
3. **Image storage**: Supabase Storage or Vercel Blob
4. **Caching**: Add Redis for faster queries
5. **Search**: Upgrade to full-text search with Meilisearch

## Security

### Current Protections
✅ HTTPS by default (Vercel)
✅ Environment variables (secrets)
✅ SQL injection protection (Prisma)
✅ Input validation (Zod)

### Production Additions
- Rate limiting on API routes
- CORS configuration
- User authentication (NextAuth.js)
- Content Security Policy
- Database row-level security

## Performance

### Optimizations
- **Server-side rendering**: Fast initial page loads
- **Image optimization**: Sharp processing + Next.js Image
- **Database indexing**: Fast queries
- **Edge caching**: Vercel CDN
- **Serverless functions**: Auto-scaling

### Monitoring
- Vercel Analytics (optional)
- Error tracking with Sentry (optional)
- Database monitoring via Supabase dashboard

## Limitations & Considerations

### Image Storage
⚠️ **Local storage on Vercel**: Images stored in `/public/uploads` won't persist across deployments

**Solutions**:
- Use Supabase Storage (recommended)
- Use Vercel Blob Storage
- Use external CDN (Cloudinary, etc.)

### Scraping
⚠️ **Rate limiting**: Some sites may block frequent scraping

**Solutions**:
- Respect robots.txt
- Add delays between requests
- Use rotating user agents (carefully)

### Bulk Import
⚠️ **Timeout limits**: Vercel functions have 10-60s limits

**Current solution**: Process 3 jobs concurrently, continue in background

**Future**: Queue system (Bull, Redis) for better job management

## Future Enhancements

### Phase 2
- [ ] User authentication
- [ ] Meal planning calendar
- [ ] Shopping list generation
- [ ] Recipe scaling

### Phase 3
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Recipe sharing/social features
- [ ] Nutrition calculation

### Phase 4
- [ ] Multi-tenant support
- [ ] Recipe recommendations (AI)
- [ ] OCR for recipe cards
- [ ] Video recipe support

---

## Questions?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment details or [README.md](./README.md) for usage instructions.
