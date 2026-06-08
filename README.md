# Wedify - The Royal Invite

Premium luxury dark-themed platform for showcasing and selling digital event websites.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth, Database, and Storage
- React Hook Form
- Zod
- Lucide Icons

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_wedify_schema.sql` in the SQL editor or through the Supabase CLI.
3. Enable Email/Password and Google under Authentication providers.
4. Create a public Storage bucket named `media-assets`.
5. Add your Supabase URL and anon key to `.env.local`.

## Admin Dashboard

The dashboard lives at `/admin/dashboard` and is protected by Supabase Auth middleware. Login is available at `/admin/login` with Email/Password and Google OAuth.

Dashboard modules included:

- Homepage Management
- Hero Video Upload
- Music Upload
- Demo Management
- Gallery Management
- Video Reel Management
- Testimonial Management
- FAQ Management
- Blog Management
- Contact Leads
- Social Links
- Site Settings

## Media

Default local paths:

- Hero video: `public/media/wedding-hero.mp4`
- Background music: `public/audio/background.mp3`

The app includes remote image fallbacks for preview. Production uploads should be stored in Supabase Storage and referenced through the editable settings/media tables.

## SEO

Generated routes:

- `/robots.txt`
- `/sitemap.xml`
- Open Graph and Twitter metadata
- Canonical URL support
- Organization structured data
- Blog post metadata

Production domain: `https://wedify.prajal.online`

## Deploy to Vercel

1. Push the project to a Git provider.
2. Import the repository into Vercel.
3. Set these environment variables:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` if enabling live AI generation
4. Add `wedify.prajal.online` in Vercel Domains.
5. Add the Vercel callback URL to Supabase Auth redirect URLs:
   - `https://wedify.prajal.online/admin/dashboard`

## Notes

The public site is fully previewable without Supabase credentials. Lead submission switches to database storage automatically when Supabase environment variables are present.
