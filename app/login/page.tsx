"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface LoginForm { email: string; password: string; }

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    await signIn("credentials", { email: data.email, password: data.password, callbackUrl: "/" });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-kalako-cream px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-kalako-orange/10 rounded-full flex items-center justify-center mb-3">
              <svg className="w-10 h-10 text-kalako-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-kalako-navy">ورود به کالاکو</h1>
            <p className="text-sm text-kalako-slate-500 mt-1">خوش اومدی!</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <input {...register("email", { required: "ایمیل الزامی است" })} type="email" placeholder="ایمیل" className="w-full px-4 py-3 bg-kalako-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-kalako-orange/30 transition" dir="ltr" />
              {errors.email && <p className="text-kalako-red text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register("password", { required: "رمز عبور الزامی است", minLength: { value: 6, message: "حداقل ۶ کاراکتر" } })} type="password" placeholder="رمز عبور" className="w-full px-4 py-3 bg-kalako-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-kalako-orange/30 transition" dir="ltr" />
              {errors.password && <p className="text-kalako-red text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" className="w-full bg-kalako-navy text-white py-3 rounded-xl font-medium text-sm hover:bg-kalako-navy-light transition-colors">ورود</button>
          </form>
          <p className="text-center text-sm text-kalako-slate-500 mt-4">
            حساب نداری؟ <Link href="/register" className="text-kalako-orange font-medium hover:underline">ثبت‌نام</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
