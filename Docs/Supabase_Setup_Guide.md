# Supabase Setup Guide - MatchVibe

**Version:** 1.0.0  
**Last Updated:** 2025-01-08

---

## 📋 Prerequisites

- Supabase account (https://supabase.com)
- Project created on Supabase dashboard

---

## 🚀 Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - **Name:** MatchVibe
   - **Database Password:** (Choose a strong password)
   - **Region:** Select closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (~2-3 minutes)

---

## 🔑 Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL:** `https://your-project.supabase.co`
   - **anon public key:** Long JWT token starting with `eyJ...`
   - **service_role key:** Another JWT token (keep this secret!)

3. Create `.env.local` in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Telegram (will be configured later)
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_BOT_USERNAME=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🗄️ Step 3: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents from `/Docs/supabase_schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl+Enter`
6. Verify all tables were created:
   - Go to **Table Editor**
   - You should see: profiles, rooms, categories, questions, responses, results, favorites, achievements, user_achievements

---

## 🔐 Step 4: Configure Authentication

### Enable Telegram Auth (Optional for now)

1. Go to **Authentication** → **Providers**
2. We'll use custom authentication with Telegram initData
3. For now, keep Email auth enabled for testing

### Row Level Security (RLS)

RLS policies are already created in the schema. Verify they're enabled:

1. Go to **Authentication** → **Policies**
2. Check that each table has policies listed
3. Common policies:
   - Users can read their own data
   - Users can update their own profiles
   - Public data is readable by all

---

## ⚡ Step 5: Enable Realtime (Optional)

For real-time room updates:

1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - `rooms` (for player join notifications)
   - `responses` (for game progress sync)
3. Click "Save"

---

## 🖼️ Step 6: Set Up Storage (For Images)

1. Go to **Storage** → **Create bucket**
2. Create buckets:
   - **Name:** `categories` - For category images
   - **Public:** ✅ Yes
   - **Name:** `questions` - For question card images
   - **Public:** ✅ Yes
   - **Name:** `avatars` - For user avatars
   - **Public:** ✅ Yes

3. Set storage policies:
   - Public read access for all buckets
   - Authenticated write for avatars bucket

---

## 📊 Step 7: Seed Test Data (Optional)

Initial categories and achievements are already seeded in the schema.

To add sample questions:

```sql
-- Example: Food category questions
INSERT INTO questions (category_id, text, image_url, order_index)
SELECT
  id,
  'Пицца',
  'https://your-storage-url/pizza.jpg',
  1
FROM categories WHERE name = 'Еда и напитки';

-- Add more questions similarly
```

---

## 🧪 Step 8: Test Database Connection

In your Next.js project:

```typescript
// Test in a server component or API route
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data, error } = await supabase.from('categories').select('*')

console.log('Categories:', data)
```

---

## 🔧 Step 9: Configure TypeScript Types

### Generate Database Types

1. Install Supabase CLI:

```bash
npm install -g supabase
```

2. Login to Supabase:

```bash
supabase login
```

3. Link your project:

```bash
supabase link --project-ref your-project-ref
```

4. Generate types:

```bash
supabase gen types typescript --local > src/types/database.ts
```

### Manual Types (Already Included)

The basic types are already in `/src/types/database.ts`. Update them as your schema evolves.

---

## 📝 Step 10: Verify Setup

Checklist:

- [ ] Project created on Supabase
- [ ] API credentials copied to `.env.local`
- [ ] Database schema executed successfully
- [ ] All tables visible in Table Editor
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Test connection successful

---

## 🚨 Troubleshooting

### "Invalid API Key" Error

- Verify `.env.local` has correct credentials
- Restart dev server after changing env variables

### "Row Level Security Policy Violation"

- Check RLS policies in Supabase dashboard
- Verify `auth.uid()` matches user ID
- For testing, temporarily disable RLS (not recommended for production)

### "Cannot connect to database"

- Check if project is paused (Supabase free tier pauses after inactivity)
- Verify network connection
- Check Supabase status page

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **Realtime:** https://supabase.com/docs/guides/realtime
- **Storage:** https://supabase.com/docs/guides/storage

---

## 🔄 Next Steps

After Supabase is set up:

1. Configure Telegram Bot (see `/Docs/Telegram_Setup_Guide.md`)
2. Test authentication flow
3. Add question data for each category
4. Set up image storage

---

**Status:** ✅ Ready for Integration  
**Updated:** 2025-01-08
