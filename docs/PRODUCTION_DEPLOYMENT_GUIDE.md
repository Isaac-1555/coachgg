# 🚀 CoachGG Production Deployment Guide

This guide will walk you through deploying CoachGG to production using Vercel for hosting and Supabase for the database.

## 📋 Prerequisites

Before starting, make sure you have:
- [x] A Vercel account (free tier works)
- [x] A Supabase account (free tier works)
- [x] Git repository with your CoachGG code
- [x] Node.js 18+ installed locally

## 🗄️ Step 1: Set Up Production Supabase Project

### 1.1 Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "New Project"
3. Choose your organization
4. Set project details:
   - **Name**: `coachgg-production`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be ready (~2 minutes)

### 1.2 Configure Database Schema
1. Go to SQL Editor in your Supabase dashboard
2. Run the database setup script from `docs/database_setup_guide.md`
3. Or import your existing schema if you have a backup

### 1.3 Set Up Storage Buckets
1. Go to Storage in Supabase dashboard
2. Create these buckets (all public):
   - `avatars` (for profile pictures)
   - `team-logos` (for team logos)
   - `match-screenshots` (for match images)

### 1.4 Configure Row Level Security (RLS)
1. Go to Authentication → Policies
2. Run the RLS policies from `docs/fix_rls_policies_v2.sql`

### 1.5 Get Production Keys
1. Go to Settings → API
2. Copy these values (you'll need them later):
   - **Project URL** (starts with https://...)
   - **anon public key** (starts with eyJ...)
   - **service_role secret** (starts with eyJ...)

## 🌐 Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```

### 2.3 Deploy from Project Root
```bash
# From your project root directory
vercel

# Follow the prompts:
# ? Set up and deploy "~/path/to/coachgg"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? coachgg
# ? In which directory is your code located? ./
```

### 2.4 Configure Environment Variables
1. Go to your Vercel dashboard
2. Select your `coachgg` project
3. Go to Settings → Environment Variables
4. Add these variables:

**For All Environments (Production, Preview, Development):**

```
VITE_SUPABASE_URL = [Your Supabase Project URL]
VITE_SUPABASE_ANON_KEY = [Your Supabase anon public key]
VITE_OPENROUTER_API_KEY = [Your OpenRouter API key]
SUPABASE_URL = [Your Supabase Project URL]
SUPABASE_SERVICE_ROLE_KEY = [Your Supabase service_role secret]
JWT_SECRET = [Generate a random 32+ character string]
NODE_ENV = production
```

### 2.5 Redeploy with Environment Variables
```bash
vercel --prod
```

## 🔧 Step 3: Configure Production Settings

### 3.1 Update CORS Settings
1. In your Supabase dashboard, go to Settings → API
2. Add your Vercel domain to CORS origins:
   - `https://your-app-name.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

### 3.2 Configure Authentication
1. Go to Authentication → Settings in Supabase
2. Add your production URL to "Site URL":
   - `https://your-app-name.vercel.app`
3. Add redirect URLs if needed

### 3.3 Update API Configuration
The app should automatically use the production API endpoints when deployed.

## 🧪 Step 4: Test Production Deployment

### 4.1 Basic Functionality Test
1. Visit your Vercel URL
2. Test user registration/login
3. Try adding a match
4. Test team creation
5. Verify AI Coach works
6. Test file uploads
7. Check advanced charts

### 4.2 Performance Test
1. Check page load speeds
2. Test on mobile devices
3. Verify all images load correctly
4. Test chart exports

## 🔍 Step 5: Monitoring & Maintenance

### 5.1 Set Up Monitoring
1. **Vercel Analytics**: Enable in project settings
2. **Supabase Monitoring**: Check database performance
3. **Error Tracking**: Monitor Vercel function logs

### 5.2 Regular Maintenance
- Monitor database usage (Supabase free tier limits)
- Check Vercel bandwidth usage
- Update dependencies regularly
- Backup database periodically

## 🚨 Troubleshooting

### Common Issues:

**Build Fails:**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install  # Install dependencies
npm run build  # Test build locally
```

**Environment Variables Not Working:**
- Ensure all variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check CORS settings
- Ensure RLS policies are correct

**File Upload Issues:**
- Verify storage buckets exist and are public
- Check storage policies
- Ensure correct bucket names in code

## 📊 Production Checklist

- [ ] Supabase production project created
- [ ] Database schema deployed
- [ ] Storage buckets configured
- [ ] RLS policies applied
- [ ] Vercel project deployed
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Authentication working
- [ ] File uploads working
- [ ] Charts and analytics working
- [ ] Mobile responsiveness tested
- [ ] Performance optimized

## 🎯 Post-Deployment

### Custom Domain (Optional)
1. Purchase domain from your preferred registrar
2. In Vercel dashboard, go to Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update Supabase CORS and auth settings

### SSL Certificate
Vercel automatically provides SSL certificates for all deployments.

## 📈 Scaling Considerations

**Free Tier Limits:**
- **Vercel**: 100GB bandwidth, 100 serverless function executions/day
- **Supabase**: 500MB database, 1GB bandwidth, 50MB file storage

**Upgrade Triggers:**
- High user traffic
- Large file uploads
- Complex database queries
- Need for custom domains

## 🎉 Success!

Your CoachGG app should now be live at `https://your-app-name.vercel.app`!

Share the link with competitive gamers and start getting feedback on your amazing esports coaching platform! 🎮✨