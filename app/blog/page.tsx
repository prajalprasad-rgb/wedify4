import { getPublishedBlogs } from "@/lib/public-content";

export const metadata = {
  title: "Blog",
  description: "Wedify insights on luxury digital invitations and event websites.",
};

export default async function BlogIndexPage() {
  const blogPosts = await getPublishedBlogs();

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">Wedify Blog</p>
        <h1 className="mt-3 text-4xl font-semibold">Luxury event website insights</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {blogPosts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="overflow-hidden rounded-lg border border-white/10 bg-[#111111] hover:border-[#D4AF37]/50">
              <img src={post.image} alt={post.title} className="aspect-[16/9] w-full object-cover" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#D4AF37]">{post.category}</p>
                <h2 className="mt-3 text-xl font-semibold">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#BDBDBD]">{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
