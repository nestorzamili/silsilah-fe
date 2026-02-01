import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { relationshipService, personService, changeRequestService } from '@/services';
import type { UpdateRelationshipInput, ParentMetadata, SpouseMetadata } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/Spinner';
import { getFullName } from '@/utils/person';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores';
import { toast } from 'sonner';

interface EditRelationshipModalProps {
  open: boolean;
  onClose: () => void;
  personId: string;
  relationshipId: string;
}



export function EditRelationshipModal({
  open,
  onClose,
  personId,
  relationshipId,
}: EditRelationshipModalProps) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [requesterNote, setRequesterNote] = useState('');
  
  const isMember = currentUser?.role === 'member';
  
  const { data: relationship, isLoading: relationshipLoading } = useQuery({
    queryKey: ['relationship', relationshipId],
    queryFn: () => relationshipService.getById(relationshipId),
    enabled: !!relationshipId && open,
  });

  const relatedPersonId = relationship
    ? relationship.person_a === personId
      ? relationship.person_b
      : relationship.person_a
    : undefined;

  const { data: relatedPerson } = useQuery({
    queryKey: ['person', relatedPersonId],
    queryFn: () => personService.getById(relatedPersonId!),
    enabled: !!relatedPersonId && open,
  });

  const formKey = relationship?.id || 'new';
  
  const [parentRole, setParentRole] = useState<'FATHER' | 'MOTHER' | ''>('');
  const [marriageDate, setMarriageDate] = useState('');
  const [marriagePlace, setMarriagePlace] = useState('');
  const [spouseOrder, setSpouseOrder] = useState('');
  const [childOrder, setChildOrder] = useState('');

  useEffect(() => {
    if (relationship) {
      const metadata = relationship.metadata || {};
      
      if ('role' in metadata) {
        const role = (metadata as { role: string }).role;
        setParentRole(role === 'FATHER' || role === 'MOTHER' ? role : '');
      } else {
        setParentRole('');
      }
      
      setMarriageDate('marriage_date' in metadata ? (metadata as { marriage_date: string }).marriage_date || '' : '');
      setMarriagePlace('marriage_place' in metadata ? (metadata as { marriage_place: string }).marriage_place || '' : '');
      setSpouseOrder(relationship.spouse_order?.toString() || '');
      setChildOrder(relationship.child_order?.toString() || '');
    } else {
      setParentRole('');
      setMarriageDate('');
      setMarriagePlace('');
      setSpouseOrder('');
      setChildOrder('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey]);

  const updateMutation = useMutation({
    mutationFn: (input: UpdateRelationshipInput) =>
      relationshipService.update(relationshipId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', personId] });
      queryClient.invalidateQueries({ queryKey: ['relationship', relationshipId] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Gagal mengupdate hubungan');
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: changeRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      toast.success('Pengajuan berhasil dikirim', {
        description: 'Permintaan perubahan hubungan akan ditinjau oleh editor',
      });
      onClose();
    },
    onError: () => {
      toast.error('Pengajuan gagal', {
        description: 'Terjadi kesalahan saat mengirim pengajuan',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const input: UpdateRelationshipInput = {};

    if (relationship?.type === 'PARENT') {
      if (parentRole) {
        const metadata: ParentMetadata = { role: parentRole };
        input.metadata = metadata;
      }
      if (childOrder) {
        input.child_order = parseInt(childOrder);
      }
    }

    if (relationship?.type === 'SPOUSE') {
      const metadata: SpouseMetadata = {};
      if (marriageDate) metadata.marriage_date = marriageDate;
      if (marriagePlace) metadata.marriage_place = marriagePlace;

      const existingMeta = relationship.metadata as SpouseMetadata;
      if (existingMeta) {
        metadata.is_consanguineous = existingMeta.is_consanguineous;
        metadata.consanguinity_degree = existingMeta.consanguinity_degree;
        metadata.common_ancestors = existingMeta.common_ancestors;
      }

      input.metadata = metadata;

      if (spouseOrder) {
        input.spouse_order = parseInt(spouseOrder);
      }
    }

    if (isMember) {
      await createRequestMutation.mutateAsync({
        entity_type: 'RELATIONSHIP',
        entity_id: relationshipId,
        action: 'UPDATE',
        payload: input as unknown as Record<string, unknown>,
        requester_note: requesterNote || undefined,
      });
    } else {
      updateMutation.mutate(input);
    }
  };



  const relatedPersonName = relatedPerson ? getFullName(relatedPerson) : 'Unknown';

  if (relationshipLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex h-48 items-center justify-center">
            <Spinner size="lg" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!relationship) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6 text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-amber-500" />
            <h3 className="mt-3 text-lg font-medium text-slate-900">Hubungan tidak ditemukan</h3>
            <p className="mt-1 text-sm text-slate-500">
              Hubungan yang ingin Anda edit tidak tersedia.
            </p>
            <div className="mt-6">
              <Button onClick={onClose} className="w-full">
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div>
            <DialogTitle className="text-xl mb-1">Edit Hubungan</DialogTitle>
            <p className="text-sm text-slate-600">
              Mengedit hubungan dengan <span className="font-medium">{relatedPersonName}</span>
            </p>
          </div>
        </DialogHeader>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800">Gagal mengupdate hubungan</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {relationship.type === 'PARENT' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Peran Orang Tua</Label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={parentRole === 'FATHER' ? 'default' : 'outline'}
                    className={`h-11 ${parentRole === 'FATHER' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={() => setParentRole('FATHER')}
                  >
                    Ayah
                  </Button>
                  <Button
                    type="button"
                    variant={parentRole === 'MOTHER' ? 'default' : 'outline'}
                    className={`h-11 ${parentRole === 'MOTHER' ? 'bg-rose-600 hover:bg-rose-700' : ''}`}
                    onClick={() => setParentRole('MOTHER')}
                  >
                    Ibu
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="childOrder" className="text-sm font-medium text-slate-700">
                  Urutan Anak (Opsional)
                </Label>
                <Input
                  id="childOrder"
                  type="number"
                  min="1"
                  max="99"
                  value={childOrder}
                  onChange={(e) => setChildOrder(e.target.value)}
                  placeholder="Kosongkan untuk otomatis"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Urutan kelahiran (1 = sulung, 2 = kedua, dst)
                </p>
              </div>
            </div>
          )}

          {relationship.type === 'SPOUSE' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="marriageDate" className="text-sm font-medium text-slate-700">
                  Tanggal Menikah (Opsional)
                </Label>
                <Input
                  id="marriageDate"
                  type="date"
                  value={marriageDate}
                  onChange={(e) => setMarriageDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="marriagePlace" className="text-sm font-medium text-slate-700">
                  Tempat Menikah (Opsional)
                </Label>
                <Input
                  id="marriagePlace"
                  type="text"
                  value={marriagePlace}
                  onChange={(e) => setMarriagePlace(e.target.value)}
                  placeholder="Contoh: Jakarta"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="spouseOrder" className="text-sm font-medium text-slate-700">
                  Urutan Pernikahan (Opsional)
                </Label>
                <Input
                  id="spouseOrder"
                  type="number"
                  min="1"
                  max="99"
                  value={spouseOrder}
                  onChange={(e) => setSpouseOrder(e.target.value)}
                  placeholder="Kosongkan untuk otomatis"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-slate-500">
                  1 = pernikahan pertama, 2 = kedua, dst
                </p>
              </div>

              {(relationship.metadata as SpouseMetadata)?.is_consanguineous && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-start gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-amber-800">Hubungan Sedarah</p>
                      <p className="text-sm text-amber-600">
                        Pasangan ini memiliki hubungan sedarah tingkat{' '}
                        {(relationship.metadata as SpouseMetadata).consanguinity_degree}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isMember && (
            <div className="border-t border-slate-200 pt-4">
              <Label htmlFor="requesterNote" className="text-sm font-medium text-slate-700">
                Keterangan (Opsional)
              </Label>
              <Textarea
                id="requesterNote"
                value={requesterNote}
                onChange={(e) => setRequesterNote(e.target.value)}
                placeholder="Tambahkan keterangan untuk pengajuan ini..."
                rows={3}
                maxLength={500}
                className="mt-1 resize-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                {requesterNote.length}/500 karakter
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending || createRequestMutation.isPending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {(updateMutation.isPending || createRequestMutation.isPending) ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {isMember ? 'Mengirim Pengajuan...' : 'Menyimpan...'}
                </>
              ) : (
                isMember ? 'Ajukan Perubahan' : 'Simpan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}