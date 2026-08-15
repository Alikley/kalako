"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "../components/edit/ProfileForm";

export default function EditPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kalako-cream">
        <div className="w-8 h-8 border-3 border-kalako-navy/20 border-t-kalako-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-kalako-cream py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-kalako-slate-200/60 p-6 sm:p-8">
          <h1 className="text-xl font-bold text-kalako-navy mb-1">
            {"ویرایش پروفایل"}
          </h1>
          <p className="text-sm text-kalako-slate-500 mb-6">
            {"اطلاعات خود را ویرایش کنید"}
          </p>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
