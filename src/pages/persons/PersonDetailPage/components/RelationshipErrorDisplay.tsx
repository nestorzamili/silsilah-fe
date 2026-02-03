import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RelationshipErrorDisplayProps {
  error: string;
  title?: string;
}

export function RelationshipErrorDisplay({
  error,
  title = 'Gagal menambahkan hubungan',
}: RelationshipErrorDisplayProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
      <div className="flex items-start gap-2">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        <div>
          <p className="text-sm font-medium text-red-800">{title}</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    </div>
  );
}
