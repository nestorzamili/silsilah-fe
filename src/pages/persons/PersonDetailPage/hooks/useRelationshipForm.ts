import { useState, useCallback } from 'react';
import type { RelationshipType } from '@/types';
import type { RelationshipFormState } from '../types/relationshipForm';

export function useRelationshipForm(initialValues?: Partial<RelationshipFormState>) {
  const [formState, setFormState] = useState<RelationshipFormState>({
    parentRole: undefined,
    marriageDate: '',
    marriagePlace: '',
    spouseOrder: '',
    childOrder: '',
    requesterNote: '',
    ...initialValues,
  });

  const setParentRole = useCallback((role: 'FATHER' | 'MOTHER' | undefined) => {
    setFormState((prev) => ({ ...prev, parentRole: role }));
  }, []);

  const setMarriageDate = useCallback((date: string) => {
    setFormState((prev) => ({ ...prev, marriageDate: date }));
  }, []);

  const setMarriagePlace = useCallback((place: string) => {
    setFormState((prev) => ({ ...prev, marriagePlace: place }));
  }, []);

  const setSpouseOrder = useCallback((order: string) => {
    setFormState((prev) => ({ ...prev, spouseOrder: order }));
  }, []);

  const setChildOrder = useCallback((order: string) => {
    setFormState((prev) => ({ ...prev, childOrder: order }));
  }, []);

  const setRequesterNote = useCallback((note: string) => {
    setFormState((prev) => ({ ...prev, requesterNote: note }));
  }, []);

  const updateFormState = useCallback((newState: Partial<RelationshipFormState>) => {
    setFormState((prev) => ({ ...prev, ...newState }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      parentRole: undefined,
      marriageDate: '',
      marriagePlace: '',
      spouseOrder: '',
      childOrder: '',
      requesterNote: '',
    });
  }, []);

  const validateForm = useCallback(
    (type: RelationshipType): { isValid: boolean; error: string | null } => {
      if (type === 'PARENT' && !formState.parentRole) {
        return {
          isValid: false,
          error: 'Harap pilih peran orang tua (Ayah atau Ibu)',
        };
      }

      if (
        type === 'PARENT' &&
        formState.childOrder &&
        (parseInt(formState.childOrder) < 1 || parseInt(formState.childOrder) > 99)
      ) {
        return {
          isValid: false,
          error: 'Urutan anak harus antara 1 dan 99',
        };
      }

      if (
        type === 'SPOUSE' &&
        formState.spouseOrder &&
        (parseInt(formState.spouseOrder) < 1 || parseInt(formState.spouseOrder) > 99)
      ) {
        return {
          isValid: false,
          error: 'Urutan pernikahan harus antara 1 dan 99',
        };
      }

      return { isValid: true, error: null };
    },
    [formState],
  );

  return {
    formState,
    setParentRole,
    setMarriageDate,
    setMarriagePlace,
    setSpouseOrder,
    setChildOrder,
    setRequesterNote,
    updateFormState,
    resetForm,
    validateForm,
  };
}
