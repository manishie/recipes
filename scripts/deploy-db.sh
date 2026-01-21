#!/bin/bash

# Database Deployment Script for Vercel
# This script helps deploy your database schema to production

echo "🚀 Recipe Manager - Database Deployment"
echo "========================================"
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found"
    echo ""
    echo "Please create a .env.production file with your production DATABASE_URL"
    echo "You can copy .env.production.example and update it with your Supabase credentials"
    echo ""
    exit 1
fi

echo "📋 Checking Prisma installation..."
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js"
    exit 1
fi

echo "✅ Prisma found"
echo ""

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Deploying database migrations..."
echo "This will create all necessary tables in your production database"
echo ""

# Run migration with production env file
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-)
export DATABASE_URL

npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database deployment successful!"
    echo ""
    echo "Your database is now ready. You can:"
    echo "  1. Visit your Vercel deployment"
    echo "  2. Start importing recipes"
    echo ""
    echo "To view your database, run:"
    echo "  npx prisma studio"
    echo ""
else
    echo ""
    echo "❌ Database deployment failed"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check your DATABASE_URL in .env.production"
    echo "  2. Make sure you replaced [YOUR-PASSWORD] with your actual password"
    echo "  3. Verify your database is accessible"
    echo ""
    exit 1
fi
