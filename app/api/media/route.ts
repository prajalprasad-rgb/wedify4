import { NextResponse } from "next/server";

const allowedHosts = new Set([
  "wghphzmuqnkkeworgqga.supabase.co",
]);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const rawUrl = requestUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing media URL" }, { status: 400 });
  }

  let mediaUrl: URL;
  try {
    mediaUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid media URL" }, { status: 400 });
  }

  if (!allowedHosts.has(mediaUrl.hostname) || !mediaUrl.pathname.includes("/storage/v1/object/public/")) {
    return NextResponse.json({ error: "Media URL is not allowed" }, { status: 403 });
  }

  const upstream = await fetch(mediaUrl, {
    headers: {
      ...(request.headers.get("range") ? { Range: request.headers.get("range")! } : {}),
    },
  });

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json({ error: "Media could not be loaded" }, { status: upstream.status });
  }

  const headers = new Headers();
  const passthroughHeaders = [
    "accept-ranges",
    "content-length",
    "content-range",
    "content-type",
  ];

  passthroughHeaders.forEach((name) => {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  });

  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
