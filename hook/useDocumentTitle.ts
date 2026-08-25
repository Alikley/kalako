"use client";

import { useEffect } from "react";

/**
 * v1.0.0.7: عنوان داینامیک صفحه (document.title)
 *
 * رفتار:
 *  - حالت دیفالت: فقط اسم سایت → «کالاکو»
 *  - هر صفحه/رفتار کاربر می‌تونه عنوان خودش رو بده (مثلاً هنگام سرچ)
 *  - وقتی کامپوننت unmount بشه یا title خالی/ null باشه، برمی‌گرده به دیفالت
 *
 * چون همه صفحات سایت کلاینت‌کامپوننت هستن ("use client")،
 * metadata استاتیک Next.js فقط در layout تعریف می‌شه و تغییرات
 * لحظه‌ای (مثل سرچ) باید از طریق document.title انجام بشه.
 */
export const SITE_NAME = "کالاکو";

export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    document.title = title && title.trim().length > 0 ? title : SITE_NAME;

    // وقتی کامپوننت از صفحه خارج شد، عنوان به حالت دیفالت برگرده
    return () => {
      document.title = SITE_NAME;
    };
  }, [title]);
}
