import type { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRoleBadge } from '../utils/userHelpers';

interface EditRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  newRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSave: () => void;
  isPending: boolean;
}

export function EditRoleDialog({
  isOpen,
  onOpenChange,
  user,
  newRole,
  onRoleChange,
  onSave,
  isPending,
}: EditRoleDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Peran Pengguna</DialogTitle>
          <DialogDescription>
            Ubah peran untuk {user.full_name || 'pengguna ini'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Peran Saat Ini
              </label>
              <div className="mt-1">{getRoleBadge(user.role)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Peran Baru
              </label>
              <Select
                value={newRole}
                onValueChange={(value) => onRoleChange(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  {user.role !== 'developer' && (
                    <SelectItem value="developer">Developer</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            onClick={onSave}
            disabled={isPending || newRole === user.role}
          >
            {isPending ? 'Memperbarui...' : 'Perbarui Peran'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
