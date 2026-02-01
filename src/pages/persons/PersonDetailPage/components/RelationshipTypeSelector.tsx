import { LinkIcon } from '@heroicons/react/24/outline';
import type { RelationshipType } from '@/types';

interface RelationshipTypeSelectorProps {
  currentType: RelationshipType;
  personName: string;
  onTypeChange: (type: RelationshipType) => void;
}

export function RelationshipTypeSelector({
  currentType,
  personName,
  onTypeChange,
}: RelationshipTypeSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700 mb-3">Jenis Hubungan</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onTypeChange('PARENT')}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
            currentType === 'PARENT'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div
            className={`rounded-full p-2 ${
              currentType === 'PARENT' ? 'bg-emerald-100' : 'bg-slate-100'
            }`}
          >
            <LinkIcon className="h-5 w-5" />
          </div>
          <span className="font-semibold">Orang Tua</span>
          <span className="text-center text-xs text-slate-500">
            {personName} adalah anak
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTypeChange('SPOUSE')}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
            currentType === 'SPOUSE'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div
            className={`rounded-full p-2 ${
              currentType === 'SPOUSE' ? 'bg-emerald-100' : 'bg-slate-100'
            }`}
          >
            <LinkIcon className="h-5 w-5" />
          </div>
          <span className="font-semibold">Pasangan</span>
          <span className="text-center text-xs text-slate-500">
            {personName} menikah
          </span>
        </button>
      </div>
    </div>
  );
}
