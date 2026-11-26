# Deploying Skid Row 2027 to Supabase + Vercel

## 1. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the full contents of `supabase/schema.sql`.
3. *(Optional for CMS Image Uploads)* Open **Storage → New Bucket**, name it `media`, and toggle **Public bucket = ON**.
4. Go to **Project Settings → API** and copy:
   - **Project URL** (`SUPABASE_URL`)
   - **service_role secret key** (`SUPABASE_SERVICE_ROLE_KEY`)

## 2. Deploy to Vercel
1. Push this repo to `https://github.com/wireddigitalus-stack/skidrow2027.git`.
2. Import the repository in [vercel.com](https://vercel.com) (Astro framework preset is auto-detected).
3. Add these **Environment Variables** in Vercel Project Settings:
   - `SUPABASE_URL` — your Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — your Supabase `service_role` key
   - `ADMIN_PIN` — your chosen 6-digit PIN for `/backstage`
   - `SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
   - *(Optional)* `MAILERLITE_API_KEY` & `MAILERLITE_GROUP_ID` — to auto-sync new website signups to MailerLite
4. Click **Deploy** and connect your custom domain (`skidrow.com`).

## 3. Seed Initial 20 News Posts into Supabase
Once deployed (or locally with `.env` populated with Supabase credentials), open `/backstage` via the subtle **`MAN & MACHINE`** footer link, unlock with your 6-digit PIN, go to the **System** tab, and click **Seed 20 Skid Row Posts to Supabase**.
