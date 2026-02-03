import { z } from 'zod';
import type { CreatePersonInput, UpdatePersonInput, Gender } from '@/types';

export const personSchema = z.object({
  first_name: z.string().min(1, 'Nama depan wajib diisi'),
  last_name: z.string().optional(),
  nickname: z.string().optional(),
  gender: z.string().optional(),
  birth_date: z.string().optional(),
  birth_place: z.string().optional(),
  death_date: z.string().optional(),
  death_place: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  occupation: z.string().optional(),
  religion: z.string().optional(),
  nationality: z.string().optional(),
  education: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  is_alive: z.boolean(),
});

export type PersonFormData = z.infer<typeof personSchema>;

export const defaultFormValues: PersonFormData = {
  first_name: '',
  last_name: '',
  nickname: '',
  gender: '',
  birth_date: '',
  birth_place: '',
  death_date: '',
  death_place: '',
  bio: '',
  avatar_url: '',
  occupation: '',
  religion: '',
  nationality: '',
  education: '',
  phone: '',
  email: '',
  address: '',
  is_alive: true,
};

export function formatDateForBackend(
  dateStr: string | undefined,
): string | undefined {
  if (!dateStr) return undefined;
  return `${dateStr}T00:00:00Z`;
}

function transformBase(data: PersonFormData) {
  const str = (val: string | undefined): string | null => {
    if (val === undefined || val.trim() === '') return null;
    return val.trim();
  };

  const date = (val: string | undefined): string | null => {
    if (val === undefined || !val) return null;
    return formatDateForBackend(val) ?? null;
  };

  const gender = (val: string | undefined): Gender | null => {
    if (val === undefined || !val || val.trim() === '') return null;
    return val.trim() as Gender;
  };

  return {
    first_name: data.first_name.trim(),
    last_name: str(data.last_name),
    nickname: str(data.nickname),
    gender: gender(data.gender),
    birth_date: date(data.birth_date),
    birth_place: str(data.birth_place),
    death_date: date(data.death_date),
    death_place: str(data.death_place),
    bio: str(data.bio),
    avatar_url: str(data.avatar_url),
    occupation: str(data.occupation),
    religion: str(data.religion),
    nationality: str(data.nationality),
    education: str(data.education),
    phone: str(data.phone),
    email: str(data.email),
    address: str(data.address),
    is_alive: data.is_alive,
  };
}

export function transformFormData(data: PersonFormData): CreatePersonInput {
  return transformBase(data) as CreatePersonInput;
}

export function transformFormDataForUpdate(
  data: PersonFormData,
): UpdatePersonInput {
  return transformBase(data);
}
