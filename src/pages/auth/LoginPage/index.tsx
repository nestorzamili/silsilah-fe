import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services';
import { useAuthStore } from '@/stores';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.email('Masukkan alamat email yang valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsSubmitting(true);
      const response = await authService.login(data);
      if (response.access_token && response.refresh_token) {
        setAuth(response.user, response.access_token, response.refresh_token);
        toast.success('Berhasil masuk!');
        navigate('/');
      } else {
        toast.error('Gagal masuk: Token tidak tersedia');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal masuk';

      if (
        errorMessage.toLowerCase().includes('email not verified') ||
        errorMessage.toLowerCase().includes('email belum diverifikasi')
      ) {
        toast.error(
          'Email belum diverifikasi. Silakan periksa email Anda untuk verifikasi.',
        );
      } else if (
        errorMessage.toLowerCase().includes('invalid credentials') ||
        errorMessage.toLowerCase().includes('email atau kata sandi salah')
      ) {
        toast.error('Email atau kata sandi salah. Silakan coba lagi.');
      } else if (
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('anda perlu masuk')
      ) {
        toast.error('Sesi Anda telah berakhir. Silakan masuk kembali.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Masuk - Silsilah Keluarga"
        description="Masuk ke akun Silsilah Keluarga Anda untuk mengelola dan menjelajahi silsilah keluarga Anda."
        keywords={[
          'masuk',
          'login',
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
          Selamat Datang Kembali
        </h2>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Daftar
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                autoComplete="current-password"
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
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-slate-600">
                Ingat saya
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-10 font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
