"use client";

import {
  CalendarDays,
  ChevronDown,
  Crown,
  ExternalLink,
  Gem,
  Globe,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  Share2,
  Sparkles,
  Star,
  Video,
} from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ContactForm } from "@/components/marketing/contact-form";
import { LuxuryLoader } from "@/components/marketing/luxury-loader";
import { Navbar } from "@/components/marketing/navbar";
import { demos as fallbackDemos, faqs as fallbackFaqs, features, gallery as fallbackGallery, stats, testimonials as fallbackTestimonials } from "@/lib/data";
import { siteConfig } from "@/lib/constants";
import { cn, formatDate, whatsappLink } from "@/lib/utils";
import type { PublicContent } from "@/lib/public-content";

const iconMap = [Heart, CalendarDays, MapPin, Gem, Sparkles, Crown, Share2, Globe, MessageCircle, Video, Gem, Star];
const AudioPlayer = dynamic(
  () => import("@/components/marketing/audio-player").then((mod) => mod.AudioPlayer),
  { ssr: false },
);

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" },
} as const;

export function LandingPage({ content }: { content?: PublicContent }) {
  const [faqQuery, setFaqQuery] = useState("");
  const [activeGallery, setActiveGallery] = useState<string | null>(null);
  const liveSettings = content?.settings;
  const liveDemos = content?.demos.length ? content.demos : fallbackDemos;
  const liveGallery = content?.gallery.length ? content.gallery : fallbackGallery;
  const liveReels = content?.reels.length ? content.reels : liveGallery.slice(0, 5);
  const liveTestimonials = content?.testimonials.length ? content.testimonials : fallbackTestimonials;
  const liveFaqs = content?.faqs.length ? content.faqs : fallbackFaqs;
  const liveBlogs = content?.blogs ?? [];
  const liveSocials = content?.socialLinks ?? [];
  const brandDescription = liveSettings?.description ?? siteConfig.description;
  const heroVideo = liveSettings?.hero_video_url ?? siteConfig.heroVideo;
  const heroImage = liveSettings?.seo?.hero_image_url;
  const heroMediaType = liveSettings?.seo?.hero_media_type ?? "video";
  const musicUrl = liveSettings?.background_music_url ?? siteConfig.backgroundMusic;

  const filteredFaqs = useMemo(
    () =>
      liveFaqs.filter((faq) =>
        `${faq.question} ${faq.answer}`.toLowerCase().includes(faqQuery.toLowerCase()),
      ),
    [faqQuery, liveFaqs],
  );

  const activeGalleryItem = [...liveGallery, ...liveReels].find((item) => item.id === activeGallery);

  return (
    <>
      <LuxuryLoader />
      <Navbar />
      <AudioPlayer musicUrl={musicUrl} />
      <a
        href={whatsappLink(siteConfig.whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp Wedify"
        className="fixed bottom-5 right-4 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/25 transition hover:scale-105"
      >
        <MessageCircle size={24} />
      </a>

      <main className="overflow-hidden bg-[#050505] text-white">
        <section id="home" className="relative min-h-screen overflow-hidden">
          {heroMediaType === "image" && heroImage ? (
            <img
              className="absolute inset-0 h-full w-full object-cover opacity-40"
              src={heroImage}
              alt="Wedify luxury event hero"
            />
          ) : (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-40"
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              poster={heroImage ?? "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop"}
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.96),rgba(5,5,5,0.62),rgba(5,5,5,0.88))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_28%,rgba(212,175,55,0.18),transparent_34%)]" />
          <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
            <motion.div {...reveal} className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#E8C76A] backdrop-blur-xl">
                <Crown size={15} />
                {siteConfig.tagline}
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] text-white sm:text-6xl lg:text-7xl">
                Luxury Wedding Websites That Tell Your Story
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#BDBDBD] sm:text-lg">
                {brandDescription}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-7 text-sm font-semibold text-black transition hover:bg-[#E8C76A]" href="#demos">
                  <ExternalLink size={17} />
                  View Demos
                </a>
                <a className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-semibold text-white backdrop-blur transition hover:border-[#D4AF37]/60 hover:text-[#E8C76A]" href={whatsappLink(siteConfig.whatsappMessage)} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} />
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Section className="-mt-16">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <motion.div key={item} {...reveal} className="rounded-lg border border-white/10 bg-[#111111]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <Sparkles className="mb-5 text-[#D4AF37]" size={20} />
                <p className="text-lg font-medium text-white">{item}</p>
                <p className="mt-2 text-sm leading-6 text-white/54">Editable homepage highlight for luxury event website packages.</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="features" eyebrow="Platform Features" title="Built for complete digital event experiences">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = iconMap[index % iconMap.length];
              return (
                <motion.div key={feature} {...reveal} className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-[#D4AF37]/45 hover:bg-[#D4AF37]/[0.06]">
                  <Icon size={21} className="text-[#E8C76A]" />
                  <h3 className="mt-5 text-base font-medium text-white">{feature}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#BDBDBD]">Admin-editable module ready for premium event websites and future categories.</p>
                </motion.div>
              );
            })}
          </div>
        </Section>

        <Section id="demos" eyebrow="Demo Websites" title="Five launch demos, unlimited future collections">
          <div className="grid gap-5 lg:grid-cols-3">
            {liveDemos.map((demo, index) => (
              <motion.a
                key={demo.id}
                {...reveal}
                href={demo.demoUrl}
                target="_blank"
                rel="noreferrer"
                className={cn("group overflow-hidden rounded-lg border border-white/10 bg-[#111111] transition hover:-translate-y-1 hover:border-[#D4AF37]/50", index === 0 && "lg:col-span-2")}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={demo.coverImage} alt={demo.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/12 to-transparent" />
                  {demo.featured && <span className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-semibold text-black">Featured</span>}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">{demo.category}</p>
                  <h3 className="mt-2 flex items-center justify-between text-xl font-semibold text-white">
                    {demo.title}
                    <ExternalLink size={18} className="text-white/45 group-hover:text-[#E8C76A]" />
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#BDBDBD]">{demo.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </Section>

        <Section id="gallery" eyebrow="Gallery" title="Screenshots, mockups, previews, projects, and videos">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {liveGallery.map((item, index) => (
              <motion.button
                key={item.id}
                {...reveal}
                type="button"
                onClick={() => setActiveGallery(item.id)}
                className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-lg border border-white/10 bg-[#111111] text-left"
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={cn("w-full object-cover transition duration-700 group-hover:scale-105", index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]")}
                  />
                ) : (
                  <img loading="lazy" src={item.src} alt={item.title} className={cn("w-full object-cover transition duration-700 group-hover:scale-105", index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]")} />
                )}
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">{item.category}</p>
                  <p className="mt-2 text-sm text-white">{item.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </Section>

        <Section eyebrow="Wedding Reel Showcase" title="Short-form reels for cinematic event storytelling">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {liveReels.map((item) => (
              <motion.button
                key={`reel-${item.id}`}
                {...reveal}
                type="button"
                onClick={() => setActiveGallery(item.id)}
                className="group relative h-[520px] min-w-[280px] overflow-hidden rounded-lg border border-white/10 bg-[#111111] text-left"
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
                  />
                ) : (
                  <img loading="lazy" src={item.src} alt={item.title} className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Video className="mb-3 text-[#E8C76A]" />
                  <p className="text-sm font-medium text-white">{item.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </Section>

        <Section eyebrow="About Wedify" title="Traditional invitations, transformed into beautiful digital experiences">
          <motion.div {...reveal} className="max-w-4xl rounded-lg border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="text-lg leading-8 text-[#BDBDBD]">
              Wedify creates premium wedding websites that transform traditional invitations into beautiful digital experiences. Every event page can carry RSVP flows, timelines, music, reels, galleries, maps, guest wishes, and shareable invite moments in a polished royal dark interface.
            </p>
            <p className="mt-5 text-base leading-7 text-white/58">
              The platform is structured around categories and reusable content modules, so the same foundation can support engagements, receptions, anniversaries, birthdays, baby showers, and corporate events.
            </p>
          </motion.div>
        </Section>

        <Section id="testimonials" eyebrow="Testimonials" title="Client words, styled with restraint">
          <div className="grid gap-4 md:grid-cols-3">
            {liveTestimonials.map((testimonial) => (
              <motion.article key={testimonial.id} {...reveal} className="rounded-lg border border-white/10 bg-[#111111] p-6">
                <div className="mb-6 flex gap-1 text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" />)}
                </div>
                <p className="text-base leading-7 text-white/82">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-6 font-medium text-white">{testimonial.name}</p>
                <p className="mt-1 text-sm text-[#BDBDBD]">{testimonial.event}</p>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="faq" eyebrow="FAQ" title="Searchable answers with AI-suggestion support in admin">
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4">
            <Search size={18} className="text-white/45" />
            <input
              value={faqQuery}
              onChange={(event) => setFaqQuery(event.target.value)}
              placeholder="Search questions"
              className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>
          <div className="grid gap-3">
            {filteredFaqs.map((faq) => (
              <details key={faq.id} className="group rounded-lg border border-white/10 bg-[#111111] px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white">
                  {faq.question}
                  <ChevronDown size={18} className="shrink-0 text-[#E8C76A] transition group-open:rotate-180" />
                </summary>
                <p className="pt-4 text-sm leading-7 text-[#BDBDBD]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="blog" eyebrow="Blog" title="SEO-ready editorial system">
          <div className="grid gap-5 md:grid-cols-2">
            {liveBlogs.map((post) => (
              <motion.a key={post.slug} {...reveal} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-lg border border-white/10 bg-[#111111] transition hover:border-[#D4AF37]/50">
                <img src={post.image} alt={post.title} className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">{post.category} / {formatDate(post.date)}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{post.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#BDBDBD]">{post.excerpt}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Start a premium event website enquiry">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
            <motion.div {...reveal} className="rounded-lg border border-white/10 bg-[#111111] p-6">
              <BrandMark />
              <p className="mt-8 text-lg leading-8 text-[#BDBDBD]">{brandDescription}</p>
              <div className="mt-8 grid gap-3 text-sm text-white/70">
                <a href={whatsappLink(siteConfig.whatsappMessage)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-[#E8C76A]">
                  <MessageCircle size={18} />
                  WhatsApp {siteConfig.whatsapp}
                </a>
                {liveSocials.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-[#E8C76A]">
                    <Share2 size={18} />
                    {link.platform}
                  </a>
                ))}
              </div>
            </motion.div>
            <motion.div {...reveal} className="rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <ContactForm />
            </motion.div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-white/10 bg-[#050505] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_0.8fr_0.6fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-md text-sm leading-6 text-[#BDBDBD]">{brandDescription}</p>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium text-white">Quick Links</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/62">
              {["Home", "Features", "Demo Websites", "Gallery", "Testimonials", "FAQ", "Blog", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(" websites", "s").replace(" ", "-")}`} className="hover:text-[#E8C76A]">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium text-white">Social</p>
            <div className="flex gap-3">
              {liveSocials.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform} className="grid size-10 place-items-center rounded-full border border-white/10 hover:border-[#D4AF37]/60 hover:text-[#E8C76A]">
                  <Share2 size={18} />
                </a>
              ))}
              <a href={whatsappLink(siteConfig.whatsappMessage)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full border border-white/10 hover:border-[#D4AF37]/60 hover:text-[#E8C76A]">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/48 sm:flex-row">
          <p>Copyright 2026 Wedify. All rights reserved.</p>
          <p>Crafted with love by Wedify</p>
        </div>
      </footer>

      {activeGalleryItem && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/88 p-4 backdrop-blur-xl" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setActiveGallery(null)} className="absolute right-5 top-5 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:text-[#E8C76A]">
            Close
          </button>
          {activeGalleryItem.type === "video" ? (
            <video
              src={activeGalleryItem.src}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-h-[82vh] w-full max-w-5xl rounded-lg object-contain"
            />
          ) : (
            <img src={activeGalleryItem.src} alt={activeGalleryItem.title} className="max-h-[82vh] w-full max-w-5xl rounded-lg object-contain" />
          )}
        </div>
      )}
    </>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title) && (
          <motion.div {...reveal} className="mb-9 max-w-3xl">
            {eyebrow && <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#D4AF37]">{eyebrow}</p>}
            {title && <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{title}</h2>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
