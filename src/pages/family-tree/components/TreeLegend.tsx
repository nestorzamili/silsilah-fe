import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export function TreeLegend() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute left-4 top-4 z-10 rounded-lg bg-white/80 shadow-lg overflow-hidden backdrop-blur-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:bg-white/50 transition-colors"
      >
        <span>Legenda</span>
        {isExpanded ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded border-2 border-blue-500 bg-blue-100" />
            <span className="text-slate-700">Laki-laki</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded border-2 border-pink-500 bg-pink-100" />
            <span className="text-slate-700">Perempuan</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 4">
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
            <svg className="h-4 w-4" viewBox="0 0 24 4">
              <line
                x1="0"
                y1="2"
                x2="24"
                y2="2"
                stroke="#fb7185"
                strokeWidth="2"
              />
            </svg>
            <span className="text-slate-700">Pasangan</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 4">
              <line
                x1="0"
                y1="2"
                x2="24"
                y2="2"
                stroke="#eab308"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            </svg>
            <span className="text-slate-700">Pasangan ke-2+</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 4">
              <line
                x1="0"
                y1="2"
                x2="24"
                y2="2"
                stroke="#eab308"
                strokeWidth="2"
              />
            </svg>
            <span className="text-slate-700">Anak dari pasangan ke-2+</span>
          </div>
        </div>
      )}
    </div>
  );
}
