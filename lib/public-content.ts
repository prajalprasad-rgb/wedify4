import { createClient } from "@/lib/supabase-server";
import { blogPosts as fallbackBlogs, demos as fallbackDemos, faqs as fallbackFaqs, gallery as fallbackGallery, testimonials as fallbackTestimonials } from "@/lib/data";
import { siteConfig } from "@/lib/constants";
import type { BlogPost, DemoWebsite, Faq, GalleryItem, Testimonial } from "@/types/content";

export type PublicSiteSettings = {
  brand_name: string;
  tagline: string;
  domain: string;
  description: string;
  hero_video_url: string | null;
  background_music_url: string | null;
  whatsapp_number: string;
  whatsapp_message: string;
  seo: {
    hero_media_type?: "video" | "image";
    hero_image_url?: string;
  };
};

export type PublicContent = {
  settings: PublicSiteSettings;
  demos: DemoWebsite[];
  gallery: GalleryItem[];
  reels: GalleryItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
  blogs: BlogPost[];
  socialLinks: Array<{ id: string; platform: string; url: string }>;
};

type MediaJoin = { public_url: string | null } | Array<{ public_url: string | null }> | null;
type GalleryRow = {
  id: string;
  title: string;
  category: string | null;
  item_type: "image" | "video";
  media_assets: MediaJoin;
};
type ReelRow = {
  id: string;
  title: string;
  caption: string | null;
  media_assets: MediaJoin;
};
type BlogRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: { body?: unknown } | null;
  featured_image_url: string | null;
  status: "draft" | "published";
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
};

function mediaUrl(media: MediaJoin) {
  if (Array.isArray(media)) return media[0]?.public_url ?? null;
  return media?.public_url ?? null;
}

function proxiedMediaUrl(url: string | null | undefined) {
  if (!url) return url ?? null;
  if (url.includes("/storage/v1/object/public/")) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  return url;
}

function imageUrlOrFallback(url: string | null | undefined, fallbackUrl: string) {
  if (!url) return fallbackUrl;
  if (url.includes("/storage/v1/object/public/")) return proxiedMediaUrl(url) ?? fallbackUrl;
  if (/\.(avif|gif|jpe?g|png|webp)(\?|$)/i.test(url)) return url;
  if (url.includes("images.unsplash.com")) return url;
  return fallbackUrl;
}

export async function getPublicContent(): Promise<PublicContent> {
  const fallback: PublicContent = {
    settings: {
      brand_name: siteConfig.name,
      tagline: siteConfig.tagline,
      domain: siteConfig.domain,
      description: siteConfig.description,
      hero_video_url: siteConfig.heroVideo,
      background_music_url: siteConfig.backgroundMusic,
      whatsapp_number: siteConfig.whatsapp,
      whatsapp_message: siteConfig.whatsappMessage,
      seo: {},
    },
    demos: fallbackDemos,
    gallery: fallbackGallery,
    reels: fallbackGallery.slice(0, 5),
    testimonials: fallbackTestimonials,
    faqs: fallbackFaqs,
    blogs: fallbackBlogs,
    socialLinks: [
      { id: "instagram", platform: "Instagram", url: siteConfig.instagram },
      { id: "whatsapp", platform: "WhatsApp", url: `https://api.whatsapp.com/send?phone=91${siteConfig.whatsapp}` },
    ],
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const [settingsResponse, demosResponse, galleryResponse, reelsResponse, testimonialsResponse, faqsResponse, blogsResponse, socialsResponse] =
      await Promise.all([
        supabase.from("site_settings").select("*").eq("id", "default").maybeSingle(),
        supabase.from("demos").select("*").order("sort_order").order("created_at", { ascending: false }),
        supabase
          .from("gallery_items")
          .select("id,title,category,item_type,media_assets(public_url)")
          .order("sort_order")
          .order("created_at", { ascending: false }),
        supabase
          .from("video_reels")
          .select("id,title,caption,media_assets(public_url)")
          .eq("is_active", true)
          .order("sort_order")
          .order("created_at", { ascending: false }),
        supabase.from("testimonials").select("*").order("sort_order").order("created_at", { ascending: false }),
        supabase.from("faqs").select("*").eq("is_published", true).order("sort_order").order("created_at", { ascending: false }),
        supabase.from("blogs").select("*").eq("status", "published").order("published_at", { ascending: false }),
        supabase.from("social_links").select("id,platform,url").eq("is_active", true).order("sort_order").order("platform"),
      ]);

    const liveGallery = ((galleryResponse.data ?? []) as unknown as GalleryRow[]).map((item) => ({
      id: item.id,
      title: item.title,
      type: item.item_type,
      src: proxiedMediaUrl(mediaUrl(item.media_assets)) ?? fallback.gallery[0]?.src ?? siteConfig.heroVideo,
      category: item.category ?? "Gallery",
    }));
    const firstGalleryImage =
      liveGallery.find((item) => item.type === "image")?.src ??
      fallback.gallery.find((item) => item.type === "image")?.src;

    const liveReels = ((reelsResponse.data ?? []) as unknown as ReelRow[]).map((item) => ({
      id: item.id,
      title: item.title,
      type: "video" as const,
      src: proxiedMediaUrl(mediaUrl(item.media_assets)) ?? fallback.reels[0]?.src ?? siteConfig.heroVideo,
      category: item.caption ?? "Wedding Reel",
      poster: firstGalleryImage,
    }));

    const liveBlogs = ((blogsResponse.data ?? []) as BlogRow[]).map((blog) => ({
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt ?? "",
      category: "Wedify Blog",
      date: blog.published_at ?? blog.created_at,
      image: proxiedMediaUrl(blog.featured_image_url) ?? fallback.blogs[0]?.image ?? siteConfig.heroVideo,
      tags: blog.tags ?? [],
      published: blog.status === "published",
      body: typeof blog.content?.body === "string" ? blog.content.body : "",
    }));

    return {
      settings: settingsResponse.data
        ? {
            ...settingsResponse.data,
            hero_video_url: proxiedMediaUrl(settingsResponse.data.hero_video_url),
            background_music_url: proxiedMediaUrl(settingsResponse.data.background_music_url),
            seo: {
              ...(settingsResponse.data.seo ?? {}),
              hero_image_url: proxiedMediaUrl(settingsResponse.data.seo?.hero_image_url),
            },
          }
        : fallback.settings,
      demos: (demosResponse.data ?? []).map((demo) => ({
        id: demo.id,
        title: demo.title,
        category: "Demo Website",
        description: demo.description ?? "",
        coverImage: imageUrlOrFallback(demo.cover_image_url, fallback.demos[0]?.coverImage ?? siteConfig.heroVideo),
        demoUrl: demo.demo_url,
        featured: demo.is_featured,
      })),
      gallery: liveGallery.length ? liveGallery : fallback.gallery,
      reels: liveReels.length ? liveReels : fallback.reels,
      testimonials: (testimonialsResponse.data ?? []).map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.name,
        event: testimonial.event_type ?? "Wedify Client",
        quote: testimonial.quote,
        featured: testimonial.is_featured,
      })),
      faqs: (faqsResponse.data ?? []).map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      })),
      blogs: liveBlogs.length ? liveBlogs : fallback.blogs,
      socialLinks: socialsResponse.data?.length ? socialsResponse.data : fallback.socialLinks,
    };
  } catch {
    return fallback;
  }
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  return (await getPublicContent()).blogs;
}

export async function getPublishedBlog(slug: string): Promise<BlogPost | undefined> {
  const blogs = await getPublishedBlogs();
  return blogs.find((blog) => blog.slug === slug);
}
