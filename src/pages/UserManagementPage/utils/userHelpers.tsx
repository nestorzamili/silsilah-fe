import { Badge } from '@/components/ui/badge';

export function getRoleBadge(role: string) {
  switch (role) {
    case 'developer':
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Pengembang
        </Badge>
      );
    case 'editor':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Editor
        </Badge>
      );
    case 'member':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Anggota
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Tidak Diketahui
        </Badge>
      );
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
