import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PersonWithRelationships, RelationshipInfo } from '@/types';
import { useAuthStore } from '@/stores';

interface TreeSidePanelProps {
  person: PersonWithRelationships | null;
  loading: boolean;
  onClose: () => void;
}

function getGenderLabel(gender: string): string {
  switch (gender) {
    case 'MALE':
      return 'Laki-laki';
    case 'FEMALE':
      return 'Perempuan';
    default:
      return 'Tidak diketahui';
  }
}

function getFullName(person: {
  first_name: string;
  last_name?: string | null;
}): string {
  return person.last_name
    ? `${person.first_name} ${person.last_name}`
    : person.first_name;
}

export function TreeSidePanel({
  person,
  loading,
  onClose,
}: TreeSidePanelProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const canEdit =
    currentUser?.role === 'editor' || currentUser?.role === 'developer';

  if (loading) {
    return (
      <div className="w-96 border-l border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Detail Orang</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!person) {
    return null;
  }

  const fullName = getFullName(person);

  return (
    <div className="w-96 border-l border-slate-200 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Detail Orang</h3>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <Avatar
              size="lg"
              className="h-16 w-16 border-2 border-white shadow-lg"
            >
              <AvatarImage src={person.avatar_url} alt={fullName} />
              <AvatarFallback className="bg-linear-to-br from-emerald-50 to-emerald-100 text-lg font-medium text-emerald-700">
                {fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900 tracking-tight">
              {fullName}
            </h4>
            <div className="mt-1 flex items-center gap-2">
              {person.gender && (
                <span className="text-sm text-slate-500">
                  {getGenderLabel(person.gender)}
                </span>
              )}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${person.is_alive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}
              >
                <span
                  className={`mr-1 h-1.5 w-1.5 rounded-full ${person.is_alive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                ></span>
                {person.is_alive ? 'Hidup' : 'Meninggal'}
              </span>
            </div>
          </div>
        </div>

        <dl className="space-y-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status
            </dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${person.is_alive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}
              >
                <span
                  className={`mr-1.5 h-1.5 w-1.5 rounded-full ${person.is_alive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                ></span>
                {person.is_alive ? 'Masih Hidup' : 'Meninggal'}
              </span>
            </dd>
          </div>
          {person.birth_date && (
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tanggal Lahir
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {new Date(person.birth_date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
          )}
          {person.birth_place && (
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tempat Lahir
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {person.birth_place}
              </dd>
            </div>
          )}
          {person.bio && (
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Biografi
              </dt>
              <dd className="mt-1 text-sm text-slate-700">{person.bio}</dd>
            </div>
          )}
        </dl>

        {person.relationships && person.relationships.length > 0 && (
          <div className="mt-6">
            <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hubungan ({person.relationships.length})
            </h5>
            <div className="space-y-2">
              {person.relationships.slice(0, 6).map((rel: RelationshipInfo) => {
                const relatedName = rel.related_person
                  ? getFullName(rel.related_person)
                  : 'Tidak diketahui';
                const relTypeLabel =
                  rel.type === 'PARENT' ? 'Orang Tua' : 'Pasangan';
                return (
                  <div
                    key={rel.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3 transition-colors hover:bg-slate-50"
                  >
                    <span className="font-medium text-slate-900">
                      {relatedName}
                    </span>
                    <Badge
                      variant={rel.type === 'SPOUSE' ? 'outline' : 'secondary'}
                    >
                      {relTypeLabel}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={canEdit ? 'mt-6 grid grid-cols-2 gap-3' : 'mt-6'}>
          <Button
            variant="secondary"
            className={canEdit ? 'w-full' : 'w-full'}
            onClick={() => navigate(`/persons/${person.id}`)}
          >
            Lihat Profil
          </Button>
          {canEdit && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(`/persons/${person.id}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
