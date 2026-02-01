import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  personService,
  relationshipService,
  changeRequestService,
} from '@/services';
import type {
  Person,
  RelationshipType,
  CreateRelationshipInput,
} from '@/types';
import type { SelectedRelationship } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { getFullName } from '@/utils/person';
import { useAuthStore } from '@/stores';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { RelationshipTypeSelector } from './RelationshipTypeSelector';
import { ParentRoleForm } from './ParentRoleForm';
import { SpouseMetadataForm } from './SpouseMetadataForm';
import { PersonSearchBox } from './PersonSearchBox';

interface AddRelationshipModalProps {
  open: boolean;
  onClose: () => void;
  personId: string;
  personName: string;
}

export function AddRelationshipModal({
  open,
  onClose,
  personId,
  personName,
}: AddRelationshipModalProps) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [selectedRelationships, setSelectedRelationships] = useState<
    SelectedRelationship[]
  >([]);
  const [currentType, setCurrentType] = useState<RelationshipType>('PARENT');
  const [currentParentRole, setCurrentParentRole] = useState<
    'FATHER' | 'MOTHER' | undefined
  >(undefined);
  const [marriageDate, setMarriageDate] = useState('');
  const [marriagePlace, setMarriagePlace] = useState('');
  const [spouseOrder, setSpouseOrder] = useState('');
  const [childOrder, setChildOrder] = useState('');
  const [requesterNote, setRequesterNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMember = currentUser?.role === 'member';

  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['people', 'search', searchQuery],
    queryFn: () => personService.search(searchQuery, 10),
    enabled: searchQuery.length >= 2,
    staleTime: 30000,
  });

  const excludeIds = useMemo(
    () => [personId, ...selectedRelationships.map((rel) => rel.person.id)],
    [personId, selectedRelationships],
  );

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setFilteredSearchResults([]);
      return;
    }
    setSearchQuery(query);
  };

  const handleAddRelationship = async (person: Person) => {
    if (selectedRelationships.some((rel) => rel.person.id === person.id)) {
      return;
    }

    const selectedRel: SelectedRelationship = {
      person,
      type: currentType,
      parentRole:
        currentType === 'PARENT' ? currentParentRole || undefined : undefined,
      marriageDate:
        currentType === 'SPOUSE' ? marriageDate || undefined : undefined,
      marriagePlace:
        currentType === 'SPOUSE' ? marriagePlace || undefined : undefined,
      spouseOrder:
        currentType === 'SPOUSE'
          ? spouseOrder
            ? parseInt(spouseOrder)
            : undefined
          : undefined,
      childOrder:
        currentType === 'PARENT'
          ? childOrder
            ? parseInt(childOrder)
            : undefined
          : undefined,
    };

    setSelectedRelationships((prev) => [...prev, selectedRel]);
  };

  const handleRemoveRelationship = (id: string) => {
    setSelectedRelationships((prev) =>
      prev.filter((rel) => rel.person.id !== id),
    );
  };

  const createMutation = useMutation({
    mutationFn: (input: CreateRelationshipInput) =>
      relationshipService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', personId] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      onClose();
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menambahkan hubungan';

      if (
        errorMessage.toLowerCase().includes('relationship already exists') ||
        errorMessage.toLowerCase().includes('hubungan sudah ada')
      ) {
        setError('Hubungan ini sudah ada. Silakan pilih orang lain.');
      } else if (
        errorMessage
          .toLowerCase()
          .includes('cannot create relationship with self') ||
        errorMessage
          .toLowerCase()
          .includes('tidak dapat membuat hubungan dengan diri sendiri')
      ) {
        setError('Tidak dapat membuat hubungan dengan diri sendiri.');
      } else if (
        errorMessage.toLowerCase().includes('one or both persons not found') ||
        errorMessage.toLowerCase().includes('orang tidak ditemukan')
      ) {
        setError('Salah satu atau kedua orang tidak ditemukan.');
      } else if (
        errorMessage.toLowerCase().includes('duplicate parent role') ||
        errorMessage.toLowerCase().includes('sudah memiliki orang tua')
      ) {
        setError('Orang ini sudah memiliki orang tua dengan peran yang sama.');
      } else {
        setError(errorMessage);
      }
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: changeRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      toast.success('Pengajuan berhasil dikirim', {
        description: 'Permintaan penambahan hubungan akan ditinjau oleh editor',
      });
      onClose();
    },
    onError: () => {
      toast.error('Pengajuan gagal', {
        description: 'Terjadi kesalahan saat mengirim pengajuan',
      });
    },
  });

  const validateForm = () => {
    if (selectedRelationships.length === 0) {
      setError('Harap pilih setidaknya satu orang untuk ditambahkan hubungan');
      return false;
    }

    if (
      currentType === 'PARENT' &&
      childOrder &&
      (parseInt(childOrder) < 1 || parseInt(childOrder) > 99)
    ) {
      setError('Urutan anak harus antara 1 dan 99');
      return false;
    }

    if (
      currentType === 'SPOUSE' &&
      spouseOrder &&
      (parseInt(spouseOrder) < 1 || parseInt(spouseOrder) > 99)
    ) {
      setError('Urutan pernikahan harus antara 1 dan 99');
      return false;
    }

    if (currentType === 'PARENT' && !currentParentRole) {
      setError('Harap pilih peran orang tua (Ayah atau Ibu)');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (isMember) {
        const promises = selectedRelationships.map((rel) => {
          const payload: Record<string, unknown> = {
            person_a: personId,
            person_b: rel.person.id,
            type: currentType,
          };

          if (
            currentType === 'PARENT' &&
            (rel.parentRole || rel.childOrder !== undefined)
          ) {
            if (rel.parentRole) {
              payload.metadata = { role: rel.parentRole };
            }
            if (rel.childOrder !== undefined)
              payload.child_order = rel.childOrder;
          }

          if (
            currentType === 'SPOUSE' &&
            (rel.marriageDate ||
              rel.marriagePlace ||
              rel.spouseOrder !== undefined)
          ) {
            payload.metadata = {
              marriage_date: rel.marriageDate,
              marriage_place: rel.marriagePlace,
              is_consanguineous: false,
            };
            if (rel.spouseOrder !== undefined)
              payload.spouse_order = rel.spouseOrder;
          }

          return createRequestMutation.mutateAsync({
            entity_type: 'RELATIONSHIP',
            action: 'CREATE',
            payload: payload,
            requester_note: requesterNote || undefined,
          });
        });

        await Promise.all(promises);
      } else {
        const promises = selectedRelationships.map((rel) => {
          const input: CreateRelationshipInput = {
            person_a: personId,
            person_b: rel.person.id,
            type: currentType,
          };

          if (
            currentType === 'PARENT' &&
            (rel.parentRole || rel.childOrder !== undefined)
          ) {
            if (rel.parentRole) {
              input.metadata = { role: rel.parentRole };
            }
            if (rel.childOrder !== undefined)
              input.child_order = rel.childOrder;
          }

          if (
            currentType === 'SPOUSE' &&
            (rel.marriageDate ||
              rel.marriagePlace ||
              rel.spouseOrder !== undefined)
          ) {
            input.metadata = {
              marriage_date: rel.marriageDate,
              marriage_place: rel.marriagePlace,
              is_consanguineous: false,
            };
            if (rel.spouseOrder !== undefined)
              input.spouse_order = rel.spouseOrder;
          }

          return createMutation.mutateAsync(input);
        });

        await Promise.all(promises);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menambahkan hubungan';

      if (
        errorMessage.toLowerCase().includes('relationship already exists') ||
        errorMessage.toLowerCase().includes('hubungan sudah ada')
      ) {
        setError('Hubungan ini sudah ada. Silakan pilih orang lain.');
      } else if (
        errorMessage
          .toLowerCase()
          .includes('cannot create relationship with self') ||
        errorMessage
          .toLowerCase()
          .includes('tidak dapat membuat hubungan dengan diri sendiri')
      ) {
        setError('Tidak dapat membuat hubungan dengan diri sendiri.');
      } else if (
        errorMessage.toLowerCase().includes('one or both persons not found') ||
        errorMessage.toLowerCase().includes('orang tidak ditemukan')
      ) {
        setError('Salah satu atau kedua orang tidak ditemukan.');
      } else if (
        errorMessage.toLowerCase().includes('duplicate parent role') ||
        errorMessage.toLowerCase().includes('sudah memiliki orang tua')
      ) {
        setError('Orang ini sudah memiliki orang tua dengan peran yang sama.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [filteredSearchResults, setFilteredSearchResults] = useState<Person[]>(
    [],
  );

  useEffect(() => {
    if (searchResults) {
      const filtered = searchResults.filter(
        (person: Person) => !excludeIds.includes(person.id),
      );
      setFilteredSearchResults(filtered);
    } else {
      setFilteredSearchResults([]);
    }
  }, [searchResults, excludeIds]);

  const resetForm = () => {
    setSelectedRelationships([]);
    setCurrentType('PARENT');
    setCurrentParentRole(undefined);
    setMarriageDate('');
    setMarriagePlace('');
    setSpouseOrder('');
    setChildOrder('');
    setSearchQuery('');
    setFilteredSearchResults([]);
    setRequesterNote('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Hubungan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Gagal menambahkan hubungan
                  </p>
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-6">
            <div className="flex-1 space-y-6">
              <RelationshipTypeSelector
                currentType={currentType}
                personName={personName}
                onTypeChange={(type) => {
                  setCurrentType(type);
                  if (type === 'PARENT') {
                    setCurrentParentRole(undefined);
                  } else {
                    setMarriageDate('');
                    setMarriagePlace('');
                    setSpouseOrder('');
                  }
                }}
              />

              {currentType === 'PARENT' && (
                <ParentRoleForm
                  currentParentRole={currentParentRole}
                  childOrder={childOrder}
                  onParentRoleChange={setCurrentParentRole}
                  onChildOrderChange={setChildOrder}
                />
              )}

              {currentType === 'SPOUSE' && (
                <SpouseMetadataForm
                  marriageDate={marriageDate}
                  marriagePlace={marriagePlace}
                  spouseOrder={spouseOrder}
                  onMarriageDateChange={setMarriageDate}
                  onMarriagePlaceChange={setMarriagePlace}
                  onSpouseOrderChange={setSpouseOrder}
                />
              )}

              <PersonSearchBox
                currentType={currentType}
                searchResults={filteredSearchResults}
                isSearching={isSearching}
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onAddPerson={handleAddRelationship}
                selectedPersonIds={selectedRelationships.map(
                  (rel) => rel.person.id,
                )}
              />

              {isMember && (
                <div className="border-t border-slate-200 pt-4">
                  <label
                    htmlFor="requesterNote"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Keterangan (Opsional)
                  </label>
                  <Textarea
                    id="requesterNote"
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
            </div>

            <div className="w-80">
              <div className="sticky top-0">
                <h3 className="text-sm font-medium text-slate-700 mb-3">
                  Terpilih ({selectedRelationships.length})
                </h3>
                <div className="space-y-2 max-h-125 overflow-y-auto pr-2">
                  {selectedRelationships.length > 0 ? (
                    selectedRelationships.map((rel) => (
                      <div
                        key={rel.person.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200" />
                          <span className="font-medium">
                            {getFullName(rel.person)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveRelationship(rel.person.id)
                          }
                        >
                          Hapus
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p>Belum ada yang dipilih</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 sticky bottom-0 bg-white pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting || selectedRelationships.length === 0
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        {isMember ? 'Mengirim Pengajuan...' : 'Menyimpan...'}
                      </>
                    ) : isMember ? (
                      `Ajukan ${selectedRelationships.length} Hubungan`
                    ) : (
                      `Tambahkan ${selectedRelationships.length} Hubungan`
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
