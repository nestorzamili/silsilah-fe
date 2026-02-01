import type { User } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserTableRow } from './UserTableRow';

interface UserTableProps {
  users: User[];
  searchTerm: string;
  startIndex: number;
  canModifyUser: (userRole: string) => boolean;
  onEditRole: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({
  users,
  searchTerm,
  startIndex,
  canModifyUser,
  onEditRole,
  onDelete,
}: UserTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">No</TableHead>
            <TableHead className="w-12">Avatar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Peran</TableHead>
            <TableHead>Dibuat Pada</TableHead>
            <TableHead>Terakhir Diupdate</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user: User, index: number) => (
              <UserTableRow
                key={user.id}
                rowNumber={startIndex + index + 1}
                user={user}
                canModify={canModifyUser(user.role)}
                onEditRole={onEditRole}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-slate-500"
              >
                {searchTerm
                  ? 'Tidak ada pengguna yang cocok dengan pencarian Anda'
                  : 'Tidak ada pengguna ditemukan'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
