"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { FormInput } from "./FormInput";
import { FormStatus } from "./FormStatus";

interface ProfileFormData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
}

export function ProfileForm() {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (session?.user) {
      reset({
        name: (session.user as any).name || "",
        lastName: (session.user as any).lastName || "",
        email: session.user.email || "",
        phone: (session.user as any).phone || "",
        address: (session.user as any).address || "",
        postalCode: (session.user as any).postalCode || "",
      });
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/user/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: result.message || "اطلاعات با موفقیت ذخیره شد" });
        await updateSession({
          name: data.name,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
          postalCode: data.postalCode,
        });
      } else {
        setStatus({ type: "error", message: result.error || "خطا در ذخیره اطلاعات" });
      }
    } catch {
      setStatus({ type: "error", message: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormInput
          label="نام"
          placeholder="مثلا: علی"
          register={register("name", { required: "نام الزامی است" })}
          error={errors.name?.message}
        />
        <FormInput
          label="نام خانوادگی"
          placeholder="مثلا: محمدی"
          register={register("lastName")}
          error={errors.lastName?.message}
        />
      </div>

      <FormInput
        label="ایمیل"
        type="email"
        dir="ltr"
        placeholder="example@email.com"
        register={register("email", {
          required: "ایمیل الزامی است",
        })}
        error={errors.email?.message}
      />

      <FormInput
        label="شماره تلفن"
        type="tel"
        dir="ltr"
        placeholder="09123456789"
        register={register("phone")}
        error={errors.phone?.message}
      />

      <FormInput
        label="آدرس"
        placeholder="آدرس کامل خود را وارد کنید"
        register={register("address")}
        error={errors.address?.message}
      />

      <FormInput
        label="کد پستی"
        type="text"
        dir="ltr"
        placeholder="1234567890"
        register={register("postalCode")}
        error={errors.postalCode?.message}
      />

      <FormStatus status={status} />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-kalako-navy text-white text-sm font-medium hover:bg-kalako-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? ("در حال ذخیره...") : ("ثبت")}
      </button>
    </form>
  );
}
