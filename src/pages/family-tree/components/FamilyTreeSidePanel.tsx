import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores';
import {
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import type { PersonWithRelationships } from '@/types';
import { calculateAge } from '@/utils/person';
import { getGenderLabel, formatDate } from '../utils';

interface FamilyTreeSidePanelProps {
  person: PersonWithRelationships | null;
  loading: boolean;
  onClose: () => void;
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div>
        <span className="text-slate-500">{label}:</span>{' '}
        <span className="text-slate-700">{children}</span>
      </div>
    </div>
  );
}

function getSidePanelName(person: PersonWithRelationships | null): string {
  if (!person) return '';
  return person.last_name
    ? `${person.first_name} ${person.last_name}`
    : person.first_name;
}

export function FamilyTreeSidePanel({
  person,
  loading,
  onClose,
}: FamilyTreeSidePanelProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const name = getSidePanelName(person);

  // Check if user has permission to edit (editor or developer)
  const canEdit =
    currentUser?.role === 'editor' || currentUser?.role === 'developer';

  if (loading) {
    return (
      <div className="w-80 shrink-0 overflow-y-auto border-l border-emerald-100 bg-white shadow-2xl shadow-emerald-900/10 relative z-20">
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!person) {
    return null;
  }

  return (
    <div className="w-80 shrink-0 overflow-y-auto border-l border-emerald-100 bg-white shadow-2xl shadow-emerald-900/10 relative z-20">
      <div className="h-full">
        <div className="relative border-b border-slate-100 px-5 pb-4 pt-6">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-1 ring-slate-100">
                  <AvatarImage src={person.avatar_url} alt={name} />
                  <AvatarFallback className="bg-linear-to-br from-emerald-50 to-emerald-100 text-3xl font-medium text-emerald-700">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-emerald-100/20 blur-lg"></div>
              </div>
            </div>
            <h4 className="text-xl font-bold text-slate-900 tracking-tight">
              {name}
            </h4>
            {(person.nickname || person.birth_date) && (
              <div className="mt-1 flex flex-col items-center gap-1 text-sm text-slate-500">
                {person.nickname && (
                  <span className="italic">"{person.nickname}"</span>
                )}
                {person.birth_date && (
                  <span>
                    {calculateAge(person.birth_date, person.death_date)} tahun
                  </span>
                )}
              </div>
            )}
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${person.is_alive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}
              >
                <span
                  className={`mr-1.5 h-2 w-2 rounded-full ${person.is_alive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                ></span>
                {person.is_alive ? 'Masih Hidup' : 'Meninggal'}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Bio
          </h3>
          <p className="text-sm leading-relaxed text-slate-700">
            {person.bio || '-'}
          </p>
        </div>

        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Informasi
          </h3>
          <div className="space-y-2">
            <InfoRow icon={UserIcon} label="Jenis Kelamin">
              {getGenderLabel(person.gender) || '-'}
            </InfoRow>
            <InfoRow icon={CalendarIcon} label="Lahir">
              {person.birth_date ? formatDate(person.birth_date) : '-'}
              {person.birth_place && (
                <span className="text-slate-600"> di {person.birth_place}</span>
              )}
            </InfoRow>
            {!person.is_alive && (
              <InfoRow icon={CalendarIcon} label="Wafat">
                {person.death_date ? formatDate(person.death_date) : '-'}
                {person.death_place && (
                  <span className="text-slate-600">
                    {}
                    di {person.death_place}
                  </span>
                )}
              </InfoRow>
            )}
            <InfoRow icon={BriefcaseIcon} label="Pekerjaan">
              {person.occupation || '-'}
            </InfoRow>
            <InfoRow icon={AcademicCapIcon} label="Pendidikan">
              {person.education || '-'}
            </InfoRow>
            <InfoRow icon={HeartIcon} label="Agama">
              {person.religion || '-'}
            </InfoRow>
            <InfoRow icon={GlobeAltIcon} label="Kewarganegaraan">
              {person.nationality || '-'}
            </InfoRow>
          </div>
        </div>

        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Kontak
          </h3>
          <div className="space-y-2">
            <InfoRow icon={PhoneIcon} label="Telepon">
              {person.phone || '-'}
            </InfoRow>
            <InfoRow icon={EnvelopeIcon} label="Email">
              {person.email || '-'}
            </InfoRow>
          </div>
        </div>

        <div className="p-5">
          <div className={canEdit ? 'grid grid-cols-2 gap-3' : ''}>
            <Button
              className={
                canEdit
                  ? 'w-full bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'w-full bg-emerald-600 hover:bg-emerald-700 text-white'
              }
              onClick={() => navigate(`/persons/${person.id}`)}
            >
              Lihat Profil
            </Button>
            {canEdit && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/persons/${person.id}/edit`)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
