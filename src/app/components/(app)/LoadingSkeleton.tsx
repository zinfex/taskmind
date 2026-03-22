export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="flex h-[74px] items-center justify-between gap-4 rounded-xl border border-slate-800/50 bg-slate-900/20 p-4 animate-pulse"
        >
          <div className="flex flex-1 items-center gap-4">
            <div className="h-6 w-6 rounded-full bg-slate-800" />
            <div className="h-4 w-48 rounded bg-slate-800" />
          </div>
          <div className="h-8 w-8 rounded-lg bg-slate-800" />
        </div>
      ))}
    </div>
  );
}