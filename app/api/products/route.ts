import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const brand = searchParams.get("brand");
  const discount = searchParams.get("discount");

  try {
    const botUrl = process.env.BOT_API_URL || "http://localhost:3001";
    const res = await fetch(`${botUrl}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Bot API error");
    const data = await res.json();
    let results = data.products || [];

    if (discount === "true") results = results.filter((p: any) => p.discount);
    if (cat) results = results.filter((p: any) => p.title?.includes(cat));
    if (brand)
      results = results.filter(
        (p: any) =>
          p.channelTitle?.includes(brand) || p.channelId?.includes(brand),
      );

    return NextResponse.json({ products: results, total: results.length });
  } catch {
    return NextResponse.json({ products: [], total: 0 });
  }
}
