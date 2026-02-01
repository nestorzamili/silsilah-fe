import { Spinner } from '@/components/ui/Spinner';
import { UserManagementHeader } from './components/UserManagementHeader';
import { UserTable } from './components/UserTable';
import { EditRoleDialog } from './components/EditRoleDialog';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import { UserPagination } from './components/UserPagination';
import { useUserManagement } from './hooks/useUserManagement';

function UserManagementPage() {
  const {
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
  } = useUserManagement();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-slate-50">
      <div className="max-w-400 mx-auto">
        <UserManagementHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        <UserTable
          users={paginatedUsers}
          searchTerm={searchTerm}
          startIndex={startIndex}
          canModifyUser={canModifyUser}
          onEditRole={handleEditRole}
          onDelete={handleDeleteUser}
        />

        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={Math.min(startIndex + itemsPerPage, filteredUsers.length)}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
        />

        <EditRoleDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={editingUser}
          newRole={newRole}
          onRoleChange={setNewRole}
          onSave={handleAssignRole}
          isPending={assignRoleMutation.isPending}
        />

        <DeleteUserDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          user={deletingUser}
          onConfirm={handleConfirmDelete}
          isPending={deleteUserMutation.isPending}
        />
      </div>
    </div>
  );
}

export default UserManagementPage;
