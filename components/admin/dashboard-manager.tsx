"use client";

import {
  BarChart3,
  BookOpen,
  Clapperboard,
  Download,
  FileQuestion,
  GalleryHorizontalEnd,
  Home,
  ImageUp,
  LogOut,
  Music,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Share2,
  Star,
  Trash2,
  UploadCloud,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { createClient } from "@/lib/supabase-browser";

type TabKey = "settings" | "demos" | "gallery" | "reels" | "testimonials" | "faqs" | "blogs" | "leads" | "socials";
type UploadTarget =
  | "hero_video_url"
  | "hero_image_url"
  | "background_music_url"
  | "demo_cover_image_url"
  | "gallery_asset_url"
  | "reel_video_url"
  | "blog_featured_image_url";

type SiteSettings = {
  id: string;
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

type Demo = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  demo_url: string;
  is_featured: boolean;
};

type Testimonial = {
  id: string;
  name: string;
  event_type: string | null;
  quote: string;
  is_featured: boolean;
};

type Faq = {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string | null;
  message: string;
  created_at: string;
};

type GalleryItem = {
  id: string;
  title: string;
  category: string | null;
  item_type: "image" | "video";
  is_featured: boolean;
};

type VideoReel = {
  id: string;
  title: string;
  caption: string | null;
  is_active: boolean;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  status: "draft" | "published";
};

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  is_active: boolean;
};

const tabs: Array<{ key: TabKey; label: string; icon: typeof Settings }> = [
  { key: "settings", label: "Site Settings", icon: Settings },
  { key: "demos", label: "Demos", icon: GalleryHorizontalEnd },
  { key: "gallery", label: "Gallery", icon: ImageUp },
  { key: "reels", label: "Reels", icon: Clapperboard },
  { key: "testimonials", label: "Testimonials", icon: Star },
  { key: "faqs", label: "FAQs", icon: FileQuestion },
  { key: "blogs", label: "Blogs", icon: BookOpen },
  { key: "leads", label: "Leads", icon: Users },
  { key: "socials", label: "Social Links", icon: Share2 },
];

const modules: Array<{
  title: string;
  icon: typeof Settings;
  detail: string;
  tab: TabKey;
}> = [
  { title: "Homepage Management", icon: Home, detail: "Hero copy, stats, about content, CTAs", tab: "settings" },
  { title: "Hero Video Upload", icon: UploadCloud, detail: "Replace the full-screen wedding hero video", tab: "settings" },
  { title: "Music Upload", icon: Music, detail: "Manage floating background music", tab: "settings" },
  { title: "Demo Management", icon: GalleryHorizontalEnd, detail: "Unlimited demo slots and featured flags", tab: "demos" },
  { title: "Gallery Management", icon: ImageUp, detail: "Screenshots, mockups, images, and videos", tab: "gallery" },
  { title: "Video Reel Management", icon: Clapperboard, detail: "Instagram-style event reels", tab: "reels" },
  { title: "Testimonial Management", icon: Star, detail: "Add, edit, delete, and feature reviews", tab: "testimonials" },
  { title: "FAQ Management", icon: FileQuestion, detail: "Manual FAQs plus AI suggestions", tab: "faqs" },
  { title: "Blog Management", icon: BookOpen, detail: "Drafts, publishing, tags, SEO and AI drafts", tab: "blogs" },
  { title: "Contact Leads", icon: Users, detail: "Search, delete, and export CSV", tab: "leads" },
  { title: "Social Links", icon: Share2, detail: "Instagram, WhatsApp, and future channels", tab: "socials" },
  { title: "Site Settings", icon: Settings, detail: "Brand, domain, SEO defaults, media paths", tab: "settings" },
];

const emptyDemo = {
  title: "",
  slug: "",
  description: "",
  cover_image_url: "",
  demo_url: "",
  is_featured: false,
};

const emptyTestimonial = {
  name: "",
  event_type: "",
  quote: "",
  is_featured: false,
};

const emptyFaq = {
  question: "",
  answer: "",
  is_published: true,
};

const emptyGalleryForm = {
  title: "",
  category: "Gallery",
};

const emptyReelForm = {
  title: "",
  caption: "Wedding Reel",
};

const emptyBlog = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image_url: "",
  status: "draft" as "draft" | "published",
  tags: "",
  meta_title: "",
  meta_description: "",
};

const emptySocial = {
  platform: "",
  url: "",
  is_active: true,
};

