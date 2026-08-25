import { NextResponse } from "next/server";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:3001";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ channelId: string; postId: string }> }
) {
  try {
    // v1.0.0.8: در Next.js 15 باید params await بشه (رفع ارور sync-dynamic-apis)
    const { channelId, postId } = await params;
    const url = `${BOT_URL}/api/image/${channelId}/${postId}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(30000), // v4.10: 30s timeout for images
    });

    if (!res.ok) {
      return new NextResponse("Not found", { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Error fetching image", { status: 500 });
  }
}