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
  CreateRelationshipInput,
  PersonWithRelationships,
} from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { usePermissions } from '@/hooks/usePermissions';
import { PersonSearchBox } from './PersonSearchBox';
import { RelationshipErrorDisplay } from './RelationshipErrorDisplay';
import { RequesterNoteField } from './RequesterNoteField';
import { useRelationshipForm } from '../hooks/useRelationshipForm';
import { parseRelationshipError } from '../utils/relationshipErrorHandler';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { getFullName } from '@/utils/person';

interface AddRelationshipModalProps {
  open: boolean;
  onClose: () => void;
  personId: string;
  personName: string;
  existingData?: PersonWithRelationships;
}

type RelationshipRole = 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD';

export function AddRelationshipModal({
  open,
  onClose,
  personId,
  personName,
  existingData,
}: AddRelationshipModalProps) {
  const queryClient = useQueryClient();
  const { isMember } = usePermissions();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedRole, setSelectedRole] = useState<RelationshipRole | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [filteredSearchResults, setFilteredSearchResults] = useState<Person[]>(
    [],
  );

  // Form state
  const {
    formState,
    setMarriageDate,
    setMarriagePlace,
    setSpouseOrder,
    setChildOrder,
    setRequesterNote,
    resetForm: resetFormState,
  } = useRelationshipForm();

  const resetForm = () => {
    setSelectedPerson(null);
    setSelectedRole('');
    resetFormState();
    setSearchQuery('');
    setSearchInputValue('');
    setFilteredSearchResults([]);
    setError(null);
  };

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['people', 'search', searchQuery],
    queryFn: () => personService.search(searchQuery, 10),
    enabled: searchQuery.length >= 2,
    staleTime: 30000,
  });

  const availableRoles = useMemo(() => {
    const roles: { value: RelationshipRole; label: string }[] = [];

    if (!existingData) {
      return [
        { value: 'FATHER', label: 'Ayah' },
        { value: 'MOTHER', label: 'Ibu' },
        { value: 'SPOUSE', label: 'Pasangan (Suami/Istri)' },
      ];
    }

    const hasFather = existingData.parents.some((p) => p.role === 'FATHER');
    const hasMother = existingData.parents.some((p) => p.role === 'MOTHER');

    if (!hasFather) {
      roles.push({ value: 'FATHER', label: 'Ayah' });
    }
    if (!hasMother) {
      roles.push({ value: 'MOTHER', label: 'Ibu' });
    }

    roles.push({ value: 'SPOUSE', label: 'Pasangan (Suami/Istri)' });

    return roles;
  }, [existingData]);

  const excludeIds = useMemo(
    () => [personId, ...(selectedPerson ? [selectedPerson.id] : [])],
    [personId, selectedPerson],
  );

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setFilteredSearchResults([]);
      return;
    }
    setSearchQuery(query);
  };

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

  const createMutation = useMutation({
    mutationFn: (input: CreateRelationshipInput) =>
      relationshipService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', personId] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivities'] });
      toast.success('Hubungan berhasil ditambahkan');
      resetForm();
      onClose();
    },
    onError: (err) => {
      setError(parseRelationshipError(err));
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: changeRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      toast.success('Pengajuan berhasil dikirim', {
        description: 'Permintaan penambahan hubungan akan ditinjau oleh editor',
      });
      resetForm();
      onClose();
    },
    onError: () => {
      toast.error('Pengajuan gagal', {
        description: 'Terjadi kesalahan saat mengirim pengajuan',
      });
    },
  });

  const handleSubmit = async () => {
    if (!selectedPerson || !selectedRole) {
      setError('Mohon lengkapi data yang diperlukan');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let payload: any = {};
      let input: CreateRelationshipInput;

      if (selectedRole === 'FATHER' || selectedRole === 'MOTHER') {
        input = {
          person_a: selectedPerson.id, // Parent
          person_b: personId, // Child
          type: 'PARENT',
          metadata: { role: selectedRole },
        };

        if (formState.childOrder) {
          input.child_order = parseInt(formState.childOrder);
        }
      } else if (selectedRole === 'CHILD') {
        const parentRole =
          existingData?.gender === 'MALE' ? 'FATHER' : 'MOTHER';

        input = {
          person_a: personId,
          person_b: selectedPerson.id,
          type: 'PARENT',
          metadata: { role: parentRole },
        };

        if (formState.childOrder) {
          input.child_order = parseInt(formState.childOrder);
        }
      } else {
        input = {
          person_a: personId,
          person_b: selectedPerson.id,
          type: 'SPOUSE',
          metadata: {
            marriage_date: formState.marriageDate || undefined,
            marriage_place: formState.marriagePlace || undefined,
            is_consanguineous: false,
          },
          spouse_order: formState.spouseOrder
            ? parseInt(formState.spouseOrder)
            : undefined,
        };
      }

      if (isMember) {
        payload = { ...input };

        await createRequestMutation.mutateAsync({
          entity_type: 'RELATIONSHIP',
          action: 'CREATE',
          payload: payload,
          requester_note: formState.requesterNote || undefined,
        });
      } else {
        await createMutation.mutateAsync(input);
      }
    } catch (err) {
      setError(parseRelationshipError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'FATHER':
        return 'Ayah';
      case 'MOTHER':
        return 'Ibu';
      case 'SPOUSE':
        return 'Pasangan';
      case 'CHILD':
        return 'Anak';
      default:
        return role;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Hubungan Keluarga</DialogTitle>
          <VisuallyHidden>
            <DialogTitle>Formulir Tambah Hubungan Keluarga</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {error && <RelationshipErrorDisplay error={error} />}

          <div className="space-y-2">
            <Label>Hubungan</Label>
            <Select
              value={selectedRole}
              onValueChange={(val) => {
                setSelectedRole(val as RelationshipRole);
                setMarriageDate('');
                setMarriagePlace('');
                setSpouseOrder('');
                setChildOrder('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis hubungan" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Orang yang akan ditambahkan adalah{' '}
              <strong>
                {selectedRole ? getRoleLabel(selectedRole) : '...'}
              </strong>{' '}
              dari {personName}
            </p>
          </div>

          {selectedRole && (
            <div className="space-y-2">
              <PersonSearchBox
                currentType={selectedRole === 'SPOUSE' ? 'SPOUSE' : 'PARENT'}
                searchResults={filteredSearchResults}
                isSearching={isSearching}
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onAddPerson={(p) => {
                  setSelectedPerson(p);
                  setSearchQuery('');
                  setSearchInputValue('');
                  setFilteredSearchResults([]);
                }}
                selectedPersonIds={selectedPerson ? [selectedPerson.id] : []}
                inputValue={searchInputValue}
                onInputChange={setSearchInputValue}
              />

              {selectedPerson && (
                <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm overflow-hidden">
                      {selectedPerson.avatar_url ? (
                        <img
                          src={selectedPerson.avatar_url}
                          alt={getFullName(selectedPerson)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getFullName(selectedPerson).charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {getFullName(selectedPerson)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Akan ditambahkan sebagai {getRoleLabel(selectedRole)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPerson(null)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    Ganti
                  </Button>
                </div>
              )}
            </div>
          )}

          {selectedPerson && selectedRole === 'SPOUSE' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-900">
                Detail Pernikahan
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marriageDate">
                    Tanggal Menikah (Opsional)
                  </Label>
                  <Input
                    id="marriageDate"
                    type="date"
                    value={formState.marriageDate}
                    onChange={(e) => setMarriageDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marriagePlace">
                    Tempat Menikah (Opsional)
                  </Label>
                  <Input
                    id="marriagePlace"
                    placeholder="Contoh: Jakarta"
                    value={formState.marriagePlace}
                    onChange={(e) => setMarriagePlace(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouseOrder">
                    Urutan Pasangan (Opsional)
                  </Label>
                  <Input
                    id="spouseOrder"
                    type="number"
                    min="1"
                    placeholder="Ke-1, Ke-2, dst"
                    value={formState.spouseOrder}
                    onChange={(e) => setSpouseOrder(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedPerson &&
            (selectedRole === 'FATHER' ||
              selectedRole === 'MOTHER' ||
              selectedRole === 'CHILD') && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <Label htmlFor="childOrder">
                    Urutan Kelahiran (Opsional)
                  </Label>
                  <Input
                    id="childOrder"
                    type="number"
                    min="1"
                    placeholder="Anak ke-1, ke-2, dst"
                    value={formState.childOrder}
                    onChange={(e) => setChildOrder(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-500">
                    Nomor urut kelahiran{' '}
                    {selectedRole === 'CHILD'
                      ? selectedPerson.first_name
                      : personName}
                  </p>
                </div>
              </div>
            )}

          {selectedPerson && isMember && (
            <RequesterNoteField
              value={formState.requesterNote}
              onChange={setRequesterNote}
            />
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedPerson || !selectedRole || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Hubungan'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
