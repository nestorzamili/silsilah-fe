export function getGenderLabel(gender: string): string {
  switch (gender) {
    case 'MALE':
      return 'Laki-laki';
    case 'FEMALE':
      return 'Perempuan';
    default:
      return '-';
  }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
