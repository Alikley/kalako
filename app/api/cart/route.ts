import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/cart → آیتم‌های سبد خرید کاربر
 * POST /api/cart { product } → افزودن به سبد
 * DELETE /api/cart?id=productId → حذف یک آیتم
 * DELETE /api/cart?action=clear → پاک کردن کل سبد
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ cart: [] });
    }

    const userId = (session.user as any).userId;
    const items = await db.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      cart: items.map((item) => ({
        id: item.productId,
        title: item.title,
        price: item.price,
        oldPrice: item.oldPrice,
        image: item.image,
        channel: item.channel,
        link: item.link,
      })),
    });
  } catch (e: any) {
    console.error("Cart GET error:", e);
    return NextResponse.json({ cart: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
    }

    const product = await req.json();
    if (!product?.id) {
      return NextResponse.json({ error: "داده نامعتبر" }, { status: 400 });
    }

    const userId = (session.user as any).userId;

    // اگه از قبل هست، دوباره اضافه نکن
    const existing = await db.cartItem.findUnique({
      where: { uniq_user_cart_product: { userId, productId: product.id } },
    });

    if (existing) {
      return NextResponse.json({ message: "قبلا در سبد هست" });
    }

    await db.cartItem.create({
      data: {
        userId,
        productId: product.id,
        title: product.title || "",
        price: product.price != null ? Number(product.price) : null,
        oldPrice: product.oldPrice != null ? Number(product.oldPrice) : null,
        image: product.image || "",
        channel: product.channel || "",
        link: product.link || null,
      },
    });

    return NextResponse.json({ message: "افزوده شد" });
  } catch (e: any) {
    console.error("Cart POST error:", e);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
    }

    const userId = (session.user as any).userId;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "clear") {
      await db.cartItem.deleteMany({ where: { userId } });
      return NextResponse.json({ message: "سبد پاک شد" });
    }

    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json({ error: "id الزامی است" }, { status: 400 });
    }

    await db.cartItem.deleteMany({
      where: { userId, productId },
    });

    return NextResponse.json({ message: "حذف شد" });
  } catch (e: any) {
    console.error("Cart DELETE error:", e);
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}
