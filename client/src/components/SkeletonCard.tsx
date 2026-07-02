/**
 * 骨架屏组件
 * 在数据加载时显示占位动画
 */
export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-slate-800 rounded-xl overflow-hidden">
      <div className="aspect-[3/4] bg-slate-700" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-700 rounded w-1/2" />
        <div className="flex gap-1">
          <div className="h-5 bg-slate-700 rounded-full w-12" />
          <div className="h-5 bg-slate-700 rounded-full w-10" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
