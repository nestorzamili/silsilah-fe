import { Textarea } from '@/components/ui/textarea';

interface RequesterNoteFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function RequesterNoteField({
  value,
  onChange,
}: RequesterNoteFieldProps) {
  return (
    <div className="border-t border-slate-200 pt-4">
      <label
        htmlFor="requesterNote"
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        Keterangan (Opsional)
      </label>
      <Textarea
        id="requesterNote"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tambahkan keterangan untuk pengajuan ini..."
        rows={3}
        maxLength={500}
        className="resize-none"
      />
      <p className="mt-1 text-xs text-slate-500">{value.length}/500 karakter</p>
    </div>
  );
}
