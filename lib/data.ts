import type { BlogPost, DemoWebsite, EventCategory, Faq, GalleryItem, Testimonial } from "@/types/content";

export const eventCategories: EventCategory[] = [
  { id: "wedding", name: "Wedding Websites", slug: "wedding-websites", description: "Royal digital wedding experiences." },
  { id: "save-the-date", name: "Save The Date Websites", slug: "save-the-date-websites", description: "Elegant pre-invitation launches." },
  { id: "engagement", name: "Engagement Websites", slug: "engagement-websites", description: "Story-led engagement showcases." },
  { id: "reception", name: "Reception Websites", slug: "reception-websites", description: "Premium reception invitations." },
  { id: "birthday", name: "Birthday Websites", slug: "birthday-websites", description: "Celebration pages for milestone moments." },
  { id: "anniversary", name: "Anniversary Websites", slug: "anniversary-websites", description: "Timeless anniversary storytelling." },
  { id: "baby-shower", name: "Baby Shower Websites", slug: "baby-shower-websites", description: "Warm digital shower invitations." },
  { id: "corporate", name: "Corporate Event Websites", slug: "corporate-event-websites", description: "Polished event microsites for teams." },
];

export const stats = [
  "Premium Experiences",
  "Mobile Responsive",
  "Custom Domains",
  "RSVP Enabled",
];

export const features = [
  "Countdown Timer",
  "RSVP Collection",
  "Google Maps",
  "Photo Gallery",
  "Background Music",
  "Couple Story",
  "Event Timeline",
  "Guest Wishes",
  "WhatsApp Sharing",
  "QR Sharing",
  "Mobile Responsive",
  "Custom Domain",
  "Multi Event Support",
  "Save The Date",
  "Live Updates",
  "Video Embeds",
  "Digital Invitations",
];

export const demos: DemoWebsite[] = [
  {
    id: "royal-vows",
    title: "Royal Vows",
    category: "Wedding Websites",
    description: "A regal multi-event wedding website with RSVP, gallery, music, and maps.",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
    demoUrl: "/demo/royal-vows",
    featured: true,
  },
  {
    id: "nikah-noor",
    title: "Nikah Noor",
    category: "Wedding Websites",
    description: "An elegant Nikah experience with soft gold details and guest wishes.",
    coverImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1600&auto=format&fit=crop",
    demoUrl: "/demo/nikah-noor",
    featured: true,
  },
  {
    id: "sacred-promise",
    title: "Sacred Promise",
    category: "Wedding Websites",
    description: "A cinematic Hindu wedding website built for rich ceremony storytelling.",
    coverImage: "https://images.unsplash.com/photo-1587366780700-351d6b64db38?q=80&w=1600&auto=format&fit=crop",
    demoUrl: "/demo/sacred-promise",
    featured: false,
  },
  {
    id: "engaged-in-gold",
    title: "Engaged in Gold",
    category: "Engagement Websites",
    description: "A sleek engagement launch with countdown and shareable invite sections.",
    coverImage: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1600&auto=format&fit=crop",
    demoUrl: "/demo/engaged-in-gold",
    featured: false,
  },
  {
    id: "reception-noir",
    title: "Reception Noir",
    category: "Reception Websites",
    description: "A dark luxury reception page with reels, timeline, venue, and RSVP.",
    coverImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1600&auto=format&fit=crop",
    demoUrl: "/demo/reception-noir",
    featured: true,
  },
];

export const gallery: GalleryItem[] = [
  { id: "g1", title: "Desktop invitation preview", type: "image", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop", category: "Website Screenshot" },
  { id: "g2", title: "Mobile RSVP flow", type: "image", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop", category: "Mobile Mockup" },
  { id: "g3", title: "Luxury mandap preview", type: "image", src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1200&auto=format&fit=crop", category: "Wedding Preview" },
  { id: "g4", title: "Reception highlight", type: "image", src: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?q=80&w=1200&auto=format&fit=crop", category: "Client Project" },
  { id: "g5", title: "Invitation suite", type: "image", src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop", category: "Demo Image" },
  { id: "g6", title: "Wedding reel frame", type: "image", src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop", category: "Video" },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aisha & Rameez",
    event: "Nikah Website",
    quote: "Wedify made our invite feel personal, premium, and effortless for every guest.",
    featured: true,
  },
  {
    id: "t2",
    name: "Diya & Arjun",
    event: "Wedding Website",
    quote: "The RSVP and event timeline saved us hours while still feeling beautifully custom.",
    featured: true,
  },
  {
    id: "t3",
    name: "Meera & Joel",
    event: "Reception Website",
    quote: "Our families loved the music, gallery, and WhatsApp sharing. It felt truly royal.",
    featured: false,
  },
];

export const faqs: Faq[] = [
  {
    id: "f1",
    question: "Can Wedify create websites for events beyond weddings?",
    answer: "Yes. Wedify begins with premium wedding websites and is structured for save the date, engagement, reception, birthday, anniversary, baby shower, and corporate events.",
  },
  {
    id: "f2",
    question: "Can I use my own domain?",
    answer: "Yes. Custom domains can be connected, including branded domains and subdomains.",
  },
  {
    id: "f3",
    question: "Can guests RSVP through the website?",
    answer: "Yes. RSVP collection is supported and leads can be managed from the admin dashboard.",
  },
  {
    id: "f4",
    question: "Can videos, music, and photos be changed later?",
    answer: "Yes. Hero video, background music, reels, gallery images, demos, testimonials, FAQs, and site settings are all admin-editable.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "why-digital-wedding-invitations-feel-premium",
    title: "Why Digital Wedding Invitations Feel Premium",
    excerpt: "A luxury wedding website turns a traditional invitation into a living experience with RSVP, music, maps, and memories.",
    category: "Wedding Websites",
    date: "2026-06-08",
    image: "https://images.unsplash.com/photo-1509610973147-232dfea52a97?q=80&w=1600&auto=format&fit=crop",
    tags: ["digital invitations", "wedding website", "RSVP"],
    published: true,
  },
  {
    slug: "what-to-include-in-a-wedding-website",
    title: "What to Include in a Wedding Website",
    excerpt: "The sections that help guests move from excitement to action: story, schedule, venue, RSVP, gallery, and updates.",
    category: "Planning",
    date: "2026-06-08",
    image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=1600&auto=format&fit=crop",
    tags: ["planning", "guest experience"],
    published: true,
  },
];
