export default function SkeletonLoading() {
  return (
    <div className="space-y-4 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-5 rounded-2xl animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
          <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="space-y-2">
            <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
