import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import { useAuthStore } from '@/stores';
import type { User, UserRole } from '@/types';
import { toast } from 'sonner';

export function useUserManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('member');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { user: currentUser } = useAuthStore();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });

  const assignRoleMutation = useMutation({
    mutationFn: (input: { user_id: string; role: string }) =>
      userService.assignRole(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['role-users'] });
      setIsEditDialogOpen(false);
      toast.success('Peran pengguna berhasil diperbarui');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as Error).message || 'Gagal memperbarui peran pengguna';

      if (
        errorMessage.toLowerCase().includes('insufficient permissions') ||
        errorMessage.toLowerCase().includes('tidak memiliki izin')
      ) {
        toast.error('Anda tidak memiliki izin untuk melakukan tindakan ini.');
      } else if (
        errorMessage.toLowerCase().includes('cannot modify your own role') ||
        errorMessage
          .toLowerCase()
          .includes('tidak dapat mengubah peran Anda sendiri')
      ) {
        toast.error('Anda tidak dapat mengubah peran Anda sendiri.');
      } else if (
        errorMessage.toLowerCase().includes('user not found') ||
        errorMessage.toLowerCase().includes('pengguna tidak ditemukan')
      ) {
        toast.error('Pengguna tidak ditemukan.');
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['role-users'] });
      toast.success('Pengguna berhasil dihapus');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as Error).message || 'Gagal menghapus pengguna';

      if (
        errorMessage.toLowerCase().includes('insufficient permissions') ||
        errorMessage.toLowerCase().includes('tidak memiliki izin')
      ) {
        toast.error('Anda tidak memiliki izin untuk menghapus pengguna ini.');
      } else if (
        errorMessage.toLowerCase().includes('cannot delete your own account') ||
        errorMessage
          .toLowerCase()
          .includes('tidak dapat menghapus akun Anda sendiri')
      ) {
        toast.error('Anda tidak dapat menghapus akun Anda sendiri.');
      } else if (
        errorMessage.toLowerCase().includes('user not found') ||
        errorMessage.toLowerCase().includes('pengguna tidak ditemukan')
      ) {
        toast.error('Pengguna tidak ditemukan.');
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user: User) =>
          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [users, searchTerm],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    [],
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleEditRole = useCallback((user: User) => {
    setEditingUser(user);
    setNewRole(user.role as UserRole);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleAssignRole = () => {
    if (editingUser) {
      assignRoleMutation.mutate({
        user_id: editingUser.id,
        role: newRole,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteUserMutation.mutate(deletingUser.id);
      setIsDeleteDialogOpen(false);
      setDeletingUser(null);
    }
  };

  const canModifyUser = (userRole: string) => {
    const currentUserRole = currentUser?.role || 'member';
    return currentUserRole === 'developer' && userRole !== 'developer';
  };

  return {
    searchTerm,
    handleSearchChange,
    paginatedUsers,
    filteredUsers,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    itemsPerPage,
    editingUser,
    deletingUser,
    newRole,
    setNewRole,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditRole,
    handleDeleteUser,
    handleAssignRole,
    handleConfirmDelete,
    canModifyUser,
    assignRoleMutation,
    deleteUserMutation,
  };
}
