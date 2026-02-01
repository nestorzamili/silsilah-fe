import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Person } from '@/types';
import { relationshipService, changeRequestService } from '@/services';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EditRelationshipModal } from './EditRelationshipModal';
import { Spinner } from '@/components/ui/Spinner';
import { getFullName } from '@/utils/person';
import {
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface RelationshipPersonCardProps {
  person: Person;
  label: string;
  relationshipId?: string;
  personId: string;
}

export function RelationshipPersonCard({
  person,
  label,
  relationshipId,
  personId,
}: RelationshipPersonCardProps) {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const fullName = getFullName(person);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRelationshipId, setCurrentRelationshipId] = useState('');
  const [requesterNote, setRequesterNote] = useState('');

  const isMember = currentUser?.role === 'member';
  const canModify =
    currentUser?.role === 'member' ||
    currentUser?.role === 'editor' ||
    currentUser?.role === 'developer';

  const deleteMutation = useMutation({
    mutationFn: () => relationshipService.delete(relationshipId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', personId] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      setDeleteModalOpen(false);
      setRequesterNote('');
    },
    onError: (err) => {
      console.error('Failed to delete relationship:', err);
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: changeRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      toast.success('Pengajuan berhasil dikirim', {
        description:
          'Permintaan penghapusan hubungan akan ditinjau oleh editor',
      });
      setDeleteModalOpen(false);
      setRequesterNote('');
    },
    onError: () => {
      toast.error('Pengajuan gagal', {
        description: 'Terjadi kesalahan saat mengirim pengajuan',
      });
    },
  });

  const handleDelete = async () => {
    if (isMember) {
      await deleteRequestMutation.mutateAsync({
        entity_type: 'RELATIONSHIP',
        entity_id: relationshipId!,
        action: 'DELETE',
        payload: {},
        requester_note: requesterNote || undefined,
      });
    } else {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <div className="group relative flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-slate-200 overflow-hidden">
        <Link
          to={`/persons/${person.id}`}
          className="flex flex-1 items-center gap-3 min-w-0"
        >
          <Avatar className="block sm:hidden xl:block h-12 w-12 shrink-0 ring-2 ring-white">
            <AvatarImage src={person.avatar_url} alt={fullName} />
            <AvatarFallback className="bg-white text-sm font-medium text-slate-600">
              {fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="wrap-break-word sm:truncate xl:wrap-break-word font-medium text-slate-900 group-hover:text-emerald-700">
              {fullName}
            </p>
            <p className="wrap-break-word sm:truncate xl:wrap-break-word text-sm text-slate-600">
              {label}
            </p>
          </div>
        </Link>
        {relationshipId && canModify && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentRelationshipId(relationshipId);
                setEditModalOpen(true);
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              title="Edit hubungan"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModalOpen(true);
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              title="Hapus hubungan"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <Dialog
        open={deleteModalOpen}
        onOpenChange={() => {
          setDeleteModalOpen(false);
          setRequesterNote('');
        }}
      >
        <DialogContent className="sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isMember ? 'Ajukan Penghapusan Hubungan' : 'Hapus Hubungan'}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {isMember ? (
                <>
                  Anda akan mengajukan penghapusan hubungan{' '}
                  <span className="font-medium text-slate-800">{label}</span>{' '}
                  dengan{' '}
                  <span className="font-medium text-slate-800">{fullName}</span>
                  . Pengajuan akan ditinjau oleh editor.
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin menghapus hubungan{' '}
                  <span className="font-medium text-slate-800">{label}</span>{' '}
                  dengan{' '}
                  <span className="font-medium text-slate-800">{fullName}</span>
                  ? Tindakan ini tidak dapat dibatalkan.
                </>
              )}
            </p>

            {isMember && (
              <div className="mt-4 text-left">
                <label
                  htmlFor="deleteRequesterNote"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Keterangan (Opsional)
                </label>
                <Textarea
                  id="deleteRequesterNote"
                  value={requesterNote}
                  onChange={(e) => setRequesterNote(e.target.value)}
                  placeholder="Tambahkan keterangan untuk pengajuan ini..."
                  rows={3}
                  maxLength={500}
                  className="resize-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {requesterNote.length}/500 karakter
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setRequesterNote('');
                }}
                disabled={
                  deleteMutation.isPending || deleteRequestMutation.isPending
                }
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={
                  deleteMutation.isPending || deleteRequestMutation.isPending
                }
              >
                {deleteMutation.isPending || deleteRequestMutation.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {isMember ? 'Mengirim Pengajuan...' : 'Menghapus...'}
                  </>
                ) : isMember ? (
                  'Ajukan Penghapusan'
                ) : (
                  'Hapus Hubungan'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditRelationshipModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setCurrentRelationshipId('');
        }}
        personId={personId}
        relationshipId={currentRelationshipId}
      />
    </>
  );
}
