export function TreeLegend() {
  return (
    <div className="absolute left-4 top-4 z-10 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-lg">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        Legenda
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="h-3 w-3 rounded border-2 border-blue-500 bg-blue-100" />
        <span className="text-slate-700">Laki-laki</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="h-3 w-3 rounded border-2 border-pink-500 bg-pink-100" />
        <span className="text-slate-700">Perempuan</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 4">
          <line
            x1="0"
            y1="2"
            x2="24"
            y2="2"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <span className="text-slate-700">Orang tua - Anak</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <svg className="h-4 w-4 text-rose-400" viewBox="0 0 24 4">
          <line
            x1="0"
            y1="2"
            x2="24"
            y2="2"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <span className="text-slate-700">Pasangan</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 4">
          <line
            x1="0"
            y1="2"
            x2="24"
            y2="2"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        </svg>
        <span className="text-slate-700">Pasangan ke-2+</span>
      </div>
    </div>
  );
}
