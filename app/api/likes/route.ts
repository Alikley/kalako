import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/likes → لیست productId‌های لایک‌شده کاربر
 * POST /api/likes { productId } → لایک/آنلایک (toggle)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ likes: [] });
    }

    const userId = (session.user as any).userId;
    const likes = await db.like.findMany({
      where: { userId },
      select: { productId: true },
    });

    return NextResponse.json({
      likes: likes.map((l) => l.productId),
    });
  } catch (e: any) {
    console.error("Likes GET error:", e);
    return NextResponse.json({ likes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId الزامی است" }, { status: 400 });
    }

    const userId = (session.user as any).userId;

    // چک وجود — اگر هست حذف کن (آنلایک)، اگر نبود بساز (لایک)
    const existing = await db.like.findUnique({
      where: {
        uniq_user_product: { userId, productId },
      },
    });

    if (existing) {
      await db.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false, productId });
    } else {
      await db.like.create({
        data: { userId, productId },
      });
      return NextResponse.json({ liked: true, productId });
    }
  } catch (e: any) {
    console.error("Likes POST error:", e);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
