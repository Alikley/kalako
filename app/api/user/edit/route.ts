import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "وارد نشده‌اید" }, { status: 401 });
    }

    const userId = (session.user as any).userId;
    if (!userId) {
      return NextResponse.json({ error: "شناسه کاربر یافت نشد" }, { status: 401 });
    }

    const body = await request.json();
    const { name, lastName, email, phone, address, postalCode } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "نام و ایمیل الزامی است" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: String(name),
        lastName: lastName ? String(lastName) : "",
        email: String(email),
        phone: phone ? String(phone) : "",
        address: address ? String(address) : "",
        postalCode: postalCode ? String(postalCode) : "",
      },
    });

    return NextResponse.json({
      message: "اطلاعات با موفقیت ذخیره شد",
      user: {
        name: updatedUser.name,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        postalCode: updatedUser.postalCode,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "این ایمیل قبلا ثبت شده است" }, { status: 409 });
    }
    return NextResponse.json({ error: "خطا در سرور" }, { status: 500 });
  }
}
