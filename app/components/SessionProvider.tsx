"use client";

import { SessionProvider as Provider } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/hook/useStore";

/**
 * وقتی کاربر لاگین شد، لایک‌ها و سبد خرید رو از دیتابیس میخونه
 */
function DBSync() {
  const { data: session, status } = useSession();
  const syncFromDB = useStore((s) => s.syncFromDB);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = (session.user as any).userId;
      syncFromDB(userId);
    }
  }, [session?.user, status, syncFromDB]);

  return null;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <DBSync />
      {children}
    </Provider>
  );
}