create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table public.project_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.project_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  client_name text,
  event_date date,
  custom_domain text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.demos (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.project_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  demo_url text not null,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  bucket text not null default 'media-assets',
  path text not null,
  public_url text,
  title text,
  media_type text not null check (media_type in ('image', 'video', 'audio')),
  alt_text text,
  created_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default uuid_generate_v4(),
  media_asset_id uuid references public.media_assets(id) on delete cascade,
  title text not null,
  category text,
  item_type text not null check (item_type in ('image', 'video')),
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.video_reels (
  id uuid primary key default uuid_generate_v4(),
  media_asset_id uuid references public.media_assets(id) on delete cascade,
  title text not null,
  caption text,
  poster_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  event_type text,
  quote text not null,
  avatar_url text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  source text not null default 'manual' check (source in ('manual', 'ai_suggested')),
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.blog_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.blogs (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.blog_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  featured_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  tags text[] not null default '{}',
  meta_title text,
  meta_description text,
  og_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text not null,
  event_type text not null,
  event_date date,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  url text not null,
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table public.site_settings (
  id text primary key default 'default',
  brand_name text not null default 'Wedify',
  tagline text not null default 'The Royal Invite',
  domain text not null default 'wedify.prajal.online',
  description text not null,
  hero_video_url text,
  background_music_url text,
  whatsapp_number text not null default '6235088556',
  whatsapp_message text not null default 'Hi Wedify, I would like a wedding website for my event.',
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.demos enable row level security;
alter table public.media_assets enable row level security;
alter table public.gallery_items enable row level security;
alter table public.video_reels enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blogs enable row level security;
alter table public.leads enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;

create policy "Public can read published content" on public.demos for select using (true);
create policy "Public can read gallery" on public.gallery_items for select using (true);
create policy "Public can read reels" on public.video_reels for select using (is_active);
create policy "Public can read testimonials" on public.testimonials for select using (true);
create policy "Public can read faqs" on public.faqs for select using (is_published);
create policy "Public can read blog categories" on public.blog_categories for select using (true);
create policy "Public can read published blogs" on public.blogs for select using (status = 'published');
create policy "Public can create leads" on public.leads for insert with check (true);
create policy "Public can read settings" on public.site_settings for select using (true);
create policy "Public can read categories" on public.project_categories for select using (is_active);

create policy "Admins manage profiles" on public.profiles for all using (auth.uid() = id);
create policy "Authenticated admins manage categories" on public.project_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage projects" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage demos" on public.demos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage media" on public.media_assets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage gallery" on public.gallery_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage reels" on public.video_reels for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage testimonials" on public.testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage faqs" on public.faqs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage blogs" on public.blogs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage leads" on public.leads for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage socials" on public.social_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated admins manage settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into public.project_categories (name, slug, description, sort_order) values
('Wedding Websites', 'wedding-websites', 'Royal digital wedding experiences.', 1),
('Save The Date Websites', 'save-the-date-websites', 'Elegant pre-invitation launches.', 2),
('Engagement Websites', 'engagement-websites', 'Story-led engagement showcases.', 3),
('Reception Websites', 'reception-websites', 'Premium reception invitations.', 4),
('Birthday Websites', 'birthday-websites', 'Celebration pages for milestone moments.', 5),
('Anniversary Websites', 'anniversary-websites', 'Timeless anniversary storytelling.', 6),
('Baby Shower Websites', 'baby-shower-websites', 'Warm digital shower invitations.', 7),
('Corporate Event Websites', 'corporate-event-websites', 'Polished event microsites for teams.', 8);

insert into public.site_settings (description, hero_video_url, background_music_url) values
('Premium digital invitations, wedding websites, RSVP management, and unforgettable online experiences.', '/media/wedding-hero.mp4', '/audio/background.mp3')
on conflict (id) do nothing;
