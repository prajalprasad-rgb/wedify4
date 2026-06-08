import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  eventType: z.string().min(2),
  eventDate: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  const payload = leadSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid lead payload" }, { status: 400 });
  }

  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    return NextResponse.json({ ok: true, mode: "preview" });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name: payload.data.name,
    phone: payload.data.phone,
    email: payload.data.email,
    event_type: payload.data.eventType,
    event_date: payload.data.eventDate,
    message: payload.data.message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
