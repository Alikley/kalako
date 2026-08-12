export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] animate-pulse"
        >
          <div className="bg-[#F3F4F6] aspect-[3/4]" />
          <div className="p-4 flex flex-col gap-2.5">
            <div className="h-4 bg-kalako-slate-100 rounded w-full" />
            <div className="h-3 bg-kalako-slate-100 rounded w-2/3" />
            <div className="h-5 bg-kalako-slate-100 rounded w-1/2 mt-2" />
            <div className="h-9 bg-kalako-slate-100 rounded-xl mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
