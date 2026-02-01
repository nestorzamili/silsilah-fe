import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { getRoleBadge, formatDate } from '../utils/userHelpers';

interface UserTableRowProps {
  rowNumber: number;
  user: User;
  canModify: boolean;
  onEditRole: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTableRow({
  rowNumber,
  user,
  canModify,
  onEditRole,
  onDelete,
}: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell className="text-center text-slate-600">
        {rowNumber}
      </TableCell>
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
          <AvatarFallback className="bg-emerald-50 text-sm font-medium text-emerald-600">
            {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">
        {user.full_name || 'Pengguna Tanpa Nama'}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{getRoleBadge(user.role)}</TableCell>
      <TableCell>{formatDate(user.created_at)}</TableCell>
      <TableCell>{formatDate(user.updated_at)}</TableCell>
      <TableCell className="text-right">
        {canModify && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditRole(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Peran
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Pengguna
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
