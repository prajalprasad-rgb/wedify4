export type EventCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type DemoWebsite = {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  demoUrl: string;
  featured: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  type: "image" | "video";
  src: string;
  category: string;
  poster?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  event: string;
  quote: string;
  featured: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  tags: string[];
  published: boolean;
  body?: string;
};
