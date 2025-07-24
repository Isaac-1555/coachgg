# ⚡ Quick Deploy Guide - CoachGG

Get CoachGG live in production in under 30 minutes!

## 🚀 Super Quick Start

### 1. Prerequisites (5 minutes)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

### 2. Set Up Supabase Production (10 minutes)
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `coachgg-production`
3. Wait for setup to complete
4. Go to SQL Editor → Run your database schema
5. Go to Storage → Create buckets: `avatars`, `team-logos`, `match-screenshots`
6. Go to Settings → API → Copy these keys:
   - Project URL
   - anon public key  
   - service_role secret

### 3. Deploy to Vercel (10 minutes)
```bash
# From your project root
./deploy.sh

# Or manually:
vercel --prod
```

### 4. Set Environment Variables (5 minutes)
In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_SUPABASE_URL = [Your Supabase URL]
VITE_SUPABASE_ANON_KEY = [Your anon key]
VITE_OPENROUTER_API_KEY = [Your OpenRouter key]
SUPABASE_URL = [Your Supabase URL]
SUPABASE_SERVICE_ROLE_KEY = [Your service role key]
JWT_SECRET = [Random 32+ character string]
NODE_ENV = production
```

### 5. Final Deploy
```bash
vercel --prod
```

## ✅ That's it!

Your app is now live at `https://your-project-name.vercel.app`

## 🧪 Quick Test
- [ ] Can register/login
- [ ] Can add a match
- [ ] Charts display
- [ ] File upload works

## 🎉 You're Live!

Share your app with the gaming community! 🎮