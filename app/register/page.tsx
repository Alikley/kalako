"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface RegForm { name: string; email: string; password: string; }

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegForm>();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: RegForm) => {
    setServerError("");
    setLoading(true);

    try {
      // ثبت‌نام
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "خطا در ثبت‌نام");
        setLoading(false);
        return;
      }

      // بعد ثبت‌نام، خودکار لاگین کن
      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      setLoading(false);

      if (loginResult?.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      setServerError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-kalako-cream px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-kalako-orange/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-10 h-10 text-kalako-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-kalako-navy">ثبت‌نام در کالاکو</h1>
            <p className="text-sm text-kalako-slate-500 mt-1">یک حساب جدید بساز</p>
          </div>
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4">
              <p className="text-kalako-red text-sm text-center">{serverError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <input
                {...register("name", { required: "نام الزامی است" })}
                placeholder="نام و نام خانوادگی"
                className="w-full px-4 py-3 bg-kalako-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-kalako-orange/30 transition"
              />
              {errors.name && <p className="text-kalako-red text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register("email", { required: "ایمیل الزامی است" })}
                type="email"
                placeholder="ایمیل"
                className="w-full px-4 py-3 bg-kalako-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-kalako-orange/30 transition"
                dir="ltr"
              />
              {errors.email && <p className="text-kalako-red text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input
                {...register("password", { required: "رمز عبور الزامی است", minLength: { value: 6, message: "حداقل ۶ کاراکتر" } })}
                type="password"
                placeholder="رمز عبور"
                className="w-full px-4 py-3 bg-kalako-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-kalako-orange/30 transition"
                dir="ltr"
              />
              {errors.password && <p className="text-kalako-red text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kalako-orange text-kalako-navy py-3 rounded-xl font-bold text-sm hover:bg-kalako-orange-hover transition-colors disabled:opacity-50"
            >
              {loading ? "لطفا صبر کنید..." : "ثبت‌نام"}
            </button>
          </form>
          <p className="text-center text-sm text-kalako-slate-500 mt-4">
            حساب داری؟ <Link href="/login" className="text-kalako-orange font-medium hover:underline">ورود</Link>
          </p>
        </div>
      </div>
    </div>
  );
}