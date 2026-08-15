"use client";

import React from "react";

interface FormStatusProps {
  status: { type: "success" | "error"; message: string } | null;
}

export function FormStatus({ status }: FormStatusProps) {
  if (!status) return null;

  return (
    <div
      className={`px-4 py-3 rounded-xl text-sm ${
        status.type === "success"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-kalako-red border border-red-200"
      }`}
    >
      {status.message}
    </div>
  );
}
