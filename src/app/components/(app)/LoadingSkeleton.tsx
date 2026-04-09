export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="flex h-[74px] items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse"
        >
          <div className="flex flex-1 items-center gap-4">
            <div className="h-7 w-7 rounded-full bg-white/10 border border-white/10" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-48 rounded-full bg-white/10" />
              <div className="h-3 w-32 rounded-full bg-white/5" />
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/10" />
        </div>
      ))}
    </div>
  );
}
