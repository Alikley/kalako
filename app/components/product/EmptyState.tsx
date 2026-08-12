interface EmptyStateProps {
  title: string;
  description?: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  icon: "warning" | "search";
  showBotStatus?: React.ReactNode;
}

export function EmptyState({ title, description, hint, actionLabel, onAction, secondaryLabel, onSecondary, icon, showBotStatus }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
      {showBotStatus}
      <svg
        className="w-16 h-16 text-kalako-slate-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={
            icon === "warning"
              ? "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          }
        />
      </svg>
      <p className="text-kalako-slate-500 text-sm mb-2">{title}</p>
      {description && <p className="text-kalako-slate-400 text-xs mt-1">{description}</p>}
      {hint && <p className="text-kalako-slate-400 text-xs mt-1 max-w-md">{hint}</p>}
      <div className="flex gap-3 mt-4">
        {actionLabel && onAction && (
          <button onClick={onAction} className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium">
            {actionLabel}
          </button>
        )}
        {secondaryLabel && onSecondary && (
          <button onClick={onSecondary} className="text-kalako-navy hover:text-kalako-navy-light text-sm font-medium">
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
