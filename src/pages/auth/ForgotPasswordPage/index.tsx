import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';

const forgotPasswordSchema = z.object({
  email: z.email('Masukkan alamat email yang valid'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success(
        'Instruksi reset kata sandi telah dikirim. Silakan periksa email Anda.',
      );
    } catch {
      setIsSubmitted(true);
      toast.success(
        'Instruksi reset kata sandi telah dikirim. Silakan periksa email Anda.',
      );
    }
  };

  if (isSubmitted) {
    return (
      <>
        <SEO
          title="Reset Kata Sandi - Silsilah Keluarga"
          description="Ikuti instruksi yang telah dikirim ke email Anda untuk mereset kata sandi akun Silsilah Keluarga Anda."
          keywords={[
            'reset kata sandi',
            'lupa kata sandi',
            'silsilah',
            'keluarga',
            'akun',
          ]}
          noIndex={true}
          robots="noindex, follow"
        />
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Periksa Email Anda
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Jika akun dengan email tersebut ada, kami telah mengirimkan
            instruksi untuk mereset kata sandi Anda.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke halaman masuk
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Lupa Kata Sandi - Silsilah Keluarga"
        description="Reset kata sandi akun Silsilah Keluarga Anda. Masukkan email Anda dan kami akan mengirimkan instruksi untuk mereset kata sandi."
        keywords={[
          'lupa kata sandi',
          'reset kata sandi',
          'silsilah',
          'keluarga',
          'akun',
        ]}
        noIndex={true}
        robots="noindex, follow"
      />
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Lupa Kata Sandi
        </h2>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          Masukkan email Anda dan kami akan mengirimkan instruksi untuk mereset
          kata sandi.
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

          <Button
            type="submit"
            className="w-full h-10 font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Instruksi Reset'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
