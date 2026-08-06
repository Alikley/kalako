import { NextRequest, NextResponse } from "next/server";

const BOT_API = process.env.BOT_API_URL || "http://localhost:3001";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const imagePath = pathSegments.join("/");
    const res = await fetch(`${BOT_API}/api/image/${imagePath}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return new NextResponse("Not found", { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Bot unavailable", { status: 503 });
  }
}
