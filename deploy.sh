#!/bin/bash

# CoachGG Production Deployment Script
# This script helps deploy CoachGG to Vercel with proper configuration

echo "🚀 CoachGG Production Deployment Script"
echo "========================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "❌ Please run this script from the CoachGG root directory"
    exit 1
fi

echo "✅ Environment check passed"

# Test build locally first
echo "🔨 Testing local build..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed. Please fix errors before deploying."
    exit 1
fi
cd ..

echo "✅ Local build successful"

# Check for required environment variables
echo "🔍 Environment variables needed..."

required_vars=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY" 
    "VITE_OPENROUTER_API_KEY"
    "SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
    "JWT_SECRET"
)

echo "📝 Required environment variables for Vercel:"
for var in "${required_vars[@]}"; do
    echo "   - $var"
done

echo ""
echo "💡 Using your EXISTING Supabase database - no need to create a new one!"
echo "   Just use your current Supabase URL and keys"
echo ""
echo "⚠️  Make sure these are set in your Vercel dashboard:"
echo "   Vercel Dashboard → Your Project → Settings → Environment Variables"
echo ""

read -p "Have you set all environment variables in Vercel? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please set environment variables first, then run this script again."
    echo "💡 Use your existing Supabase credentials - no new database needed!"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# Login to Vercel (if not already logged in)
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Deploy
echo "📦 Starting deployment..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "   1. Test user registration/login"
    echo "   2. Try adding a match"
    echo "   3. Test team creation"
    echo "   4. Verify AI Coach works"
    echo "   5. Test file uploads"
    echo "   6. Check advanced charts"
    echo ""
    echo "📊 Monitor your deployment:"
    echo "   - Vercel Dashboard: https://vercel.com/dashboard"
    echo "   - Supabase Dashboard: https://supabase.com/dashboard"
    echo ""
    echo "🎮 Your CoachGG app is now live!"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi