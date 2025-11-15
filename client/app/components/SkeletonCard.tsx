export default function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200">
      <div className="h-40 bg-slate-200 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 bg-slate-200 rounded animate-pulse w-5/6" />
        <div className="h-8 bg-slate-200 rounded animate-pulse w-32" />
      </div>
    </div>
  );
}

