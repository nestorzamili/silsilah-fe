import { Input } from '@/components/ui/input';

interface SpouseMetadataFormProps {
  marriageDate: string;
  marriagePlace: string;
  spouseOrder: string;
  onMarriageDateChange: (value: string) => void;
  onMarriagePlaceChange: (value: string) => void;
  onSpouseOrderChange: (value: string) => void;
}

export function SpouseMetadataForm({
  marriageDate,
  marriagePlace,
  spouseOrder,
  onMarriageDateChange,
  onMarriagePlaceChange,
  onSpouseOrderChange,
}: SpouseMetadataFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="marriageDate" className="text-sm font-medium text-slate-700">
          Tanggal Menikah (Opsional)
        </label>
        <Input
          id="marriageDate"
          type="date"
          value={marriageDate}
          onChange={(e) => onMarriageDateChange(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="marriagePlace" className="text-sm font-medium text-slate-700">
          Tempat Menikah (Opsional)
        </label>
        <Input
          id="marriagePlace"
          type="text"
          value={marriagePlace}
          onChange={(e) => onMarriagePlaceChange(e.target.value)}
          placeholder="Contoh: Jakarta"
        />
      </div>

      <div>
        <label htmlFor="spouseOrder" className="text-sm font-medium text-slate-700">
          Urutan Pernikahan (Opsional)
        </label>
        <Input
          id="spouseOrder"
          type="number"
          min="1"
          max="99"
          value={spouseOrder}
          onChange={(e) => onSpouseOrderChange(e.target.value)}
          placeholder="Kosongkan untuk otomatis"
        />
        <p className="mt-1 text-xs text-slate-500">
          1 = pernikahan pertama, 2 = kedua, dst
        </p>
      </div>
    </div>
  );
}
