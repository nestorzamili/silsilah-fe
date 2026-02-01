import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UserManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UserManagementHeader({
  searchTerm,
  onSearchChange,
}: UserManagementHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Pengguna
          </h1>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            Kelola pengguna, peran, dan izin di seluruh aplikasi
          </p>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={onSearchChange}
            className="h-10 border-slate-300 bg-white pl-9 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
