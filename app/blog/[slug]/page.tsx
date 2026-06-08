import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/constants";
import { getPublishedBlog } from "@/lib/public-content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlog(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteConfig.url}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlog(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">{post.category}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[#BDBDBD]">{post.excerpt}</p>
        <img src={post.image} alt={post.title} className="mt-10 aspect-[16/9] rounded-lg object-cover" />
        <div className="mt-10 space-y-6 text-base leading-8 text-white/76">
          {(post.body || "A digital invitation becomes premium when it respects both emotion and utility. Guests should understand the story, schedule, venue, dress code, RSVP flow, and updates without searching through separate messages.")
            .split("\n")
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </div>
      </article>
    </main>
  );
}
