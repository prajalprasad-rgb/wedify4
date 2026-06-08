import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  title: z.string().min(4),
  category: z.string().optional(),
});

export async function POST(request: Request) {
  const payload = requestSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "A title is required" }, { status: 400 });
  }

  const { title, category = "Wedding Websites" } = payload.data;

  return NextResponse.json({
    title,
    category,
    draft: [
      `# ${title}`,
      "",
      "A premium event website should feel less like a static invitation and more like a living guest experience.",
      "",
      "## Why it matters",
      "Guests need clarity, emotion, and action in one place: story, schedule, venue, RSVP, gallery, and updates.",
      "",
      "## Wedify approach",
      "Wedify combines luxury visual design with practical event modules, so the invitation remains beautiful while still helping guests respond quickly.",
      "",
      "## Publishing notes",
      "Add client-specific examples, venue details, images, meta title, meta description, and internal links before publishing.",
    ].join("\n"),
  });
}