export function AdminDashboardManager() {
  const supabase = useMemo(() => createClient(), []);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("settings");
  const [activeModule, setActiveModule] = useState("Homepage Management");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadTarget | "">("");
  const [lastUploadedUrl, setLastUploadedUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [demoForm, setDemoForm] = useState(emptyDemo);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const [videoReels, setVideoReels] = useState<VideoReel[]>([]);
  const [reelForm, setReelForm] = useState(emptyReelForm);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialForm, setSocialForm] = useState(emptySocial);
  const [leadSearch, setLeadSearch] = useState("");

  const filteredLeads = leads.filter((lead) =>
    `${lead.name} ${lead.email} ${lead.phone} ${lead.event_type}`
      .toLowerCase()
      .includes(leadSearch.toLowerCase()),
  );

  const openTab = (tab: TabKey, moduleTitle?: string) => {
    setActiveTab(tab);
    setActiveModule(moduleTitle ?? modules.find((module) => module.tab === tab)?.title ?? "Homepage Management");
    window.setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const openModule = (module: (typeof modules)[number]) => {
    openTab(module.tab, module.title);
  };

  const uploadFile = async (file: File | null, target: UploadTarget, folder: string) => {
    if (!file) return;
    setUploading(target);
    setError("");
    setNotice("");
    setLastUploadedUrl("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setUploading("");
      setError("Please log in again before uploading files.");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: form,
    });
    const result = (await response.json()) as { bucket?: string; path?: string; publicUrl?: string; error?: string };

    setUploading("");

    if (!response.ok || !result.publicUrl) {
      setError(result.error ?? "Upload failed");
      return;
    }

    if ((target === "hero_video_url" || target === "background_music_url") && settings) {
      setSettings({ ...settings, [target]: result.publicUrl });
    }

    if (target === "hero_image_url" && settings) {
      setSettings({
        ...settings,
        seo: { ...settings.seo, hero_image_url: result.publicUrl, hero_media_type: "image" },
      });
    }

    if (target === "demo_cover_image_url") {
      setDemoForm({ ...demoForm, cover_image_url: result.publicUrl });
    }

    if (target === "blog_featured_image_url") {
      setBlogForm({ ...blogForm, featured_image_url: result.publicUrl });
    }

    if ((target === "gallery_asset_url" || target === "reel_video_url") && result.bucket && result.path) {
      const mediaType = file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "image";
      const title =
        target === "gallery_asset_url"
          ? galleryForm.title.trim() || "Wedify Gallery"
          : reelForm.title.trim() || "Wedify Reel";
      const { data: mediaAsset, error: mediaError } = await supabase
        .from("media_assets")
        .insert({
          bucket: result.bucket,
          path: result.path,
          public_url: result.publicUrl,
          title,
          media_type: mediaType,
          alt_text: title,
        })
        .select("id")
        .single();

      if (mediaError || !mediaAsset) {
        setError(mediaError?.message ?? "Media asset record could not be created.");
        return;
      }

      if (target === "gallery_asset_url") {
        const { error: galleryError } = await supabase.from("gallery_items").insert({
          media_asset_id: mediaAsset.id,
          title,
          category: galleryForm.category.trim() || (mediaType === "video" ? "Video" : "Gallery"),
          item_type: mediaType === "video" ? "video" : "image",
          is_featured: false,
        });

        if (galleryError) {
          setError(galleryError.message);
          return;
        }
      }

      if (target === "reel_video_url") {
        const { error: reelError } = await supabase.from("video_reels").insert({
          media_asset_id: mediaAsset.id,
          title,
          caption: reelForm.caption.trim() || "Wedding reel",
          is_active: true,
        });

        if (reelError) {
          setError(reelError.message);
          return;
        }
      }

      await loadData();
      if (target === "gallery_asset_url") setGalleryForm(emptyGalleryForm);
      if (target === "reel_video_url") setReelForm(emptyReelForm);
    }

    setLastUploadedUrl(result.publicUrl);
    setNotice(target === "gallery_asset_url" || target === "reel_video_url" ? "File uploaded and added to the dashboard." : "File uploaded. Save the related form to publish the new URL.");
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    setNotice("");

    const [
      settingsResponse,
      demosResponse,
      testimonialsResponse,
      faqsResponse,
      leadsResponse,
      galleryResponse,
      reelsResponse,
      blogsResponse,
      socialsResponse,
    ] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", "default").maybeSingle(),
      supabase.from("demos").select("*").order("created_at", { ascending: false }),
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      supabase.from("faqs").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_items").select("id,title,category,item_type,is_featured").order("created_at", { ascending: false }),
      supabase.from("video_reels").select("id,title,caption,is_active").order("created_at", { ascending: false }),
      supabase.from("blogs").select("id,title,slug,excerpt,featured_image_url,status").order("created_at", { ascending: false }),
      supabase.from("social_links").select("id,platform,url,is_active").order("sort_order").order("platform"),
    ]);

    const firstError =
      settingsResponse.error ||
      demosResponse.error ||
      testimonialsResponse.error ||
      faqsResponse.error ||
      leadsResponse.error ||
      galleryResponse.error ||
      reelsResponse.error ||
      blogsResponse.error ||
      socialsResponse.error;

    if (firstError) {
      setError(firstError.message);
    } else {
      setSettings(settingsResponse.data ? { ...settingsResponse.data, seo: settingsResponse.data.seo ?? {} } : null);
      setDemos(demosResponse.data ?? []);
      setTestimonials(testimonialsResponse.data ?? []);
      setFaqs(faqsResponse.data ?? []);
      setLeads(leadsResponse.data ?? []);
      setGalleryItems((galleryResponse.data ?? []) as GalleryItem[]);
      setVideoReels((reelsResponse.data ?? []) as VideoReel[]);
      setBlogs((blogsResponse.data ?? []) as Blog[]);
      setSocialLinks((socialsResponse.data ?? []) as SocialLink[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          window.location.href = "/admin/login";
          return;
        }
        void loadData();
      });
    }, 0);
    return () => window.clearTimeout(timer);
    // Initial dashboard hydration only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const saveSettings = async () => {
    if (!settings) return;
    setNotice("");
    setError("");
    const { error: saveError } = await supabase.from("site_settings").upsert(settings);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setNotice("Site settings saved.");
  };

  const setHeroMode = (mode: "video" | "image") => {
    if (!settings) return;
    setSettings({ ...settings, seo: { ...settings.seo, hero_media_type: mode } });
  };

  const addDemo = async () => {
    setNotice("");
    setError("");
    const { error: insertError } = await supabase.from("demos").insert({
      ...demoForm,
      description: demoForm.description || null,
      cover_image_url: demoForm.cover_image_url || null,
      demo_url: demoForm.demo_url || `/demo/${demoForm.slug}`,
    });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setDemoForm(emptyDemo);
    setNotice("Demo added.");
    await loadData();
  };

  const deleteDemo = async (id: string) => {
    const { error: deleteError } = await supabase.from("demos").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("Demo deleted.");
    await loadData();
  };

  const addTestimonial = async () => {
    setNotice("");
    setError("");
    const { error: insertError } = await supabase.from("testimonials").insert({
      ...testimonialForm,
      event_type: testimonialForm.event_type || null,
    });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTestimonialForm(emptyTestimonial);
    setNotice("Testimonial added.");
    await loadData();
  };

  const deleteTestimonial = async (id: string) => {
    const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("Testimonial deleted.");
    await loadData();
  };

  const addFaq = async () => {
    setNotice("");
    setError("");
    const { error: insertError } = await supabase.from("faqs").insert(faqForm);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setFaqForm(emptyFaq);
    setNotice("FAQ added.");
    await loadData();
  };

  const deleteFaq = async (id: string) => {
    const { error: deleteError } = await supabase.from("faqs").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("FAQ deleted.");
    await loadData();
  };

  const deleteLead = async (id: string) => {
    const { error: deleteError } = await supabase.from("leads").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("Lead deleted.");
    await loadData();
  };

  const deleteGalleryItem = async (id: string) => {
    const { error: deleteError } = await supabase.from("gallery_items").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("Gallery item deleted.");
    await loadData();
  };

  const updateGalleryItem = async (item: GalleryItem, title: string, category: string) => {
    const { error: updateError } = await supabase
      .from("gallery_items")
      .update({ title, category })
      .eq("id", item.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setNotice("Gallery item updated.");
    await loadData();
  };

  const deleteVideoReel = async (id: string) => {
    const { error: deleteError } = await supabase.from("video_reels").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("Video reel deleted.");
    await loadData();
  };

  const updateVideoReel = async (reel: VideoReel, title: string, caption: string) => {
    const { error: updateError } = await supabase
      .from("video_reels")
      .update({ title, caption })
      .eq("id", reel.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setNotice("Video reel updated.");
    await loadData();
  };

  const addBlog = async () => {
    setNotice("");
    setError("");
    const { error: insertError } = await supabase.from("blogs").insert({
      title: blogForm.title,
      slug: blogForm.slug || slugify(blogForm.title),
      excerpt: blogForm.excerpt || null,
      content: { body: blogForm.content },
      featured_image_url: blogForm.featured_image_url || null,
      status: blogForm.status,
      tags: blogForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      meta_title: blogForm.meta_title || blogForm.title,
      meta_description: blogForm.meta_description || blogForm.excerpt || null,
      og_image_url: blogForm.featured_image_url || null,
      published_at: blogForm.status === "published" ? new Date().toISOString() : null,
    });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setBlogForm(emptyBlog);
    setNotice("Blog post added.");
    await loadData();
  };

  const deleteBlog = async (id: string) => {
    const { error: deleteError } = await supabase.from("blogs").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("Blog post deleted.");
    await loadData();
  };

  const addSocial = async () => {
    setNotice("");
    setError("");
    const { error: insertError } = await supabase.from("social_links").insert(socialForm);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSocialForm(emptySocial);
    setNotice("Social link added.");
    await loadData();
  };

  const deleteSocial = async (id: string) => {
    const { error: deleteError } = await supabase.from("social_links").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("Social link deleted.");
    await loadData();
  };

  const exportLeads = () => {
    const rows = filteredLeads.map((lead) => ({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      event_type: lead.event_type,
      event_date: lead.event_date ?? "",
      message: lead.message,
      created_at: lead.created_at,
    }));
    const csv = [
      Object.keys(rows[0] ?? { name: "", phone: "", email: "", event_type: "", event_date: "", message: "", created_at: "" }).join(","),
      ...rows.map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedify-leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-72 overflow-y-auto border-r border-white/10 bg-[#0b0b0b] p-6 lg:block">
        <BrandMark />
        <nav className="mt-10 grid gap-2">
          {modules.map((module) => {
            return (
              <button
                key={module.title}
                type="button"
                onClick={() => openModule(module)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                  activeModule === module.title
                    ? "bg-[#D4AF37]/12 text-[#E8C76A]"
                    : "text-white/64 hover:bg-white/[0.05] hover:text-[#E8C76A]"
                }`}
              >
                {module.title}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050505]/82 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">Wedify Admin</p>
              <h1 className="mt-1 text-2xl font-semibold">Luxury platform control room</h1>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={loadData} className="icon-button" aria-label="Refresh dashboard">
                <RefreshCw size={17} />
              </button>
              <Link href="/" className="rounded-full border border-[#D4AF37]/35 px-4 py-2 text-sm text-[#E8C76A] hover:bg-[#D4AF37]/10">
                View Site
              </Link>
              <button type="button" onClick={signOut} className="icon-button" aria-label="Sign out">
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Categories" value={8} icon={BarChart3} />
            <Metric label="Demos" value={demos.length} icon={GalleryHorizontalEnd} />
            <Metric label="Gallery Assets" value={galleryItems.length} icon={ImageUp} />
            <Metric label="Video Reels" value={videoReels.length} icon={Video} />
            <Metric label="Published Blogs" value={blogs.filter((blog) => blog.status === "published").length} icon={BookOpen} />
          </div>

          <section className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <article key={module.title} className="min-w-0 rounded-lg border border-white/10 bg-[#111111] p-5">
                  <Icon className="text-[#D4AF37]" size={22} />
                  <h2 className="mt-5 text-lg font-semibold">{module.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#BDBDBD]">{module.detail}</p>
                  <div className="mt-5 flex gap-2">
                    <button type="button" onClick={() => openModule(module)} className="rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-semibold text-black hover:bg-[#E8C76A]">
                      Manage
                    </button>
                    <Link href="/" className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 hover:text-[#E8C76A]">
                      Preview
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>

          <div className="flex gap-2 overflow-x-auto border-t border-white/10 pt-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => openTab(tab.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm ${
                  activeTab === tab.key ? "bg-[#D4AF37] text-black" : "border border-white/10 text-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div ref={editorRef} className="scroll-mt-28">
            {notice && <p className="mb-3 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3 text-sm text-[#E8C76A]">{notice}</p>}
            {lastUploadedUrl && (
              <div className="mb-3 grid gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Uploaded file URL</p>
                <input readOnly value={lastUploadedUrl} className="admin-input h-11 text-xs" onFocus={(event) => event.currentTarget.select()} />
              </div>
            )}
            {error && <p className="mb-3 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            {loading && <p className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-white/60">Loading admin data...</p>}
          </div>

          {!loading && activeTab === "settings" && settings && (
            <Panel title="Site Settings" description="Edit brand text, WhatsApp message, hero media, and music URL.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Brand Name" value={settings.brand_name} onChange={(value) => setSettings({ ...settings, brand_name: value })} />
                <Input label="Tagline" value={settings.tagline} onChange={(value) => setSettings({ ...settings, tagline: value })} />
                <Input label="Domain" value={settings.domain} onChange={(value) => setSettings({ ...settings, domain: value })} />
                <Input label="WhatsApp Number" value={settings.whatsapp_number} onChange={(value) => setSettings({ ...settings, whatsapp_number: value })} />
                <div className="grid gap-3 md:col-span-2">
                  <span className="text-sm text-white/70">Homepage Hero Type</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => setHeroMode("video")} className={settings.seo?.hero_media_type !== "image" ? "primary-button" : "secondary-button"}>
                      <Video size={17} />
                      Use Hero Video
                    </button>
                    <button type="button" onClick={() => setHeroMode("image")} className={settings.seo?.hero_media_type === "image" ? "primary-button" : "secondary-button"}>
                      <ImageUp size={17} />
                      Use Hero Photo
                    </button>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Input label="Hero Video URL" value={settings.hero_video_url ?? ""} onChange={(value) => setSettings({ ...settings, hero_video_url: value })} />
                  <FileUpload
                    label="Upload Hero Video"
                    accept="video/*"
                    uploading={uploading === "hero_video_url"}
                    onChange={(file) => uploadFile(file, "hero_video_url", "hero-videos")}
                  />
                </div>
                <div className="grid gap-3">
                  <Input label="Hero Photo URL" value={settings.seo?.hero_image_url ?? ""} onChange={(value) => setSettings({ ...settings, seo: { ...settings.seo, hero_image_url: value } })} />
                  <FileUpload
                    label="Upload Hero Photo"
                    accept="image/*"
                    uploading={uploading === "hero_image_url"}
                    onChange={(file) => uploadFile(file, "hero_image_url", "hero-photos")}
                  />
                </div>
                <div className="grid gap-3 md:col-span-2">
                  <Input label="Music URL" value={settings.background_music_url ?? ""} onChange={(value) => setSettings({ ...settings, background_music_url: value })} />
                  <FileUpload
                    label="Upload Music MP3/WAV"
                    accept="audio/*"
                    uploading={uploading === "background_music_url"}
                    onChange={(file) => uploadFile(file, "background_music_url", "music")}
                  />
                </div>
              </div>
              <Textarea label="Brand Description" value={settings.description} onChange={(value) => setSettings({ ...settings, description: value })} />
              <Textarea label="WhatsApp Message" value={settings.whatsapp_message} onChange={(value) => setSettings({ ...settings, whatsapp_message: value })} />
              <button type="button" onClick={saveSettings} className="primary-button">
                <Save size={17} />
                Save Settings
              </button>
            </Panel>
          )}

          {!loading && activeTab === "demos" && (
            <Panel title="Demo Management" description="Add and delete demo website cards shown to customers.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Title" value={demoForm.title} onChange={(value) => setDemoForm({ ...demoForm, title: value, slug: slugify(value) })} />
                <Input label="Slug" value={demoForm.slug} onChange={(value) => setDemoForm({ ...demoForm, slug: slugify(value) })} />
                <Input label="Demo URL" value={demoForm.demo_url} onChange={(value) => setDemoForm({ ...demoForm, demo_url: value })} placeholder="/demo/royal-vows" />
                <div className="grid gap-3">
                  <Input label="Cover Image URL" value={demoForm.cover_image_url} onChange={(value) => setDemoForm({ ...demoForm, cover_image_url: value })} />
                  <FileUpload
                    label="Upload Demo Cover Image"
                    accept="image/*"
                    uploading={uploading === "demo_cover_image_url"}
                    onChange={(file) => uploadFile(file, "demo_cover_image_url", "demo-covers")}
                  />
                </div>
              </div>
              <Textarea label="Description" value={demoForm.description} onChange={(value) => setDemoForm({ ...demoForm, description: value })} />
              <Checkbox label="Featured demo" checked={demoForm.is_featured} onChange={(value) => setDemoForm({ ...demoForm, is_featured: value })} />
              <button type="button" onClick={addDemo} className="primary-button">
                <Plus size={17} />
                Add Demo
              </button>
              <RecordList>
                {demos.map((demo) => (
                  <RecordRow key={demo.id} title={demo.title} subtitle={demo.demo_url} featured={demo.is_featured} onDelete={() => deleteDemo(demo.id)} />
                ))}
              </RecordList>
            </Panel>
          )}

          {!loading && activeTab === "testimonials" && (
            <Panel title="Testimonial Management" description="Add and delete client testimonials.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Name" value={testimonialForm.name} onChange={(value) => setTestimonialForm({ ...testimonialForm, name: value })} />
                <Input label="Event Type" value={testimonialForm.event_type} onChange={(value) => setTestimonialForm({ ...testimonialForm, event_type: value })} />
              </div>
              <Textarea label="Quote" value={testimonialForm.quote} onChange={(value) => setTestimonialForm({ ...testimonialForm, quote: value })} />
              <Checkbox label="Featured testimonial" checked={testimonialForm.is_featured} onChange={(value) => setTestimonialForm({ ...testimonialForm, is_featured: value })} />
              <button type="button" onClick={addTestimonial} className="primary-button">
                <Plus size={17} />
                Add Testimonial
              </button>
              <RecordList>
                {testimonials.map((testimonial) => (
                  <RecordRow key={testimonial.id} title={testimonial.name} subtitle={testimonial.quote} featured={testimonial.is_featured} onDelete={() => deleteTestimonial(testimonial.id)} />
                ))}
              </RecordList>
            </Panel>
          )}

          {!loading && activeTab === "gallery" && (
            <Panel title="Gallery Uploads" description="Upload screenshots, mobile mockups, client previews, or gallery videos. The record is created automatically.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Display Title" value={galleryForm.title} onChange={(value) => setGalleryForm({ ...galleryForm, title: value })} placeholder="Royal invitation preview" />
                <Input label="Category" value={galleryForm.category} onChange={(value) => setGalleryForm({ ...galleryForm, category: value })} placeholder="Gallery" />
              </div>
              <FileUpload
                label="Upload Gallery Image/Video"
                accept="image/*,video/*"
                uploading={uploading === "gallery_asset_url"}
                onChange={(file) => uploadFile(file, "gallery_asset_url", "gallery")}
              />
              <RecordList>
                {galleryItems.map((item) => (
                  <EditableGalleryRow key={item.id} item={item} onSave={updateGalleryItem} onDelete={() => deleteGalleryItem(item.id)} />
                ))}
              </RecordList>
            </Panel>
          )}

          {!loading && activeTab === "reels" && (
            <Panel title="Video Reel Uploads" description="Upload short wedding reel videos. The reel record is created automatically.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Display Title" value={reelForm.title} onChange={(value) => setReelForm({ ...reelForm, title: value })} placeholder="Royal wedding highlight" />
                <Input label="Caption" value={reelForm.caption} onChange={(value) => setReelForm({ ...reelForm, caption: value })} placeholder="Wedding Reel" />
              </div>
              <FileUpload
                label="Upload Reel Video"
                accept="video/*"
                uploading={uploading === "reel_video_url"}
                onChange={(file) => uploadFile(file, "reel_video_url", "reels")}
              />
              <RecordList>
                {videoReels.map((reel) => (
                  <EditableReelRow key={reel.id} reel={reel} onSave={updateVideoReel} onDelete={() => deleteVideoReel(reel.id)} />
                ))}
              </RecordList>
            </Panel>
          )}

          {!loading && activeTab === "blogs" && (
            <Panel title="Blog Management" description="Create SEO blog posts with featured images, tags, meta title, and publish status.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Blog Title" value={blogForm.title} onChange={(value) => setBlogForm({ ...blogForm, title: value, slug: slugify(value) })} />
                <Input label="Slug" value={blogForm.slug} onChange={(value) => setBlogForm({ ...blogForm, slug: slugify(value) })} />
                <Input label="Meta Title" value={blogForm.meta_title} onChange={(value) => setBlogForm({ ...blogForm, meta_title: value })} />
                <Input label="Tags" value={blogForm.tags} onChange={(value) => setBlogForm({ ...blogForm, tags: value })} placeholder="wedding, invitation, RSVP" />
                <div className="grid gap-3 md:col-span-2">
                  <Input label="Featured Image URL" value={blogForm.featured_image_url} onChange={(value) => setBlogForm({ ...blogForm, featured_image_url: value })} />
                  <FileUpload
                    label="Upload Blog Featured Image"
                    accept="image/*"
                    uploading={uploading === "blog_featured_image_url"}
                    onChange={(file) => uploadFile(file, "blog_featured_image_url", "blog-images")}
                  />
                </div>
              </div>
              <Textarea label="Excerpt" value={blogForm.excerpt} onChange={(value) => setBlogForm({ ...blogForm, excerpt: value })} />
              <Textarea label="Article Content" value={blogForm.content} onChange={(value) => setBlogForm({ ...blogForm, content: value })} />
              <Textarea label="Meta Description" value={blogForm.meta_description} onChange={(value) => setBlogForm({ ...blogForm, meta_description: value })} />
              <div className="flex flex-wrap items-center gap-4">
                <Checkbox label="Publish now" checked={blogForm.status === "published"} onChange={(value) => setBlogForm({ ...blogForm, status: value ? "published" : "draft" })} />
                <button type="button" onClick={addBlog} className="primary-button">
                  <Plus size={17} />
                  Add Blog
                </button>
              </div>
              <RecordList>
                {blogs.map((blog) => (
                  <RecordRow key={blog.id} title={blog.title} subtitle={`${blog.status} / ${blog.slug}`} featured={blog.status === "published"} onDelete={() => deleteBlog(blog.id)} />
                ))}
              </RecordList>
            </Panel>
          )}

          {!loading && activeTab === "socials" && (
            <Panel title="Social Links" description="Add, remove, and activate public social links used in the contact and footer areas.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Platform" value={socialForm.platform} onChange={(value) => setSocialForm({ ...socialForm, platform: value })} placeholder="Instagram" />
                <Input label="URL" value={socialForm.url} onChange={(value) => setSocialForm({ ...socialForm, url: value })} placeholder="https://..." />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Checkbox label="Active link" checked={socialForm.is_active} onChange={(value) => setSocialForm({ ...socialForm, is_active: value })} />
                <button type="button" onClick={addSocial} className="primary-button">
                  <Plus size={17} />
                  Add Social Link
                </button>
              </div>
              <RecordList>
                {socialLinks.map((link) => (
                  <RecordRow key={link.id} title={link.platform} subtitle={link.url} featured={link.is_active} onDelete={() => deleteSocial(link.id)} />
                ))}
              </RecordList>
            </Panel>
          )}

          {!loading && activeTab === "faqs" && (
            <Panel title="FAQ Management" description="Add and delete frequently asked questions.">
              <Input label="Question" value={faqForm.question} onChange={(value) => setFaqForm({ ...faqForm, question: value })} />
              <Textarea label="Answer" value={faqForm.answer} onChange={(value) => setFaqForm({ ...faqForm, answer: value })} />
              <Checkbox label="Published" checked={faqForm.is_published} onChange={(value) => setFaqForm({ ...faqForm, is_published: value })} />
              <button type="button" onClick={addFaq} className="primary-button">
                <Plus size={17} />
                Add FAQ
              </button>
              <RecordList>
                {faqs.map((faq) => (
                  <RecordRow key={faq.id} title={faq.question} subtitle={faq.answer} featured={faq.is_published} onDelete={() => deleteFaq(faq.id)} />
                ))}
              </RecordList>
            </Panel>
          )}

          {!loading && activeTab === "leads" && (
            <Panel title="Lead Management" description="Search, export, and delete contact form enquiries.">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={leadSearch}
                  onChange={(event) => setLeadSearch(event.target.value)}
                  placeholder="Search leads"
                  className="admin-input flex-1"
                />
                <button type="button" onClick={exportLeads} className="secondary-button">
                  <Download size={17} />
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="mt-5 w-full min-w-[760px] text-left text-sm">
                  <thead className="text-white/45">
                    <tr className="border-b border-white/10">
                      <th className="py-3 font-medium">Name</th>
                      <th className="py-3 font-medium">Contact</th>
                      <th className="py-3 font-medium">Event</th>
                      <th className="py-3 font-medium">Date</th>
                      <th className="py-3 font-medium">Message</th>
                      <th className="py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/5 align-top">
                        <td className="py-4 text-white">{lead.name}</td>
                        <td className="py-4 text-white/65">{lead.phone}<br />{lead.email}</td>
                        <td className="py-4 text-white/65">{lead.event_type}</td>
                        <td className="py-4 text-white/65">{lead.event_date ?? "-"}</td>
                        <td className="max-w-xs py-4 text-white/65">{lead.message}</td>
                        <td className="py-4">
                          <button type="button" aria-label={`Delete ${lead.name}`} onClick={() => deleteLead(lead.id)} className="text-white/45 hover:text-red-300">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>
      </section>

      <style jsx global>{`
        .admin-input {
          height: 3rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 0 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .admin-input:focus,
        .admin-textarea:focus {
          border-color: rgba(212, 175, 55, 0.7);
        }
        .admin-textarea {
          min-height: 7rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.8rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .primary-button {
          display: inline-flex;
          height: 3rem;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 999px;
          background: #d4af37;
          padding: 0 1.25rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: black;
        }
        .primary-button:hover {
          background: #e8c76a;
        }
        .secondary-button,
        .icon-button {
          display: inline-flex;
          height: 2.5rem;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0 1rem;
          color: rgba(255, 255, 255, 0.7);
        }
        .icon-button {
          width: 2.5rem;
          padding: 0;
        }
        .secondary-button:hover,
        .icon-button:hover {
          border-color: rgba(212, 175, 55, 0.55);
          color: #e8c76a;
        }
      `}</style>
    </main>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Settings }) {
  return (
    <article className="min-w-0 rounded-lg border border-white/10 bg-[#111111] p-5">
      <Icon className="text-[#D4AF37]" size={21} />
      <p className="mt-5 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-[#BDBDBD]">{label}</p>
    </article>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 rounded-lg border border-white/10 bg-[#111111] p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[#BDBDBD]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm text-white/70">
      {label}
      <input className="admin-input" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm text-white/70">
      {label}
      <textarea className="admin-textarea" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm text-white/70">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-[#D4AF37]" />
      {label}
    </label>
  );
}

function FileUpload({
  label,
  accept,
  uploading,
  onChange,
}: {
  label: string;
  accept: string;
  uploading: boolean;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="group flex min-h-24 cursor-pointer flex-col justify-center gap-2 rounded-lg border border-dashed border-[#D4AF37]/35 bg-[#D4AF37]/[0.04] px-4 py-3 text-sm text-white/70 transition hover:border-[#E8C76A] hover:bg-[#D4AF37]/[0.08]">
      <span className="flex items-center gap-2 font-medium text-[#E8C76A]">
        {uploading ? <RefreshCw size={17} className="animate-spin" /> : <UploadCloud size={17} />}
        {uploading ? "Uploading..." : label}
      </span>
      <span className="text-xs leading-5 text-white/45">Choose a file from your computer. It uploads to Supabase Storage automatically.</span>
      <input
        type="file"
        accept={accept}
        disabled={uploading}
        className="sr-only"
        onChange={(event) => {
          onChange(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
    </label>
  );
}

function RecordList({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 border-t border-white/10 pt-5">{children}</div>;
}

function RecordRow({ title, subtitle, featured, onDelete }: { title: string; subtitle: string | null; featured: boolean; onDelete: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="min-w-0">
        <p className="font-medium text-white">{title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-white/55">{subtitle}</p>
        {featured && <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#D4AF37]">Featured / Published</p>}
      </div>
      <button type="button" onClick={onDelete} className="text-white/45 hover:text-red-300" aria-label={`Delete ${title}`}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function EditableGalleryRow({
  item,
  onSave,
  onDelete,
}: {
  item: GalleryItem;
  onSave: (item: GalleryItem, title: string, category: string) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category ?? "Gallery");

  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Display Title" value={title} onChange={setTitle} />
        <Input label="Category" value={category} onChange={setCategory} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-white/45">{item.item_type}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => onSave(item, title, category)} className="secondary-button">
            <Save size={16} />
            Save
          </button>
          <button type="button" onClick={onDelete} className="secondary-button text-red-200">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditableReelRow({
  reel,
  onSave,
  onDelete,
}: {
  reel: VideoReel;
  onSave: (reel: VideoReel, title: string, caption: string) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(reel.title);
  const [caption, setCaption] = useState(reel.caption ?? "Wedding Reel");

  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Display Title" value={title} onChange={setTitle} />
        <Input label="Caption" value={caption} onChange={setCaption} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {reel.is_active && <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">Active</p>}
        <div className="flex gap-2">
          <button type="button" onClick={() => onSave(reel, title, caption)} className="secondary-button">
            <Save size={16} />
            Save
          </button>
          <button type="button" onClick={onDelete} className="secondary-button text-red-200">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
