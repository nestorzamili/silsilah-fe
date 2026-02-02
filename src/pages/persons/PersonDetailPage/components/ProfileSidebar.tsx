import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PersonWithRelationships } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getFullName, calculateAge } from '@/utils/person';
import { useAuthStore } from '@/stores';
import {
  PencilIcon,
  TrashIcon,
  ShareIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  HeartIcon,
  GlobeAltIcon,
  EllipsisVerticalIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface ProfileSidebarProps {
  person: PersonWithRelationships;
  onDeleteClick: () => void;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getGenderLabel(gender: string): string {
  return gender === 'MALE'
    ? 'Laki-laki'
    : gender === 'FEMALE'
      ? 'Perempuan'
      : '-';
}

export function ProfileSidebar({ person, onDeleteClick }: ProfileSidebarProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  // Check if user has permission to edit (editor or developer)
  const canEdit =
    currentUser?.role === 'editor' || currentUser?.role === 'developer';
  const isMember = currentUser?.role === 'member';
  const canModify = canEdit || isMember;
  const fullName = getFullName(person);
  const age = person.birth_date
    ? calculateAge(person.birth_date, person.death_date)
    : null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: fullName, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
    setMenuOpen(false);
  };

  return (
    <div className="h-full">
      <div className="h-full bg-white shadow-2xl shadow-emerald-900/10">
        {/* Profile Header */}
        <div className="relative border-b border-slate-100 px-6 pb-6 pt-8">
          {/* Three Dot Menu */}
          <div className="absolute right-3 top-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {canModify && (
                    <button
                      onClick={() => {
                        navigate(`/persons/${person.id}/edit`);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>
                        {isMember ? 'Ajukan Perubahan' : 'Edit Profil'}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <ShareIcon className="h-4 w-4" />
                    <span>Bagikan</span>
                  </button>
                  {canEdit && (
                    <>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => {
                          onDeleteClick();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Hapus</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-1">
              <div className="relative">
                <Avatar className="h-36 w-36 border-4 border-white shadow-xl ring-1 ring-slate-100">
                  <AvatarImage src={person.avatar_url} alt={fullName} />
                  <AvatarFallback className="bg-linear-to-br from-emerald-50 to-emerald-100 text-4xl font-medium text-emerald-700">
                    {fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-emerald-100/20 blur-xl"></div>
              </div>
            </div>

            <div className="mt-1 text-center">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {fullName}
              </h1>
              {(person.nickname || age !== null) && (
                <div className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-500">
                  {person.nickname && (
                    <span className="italic">"{person.nickname}"</span>
                  )}
                  {person.nickname && age !== null && (
                    <span className="text-slate-300">•</span>
                  )}
                  {age !== null && (
                    <span>
                      {age} tahun{!person.is_alive ? ' (meninggal)' : ''}
                    </span>
                  )}
                </div>
              )}
              <div className="mt-1">
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
        </div>

        <div className="px-6 py-2">
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Bio
          </h3>
          <p className="text-sm leading-relaxed text-slate-700 min-h-5">
            {person.bio || '-'}
          </p>
        </div>

        <div className="px-6 py-2">
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Informasi
          </h3>
          <div className="space-y-1.5">
            <InfoRow icon={UserIcon} label="Jenis Kelamin">
              {getGenderLabel(person.gender)}
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
                    {' '}
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

        <div className="px-6 py-2">
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Kontak
          </h3>
          <div className="space-y-1.5">
            <InfoRow icon={PhoneIcon} label="Telepon">
              {person.phone ? (
                <a
                  href={`tel:${person.phone}`}
                  className="hover:text-emerald-600"
                >
                  {person.phone}
                </a>
              ) : (
                '-'
              )}
            </InfoRow>
            <InfoRow icon={EnvelopeIcon} label="Email">
              {person.email ? (
                <a
                  href={`mailto:${person.email}`}
                  className="hover:text-emerald-600"
                >
                  {person.email}
                </a>
              ) : (
                '-'
              )}
            </InfoRow>
            <InfoRow icon={MapPinIcon} label="Alamat">
              {person.address || '-'}
            </InfoRow>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-0.5 text-sm">
      <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-slate-50">
        <Icon className="h-3.5 w-3.5 text-slate-500" />
      </div>
      <div className="min-w-0">
        {label && (
          <span className="mr-1.5 text-xs font-medium text-slate-500 uppercase tracking-wide">
            {label}
          </span>
        )}
        <div className="mt-0.5 text-slate-900 font-medium">{children}</div>
      </div>
    </div>
  );
}
