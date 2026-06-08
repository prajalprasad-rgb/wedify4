import { notFound } from "next/navigation";
import { demos } from "@/lib/data";
import { siteConfig } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

type DemoPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const demo = demos.find((item) => item.id === slug);

  if (!demo) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-20 text-center">
        <img src={demo.coverImage} alt={demo.title} className="absolute inset-0 h-full w-full object-cover opacity-38" />
        <div className="absolute inset-0 bg-black/72" />
        <div className="relative max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">{demo.category}</p>
          <h1 className="mt-5 text-5xl font-semibold sm:text-7xl">{demo.title}</h1>
          <p className="mt-6 text-lg leading-8 text-[#BDBDBD]">{demo.description}</p>
          <a href={whatsappLink(siteConfig.whatsappMessage)} target="_blank" rel="noreferrer" className="mt-9 inline-flex rounded-full bg-[#D4AF37] px-7 py-4 text-sm font-semibold text-black hover:bg-[#E8C76A]">
            Create a website like this
          </a>
        </div>
      </section>
    </main>
  );
}
