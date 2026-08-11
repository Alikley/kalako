import { NextResponse } from "next/server";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:3001";

/**
 * v4.10: Bot status endpoint
 * Shows if the bot API is reachable and Telegram is connected
 */
export async function GET() {
  try {
    const res = await fetch(`${BOT_URL}/api/health`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      status: "error",
      telegram: false,
      error: "Bot API unreachable on port 3001",
    });
  }
}
