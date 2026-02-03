export interface RelationshipFormState {
  parentRole: 'FATHER' | 'MOTHER' | undefined;
  marriageDate: string;
  marriagePlace: string;
  spouseOrder: string;
  childOrder: string;
  requesterNote: string;
}