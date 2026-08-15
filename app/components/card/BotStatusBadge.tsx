interface BotStatusMeta {
  connectionError?: boolean;
  searching?: boolean;
  botError?: string;
  botHint?: string;
  stale?: boolean;
}

export function BotStatusBadge({ meta }: { meta: BotStatusMeta | null }) {
  if (!meta) return null;

  if (meta.connectionError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-red-700 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="font-medium">{"ربات در دسترس نیست"}</span>
        </div>
        <p className="text-red-600 text-xs mt-1 mr-7">
          {"مطمئن شوید ربات clothes_bot روی پورت 3001 اجرا شده است"}
        </p>
      </div>
    );
  }

  if (meta.searching) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-amber-700 text-sm">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>{"در حال جستجو در کانال‌های تلگرام..."}</span>
        </div>
      </div>
    );
  }

  if (meta.botError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-amber-700 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{"خطا در جستجوی تلگرام"}</span>
        </div>
        <p className="text-amber-600 text-xs mt-1 mr-7">
          {meta.botError}
          {meta.botHint && ` — ${meta.botHint}`}
        </p>
      </div>
    );
  }

  if (meta.stale) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-blue-700 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{"نمایش نتایج کش شده — تلگرام در حال اتصال مجدد"}</span>
        </div>
      </div>
    );
  }

  return null;
}