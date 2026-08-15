"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  dir?: string;
}

export function FormInput({ label, type = "text", placeholder, register, error, dir = "rtl" }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-kalako-navy">{label}</label>
      <input
        type={type}
        dir={dir}
        placeholder={placeholder}
        {...register}
        className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none ${
          error
            ? "border-kalako-red bg-red-50/50 focus:border-kalako-red"
            : "border-kalako-slate-200 bg-white focus:border-kalako-navy focus:ring-1 focus:ring-kalako-navy/20"
        } text-kalako-navy placeholder:text-kalako-slate-400`}
      />
      {error && <p className="text-xs text-kalako-red">{error}</p>}
    </div>
  );
}
