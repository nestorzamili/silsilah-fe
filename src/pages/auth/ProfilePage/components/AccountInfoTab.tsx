import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { userService, mediaService } from '@/services';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  CameraIcon,
  PencilIcon,
  EnvelopeIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  email: z.email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500, 'Bio maksimal 500 karakter').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function AccountInfoTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      password: '',
      bio: user?.bio || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        email: user.email,
        password: '',
        bio: user.bio || '',
      });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: (
      data: Partial<ProfileFormData> & {
        person_id?: string;
        avatar_url?: string;
      },
    ) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setIsEditing(false);
      reset({
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        password: '',
        bio: updatedUser.bio || '',
      });
      toast.success('Profil berhasil diperbarui');
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Gagal memperbarui profil',
      );
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => mediaService.upload(file),
    onSuccess: (media) => {
      updateProfileMutation.mutate({
        avatar_url: media.url,
      });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah foto');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const updateData = { ...data };
    if (!data.password) {
      delete updateData.password;
    }
    updateProfileMutation.mutate(updateData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      uploadAvatarMutation.mutate(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-1 ring-slate-100">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-emerald-50 text-emerald-600 font-bold">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-8 w-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-all"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {user?.full_name}
                </h2>
                <p className="text-slate-500 font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="rounded-xl font-bold text-slate-500 hover:text-slate-700"
                  >
                    Batal
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-6 shadow-sm"
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateProfileMutation.isPending}
                  >
                    Simpan Perubahan
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profil
                </Button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 pt-8 border-t border-slate-100">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nama Lengkap
                </Label>
                {isEditing ? (
                  <Input
                    {...register('full_name')}
                    className="h-11 rounded-xl border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  />
                ) : (
                  <p className="text-lg font-semibold text-slate-900 px-1">
                    {user?.full_name}
                  </p>
                )}
                {errors.full_name && (
                  <p className="text-xs text-red-500 font-bold ml-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Alamat Email
                </Label>
                {isEditing ? (
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      {...register('email')}
                      className="h-11 pl-10 rounded-xl border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-700 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                    <p className="font-medium text-sm">{user?.email}</p>
                  </div>
                )}
                {errors.email && (
                  <p className="text-xs text-red-500 font-bold ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Kata Sandi
                </Label>
                {isEditing ? (
                  <div className="relative">
                    <KeyIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      {...register('password')}
                      className="h-11 pl-10 rounded-xl border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="••••••••••••"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-400 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <KeyIcon className="h-4 w-4 text-slate-400" />
                    <p className="text-sm tracking-[0.3em] font-black opacity-30 px-1">
                      ••••••••
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-red-500 font-bold ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tentang Saya
                </Label>
                {isEditing ? (
                  <Textarea
                    {...register('bio')}
                    rows={5}
                    className="rounded-xl border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all p-3 font-medium"
                  />
                ) : (
                  <div className="bg-slate-50/30 p-4 rounded-xl border border-slate-100 min-h-30">
                    <p className="text-slate-600 leading-relaxed text-sm font-medium italic">
                      {user?.bio || 'Belum ada bio yang ditambahkan.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-xl bg-emerald-50/30 border border-emerald-100/50 space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-emerald-700/70">
                  Informasi Keamanan
                </Label>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-white border border-emerald-100 rounded-lg shadow-xs flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-800 tracking-wide uppercase">
                      AKSES: {user?.role}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 border rounded-lg shadow-xs flex items-center gap-2 transition-all bg-white ${
                      user?.is_email_verified
                        ? 'border-emerald-100 text-emerald-700'
                        : 'border-amber-100 text-amber-700'
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${user?.is_email_verified ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    />
                    <span className="text-[10px] font-bold tracking-wide uppercase">
                      {user?.is_email_verified
                        ? 'TERVERIFIKASI'
                        : 'PENDING VERIFIKASI'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
