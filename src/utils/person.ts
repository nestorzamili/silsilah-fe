import type { GraphNode, Person } from '@/types';

export function getFullName(
  person: { first_name: string; last_name?: string | null } | GraphNode,
): string {
  if ('full_name' in person && person.full_name) {
    return person.full_name;
  }
  return person.last_name
    ? `${person.first_name} ${person.last_name}`
    : person.first_name;
}

export function getGenderLabel(gender: string): string {
  switch (gender) {
    case 'MALE':
      return 'Laki-laki';
    case 'FEMALE':
      return 'Perempuan';
    default:
      return 'Tidak diketahui';
  }
}

export function getBirthYear(person: GraphNode | Person): number | undefined {
  if ('birth_year' in person && person.birth_year) {
    return person.birth_year;
  }
  if (person.birth_date) {
    return new Date(person.birth_date).getFullYear();
  }
  return undefined;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateAge(
  birthDate: string | Date,
  deathDate?: string | Date | null,
): number {
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();

  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
