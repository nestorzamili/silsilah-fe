import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';

const resendVerificationSchema = z.object({
  email: z.email('Masukkan alamat email yang valid'),
});

type ResendVerificationForm = z.infer<typeof resendVerificationSchema>;

export function ResendVerificationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationForm>({
    resolver: zodResolver(resendVerificationSchema),
  });

  const onSubmit = async (data: ResendVerificationForm) => {
    try {
      await authService.resendVerificationEmail(data.email);
      setIsSubmitted(true);
      toast.success(
        'Email verifikasi telah dikirim. Silakan periksa kotak masuk Anda.',
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setIsSubmitted(true);
      toast.success(
        'Email verifikasi telah dikirim. Silakan periksa kotak masuk Anda.',
      );
    }
  };

  if (isSubmitted) {
    return (
      <>
        <SEO
          title="Verifikasi Email Dikirim Ulang - Silsilah Keluarga"
          description="Kami telah mengirim ulang email verifikasi ke alamat email Anda. Periksa kotak masuk dan klik tautan verifikasi untuk mengaktifkan akun Silsilah Keluarga Anda."
          keywords={[
            'verifikasi email',
            'kirim ulang',
            'silsilah',
            'keluarga',
            'akun',
            'pendaftaran',
          ]}
          noIndex={true}
          robots="noindex, follow"
        />
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <EnvelopeIcon className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Email Verifikasi Terkirim
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Kami telah mengirimkan email verifikasi ke alamat email Anda.
            Silakan periksa kotak masuk dan klik tautan verifikasi untuk
            mengaktifkan akun Anda.
          </p>
          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-left">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Tidak menerima email?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Periksa folder spam atau junk mail</li>
                    <li>Tunggu beberapa menit jika email belum sampai</li>
                    <li>Pastikan alamat email yang dimasukkan benar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Kembali ke Login
            </Link>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Kirim Ulang Email
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Kirim Ulang Email Verifikasi - Silsilah Keluarga"
        description="Kirim ulang email verifikasi ke alamat email Anda untuk mengaktifkan akun Silsilah Keluarga Anda."
        keywords={[
          'verifikasi email',
          'kirim ulang',
          'silsilah',
          'keluarga',
          'akun',
          'pendaftaran',
        ]}
        noIndex={true}
        robots="noindex, follow"
      />
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kirim Ulang Email Verifikasi
        </h2>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          Masukkan email Anda dan kami akan mengirimkan ulang email verifikasi.
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
            {isSubmitting ? 'Mengirim...' : 'Kirim Email Verifikasi'}
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

export default ResendVerificationPage;
