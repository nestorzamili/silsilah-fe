import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Person } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullName(person: Person): string {
  return person.last_name
    ? `${person.first_name} ${person.last_name}`
    : person.first_name;
}
