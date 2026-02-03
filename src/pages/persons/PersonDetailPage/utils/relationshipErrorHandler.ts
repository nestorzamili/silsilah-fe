export function parseRelationshipError(err: unknown): string {
  const errorMessage =
    err instanceof Error ? err.message : 'Gagal memproses hubungan';

  if (
    errorMessage.toLowerCase().includes('relationship already exists') ||
    errorMessage.toLowerCase().includes('hubungan sudah ada')
  ) {
    return 'Hubungan ini sudah ada. Silakan pilih orang lain.';
  }

  if (
    errorMessage.toLowerCase().includes('cannot create relationship with self') ||
    errorMessage
      .toLowerCase()
      .includes('tidak dapat membuat hubungan dengan diri sendiri')
  ) {
    return 'Tidak dapat membuat hubungan dengan diri sendiri.';
  }

  if (
    errorMessage.toLowerCase().includes('one or both persons not found') ||
    errorMessage.toLowerCase().includes('orang tidak ditemukan')
  ) {
    return 'Salah satu atau kedua orang tidak ditemukan.';
  }

  if (
    errorMessage.toLowerCase().includes('duplicate parent role') ||
    errorMessage.toLowerCase().includes('sudah memiliki orang tua')
  ) {
    return 'Orang ini sudah memiliki orang tua dengan peran yang sama.';
  }

  return errorMessage;
}
