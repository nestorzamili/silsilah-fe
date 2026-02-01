import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

interface PreviewItemProps {
  label: string;
  value: string;
}

function PreviewItem({ label, value }: PreviewItemProps) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

interface ProfilePreviewProps {
  isEditing: boolean;
  id?: string;
  fullName: string;
  avatarUrl?: string;
  nickname?: string;
  gender?: string;
  isAlive: boolean;
  birthDate?: string;
  birthPlace?: string;
  occupation?: string;
  religion?: string;
  phone?: string;
  email?: string;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePreview({
  isEditing,
  id,
  fullName,
  avatarUrl,
  nickname,
  gender,
  isAlive,
  birthDate,
  birthPlace,
  occupation,
  religion,
  phone,
  email,
  onPhotoUpload,
}: ProfilePreviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="hidden lg:block shrink-0 border-r border-emerald-100/50 p-6 lg:w-80 lg:overflow-y-auto lg:shadow-2xl lg:shadow-emerald-900/10 z-10 relative bg-white">
      <div className="mb-6">
        <Link
          to={isEditing ? `/persons/${id}` : '/persons'}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {isEditing ? 'Kembali ke Detail' : 'Kembali ke Daftar'}
        </Link>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-36 w-36 cursor-pointer rounded-full border-4 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-slate-400 hover:bg-slate-100"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UserCircleIcon className="h-24 w-24 text-slate-400" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-30 opacity-0 transition-opacity hover:opacity-100">
              <CameraIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPhotoUpload}
            className="hidden"
          />
        </div>

        <h2 className="text-xl font-semibold text-slate-900">{fullName}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {isEditing ? 'Edit Profil' : 'Tambah Orang Baru'}
        </p>
      </div>

      <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Preview
        </h3>
        <div className="space-y-3 text-sm">
          <PreviewItem
            label="Nama Lengkap"
            value={fullName !== 'Nama' ? fullName : '-'}
          />
          {nickname && <PreviewItem label="Panggilan" value={nickname} />}
          <PreviewItem
            label="Jenis Kelamin"
            value={
              gender === 'MALE'
                ? 'Laki-laki'
                : gender === 'FEMALE'
                  ? 'Perempuan'
                  : '-'
            }
          />
          <PreviewItem
            label="Status"
            value={isAlive ? 'Masih hidup' : 'Sudah meninggal'}
          />
          {birthDate && (
            <PreviewItem label="Tanggal Lahir" value={birthDate} />
          )}
          {birthPlace && (
            <PreviewItem label="Tempat Lahir" value={birthPlace} />
          )}
          {occupation && <PreviewItem label="Pekerjaan" value={occupation} />}
          {religion && <PreviewItem label="Agama" value={religion} />}
          {phone && <PreviewItem label="Telepon" value={phone} />}
          {email && <PreviewItem label="Email" value={email} />}
        </div>
      </div>
    </aside>
  );
}
