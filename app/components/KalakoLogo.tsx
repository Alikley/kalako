import React from "react";

/**
 * لوگوی کالاکو — حرف K داخل ذره‌بین + برچسب قیمت
 * رنگ‌ها: Navy (#1E293B)، Orange (#F59E0B)، Red (#EF4444)
 */
export function KalakoLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* آیکون لوگو */}
      <svg
        width="52"
        height="52"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* دایره ذره‌بین */}
        <circle
          cx="42"
          cy="42"
          r="30"
          stroke="#1E293B"
          strokeWidth="5"
          fill="none"
        />
        {/* دسته ذره‌بین */}
        <line
          x1="64"
          y1="64"
          x2="82"
          y2="82"
          stroke="#1E293B"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* حرف K — خط عمودی (Navy) */}
        <line
          x1="28"
          y1="22"
          x2="28"
          y2="62"
          stroke="#1E293B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* حرف K — خط مورب بالا (Orange) */}
        <line
          x1="30"
          y1="38"
          x2="52"
          y2="22"
          stroke="#F59E0B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* حرف K — خط مورب پایین (Red → برچسب قیمت) */}
        <line
          x1="30"
          y1="42"
          x2="52"
          y2="62"
          stroke="#EF4444"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* سوراخ برچسب قیمت */}
        <circle cx="52" cy="56" r="2.5" fill="#FFFFFF" />
      </svg>

      {/* نام برند */}
      <span className="text-2xl font-black tracking-[0.2em] text-kalako-navy select-none">
        KALAKO
      </span>
    </div>
  );
}
