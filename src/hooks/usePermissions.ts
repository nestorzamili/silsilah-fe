import { useAuthStore } from '@/stores';
import type { UserRole } from '@/types';

export function usePermissions() {
  const { user } = useAuthStore();
  const role = user?.role as UserRole | undefined;

  const canEdit = role === 'editor' || role === 'developer';

  const isMember = role === 'member';

  const canModify = canEdit || isMember;

  const canDelete = (ownerId?: string) => user?.id === ownerId || canEdit;

  const isOwner = (ownerId?: string) => !!user && user.id === ownerId;

  return {
    user,
    role,
    canEdit,
    isMember,
    canModify,
    canDelete,
    isOwner,
  };
}
