import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const registerSchema = z
  .object({
    email: z.email('Masukkan alamat email yang valid'),
    password: z
      .string()
      .min(8, 'Kata sandi minimal 8 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Kata sandi harus mengandung huruf besar, huruf kecil, dan angka',
      ),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
    full_name: z
      .string()
      .min(2, 'Nama lengkap minimal 2 karakter')
      .max(100, 'Nama lengkap maksimal 100 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsSubmitting(true);
      const { confirmPassword, ...registerData } = data;
      void confirmPassword;
      await authService.register(registerData);
      setRegistrationSuccess(true);
      toast.success(
        'Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi.',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal mendaftar';

      if (
        errorMessage.toLowerCase().includes('email already exists') ||
        errorMessage.toLowerCase().includes('email sudah terdaftar')
      ) {
        toast.error(
          'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun yang sudah ada.',
        );
      } else if (
        errorMessage.toLowerCase().includes('invalid request') ||
        errorMessage.toLowerCase().includes('data tidak valid')
      ) {
        toast.error(
          'Data yang dimasukkan tidak valid. Silakan periksa kembali formulir.',
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <>
        <SEO
          title="Verifikasi Email - Silsilah Keluarga"
          description="Verifikasi email Anda untuk menyelesaikan pendaftaran akun Silsilah Keluarga."
          keywords={[
            'verifikasi email',
            'silsilah',
            'keluarga',
            'akun',
            'pendaftaran',
          ]}
          noIndex={true}
          robots="noindex, follow"
        />
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            Verifikasi Email Diperlukan
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Kami telah mengirimkan email verifikasi ke alamat email Anda.
            Silakan klik tautan di email tersebut untuk memverifikasi akun Anda.
          </p>
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Tidak menerima email?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Periksa folder spam atau{' '}
                    <Link
                      to="/resend-verification"
                      className="font-medium text-blue-800 underline hover:text-blue-900"
                    >
                      kirim ulang email verifikasi
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full"
            >
              Kembali ke Login
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Daftar - Silsilah Keluarga"
        description="Daftar akun baru di Silsilah Keluarga untuk mulai mengelola dan menjelajahi silsilah keluarga Anda."
        keywords={[
          'daftar',
          'register',
          'silsilah',
          'keluarga',
          'akun',
          'otentikasi',
        ]}
        noIndex={true}
        robots="noindex, follow"
      />
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Masuk
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="full_name"
              className="text-sm font-semibold text-slate-700"
            >
              Nama Lengkap
            </Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Nama lengkap Anda"
              autoComplete="name"
              className="h-10 border-slate-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              {...register('full_name')}
            />
            {errors.full_name && (
              <p className="text-sm font-semibold text-red-600">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="anda@contoh.com"
              autoComplete="email"
              className="h-10 border-slate-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm font-semibold text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Kata Sandi
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className="h-10 border-slate-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm font-semibold text-red-600">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs font-medium text-slate-500">
              Kata sandi harus minimal 8 karakter dan mengandung huruf besar,
              huruf kecil, dan angka
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-slate-700"
            >
              Konfirmasi Kata Sandi
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className="h-10 border-slate-300 bg-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm font-semibold text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-10 font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-500">
                Dengan mendaftar, Anda menyetujui
              </span>
            </div>
          </div>
          <div className="mt-4 text-center text-xs font-medium text-slate-500">
            <Link
              to="/terms"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Syarat dan Ketentuan
            </Link>{' '}
            dan{' '}
            <Link
              to="/privacy"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
