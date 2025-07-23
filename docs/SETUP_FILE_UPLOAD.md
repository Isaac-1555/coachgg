# File Upload Setup - Exact Steps

## Step 1: Update Database Schema

Run these SQL commands in your database:

```sql
ALTER TABLE teams ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
```

**How to run:**
- If using Supabase: Go to SQL Editor in your Supabase dashboard and run the above commands
- If using local PostgreSQL: Run `psql -d your_database_name` then paste the commands

## Step 2: Create Storage Buckets in Supabase

1. Go to your Supabase project dashboard
2. Click "Storage" in the left sidebar
3. Click "Create a new bucket"
4. Create these 3 buckets (one by one):

**Bucket 1:**
- Name: `avatars`
- Public bucket: ✅ YES
- Click "Create bucket"

**Bucket 2:**
- Name: `team-logos`
- Public bucket: ✅ YES
- Click "Create bucket"

**Bucket 3:**
- Name: `match-screenshots`
- Public bucket: ✅ YES
- Click "Create bucket"

## Step 3: Update Environment Variables

Add these lines to your `server/.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Where to find these values:**
- Go to Supabase dashboard → Settings → API
- Copy "Project URL" for SUPABASE_URL
- Copy "service_role secret" for SUPABASE_SERVICE_ROLE_KEY

## Step 4: Test the Upload

1. Start your server: `cd server && npm start`
2. Start your client: `cd client && npm run dev`
3. Go to Settings tab and try uploading an avatar
4. Create a team and try uploading a logo
5. Add a match and try uploading a screenshot

## Done!

File upload should now work. If you get errors, check:
- Environment variables are correct
- Storage buckets exist and are public
- Database columns were added successfully