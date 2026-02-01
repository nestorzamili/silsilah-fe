import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasBeenCalled, setHasBeenCalled] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('Token verifikasi tidak ditemukan');
        toast.error('Token verifikasi tidak ditemukan');
        return;
      }

      if (hasBeenCalled) {
        return;
      }

      setHasBeenCalled(true);

      try {
        await authService.verifyEmail(token);
        setVerificationStatus('success');
        toast.success(
          'Email berhasil diverifikasi! Anda sekarang dapat masuk.',
        );
      } catch (err) {
        setVerificationStatus('error');
        const errorMessage =
          err instanceof Error ? err.message : 'Verifikasi email gagal';
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyEmail();
  }, [searchParams, hasBeenCalled]);

  const handleResendVerification = async () => {
    // TODO: Implement resend verification functionality
    toast.info('Fitur kirim ulang verifikasi akan segera tersedia');
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'pending':
        return (
          <div className="text-center">
            <div className="flex justify-center">
              <ArrowPathIcon className="h-12 w-12 animate-spin text-emerald-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
              Memverifikasi Email
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Mohon tunggu sebentar, kami sedang memverifikasi email Anda...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
              Email Berhasil Diverifikasi!
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Akun Anda telah berhasil diverifikasi. Anda sekarang dapat masuk
              ke aplikasi.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-10 font-bold"
              >
                Masuk ke Akun
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
              Verifikasi Gagal
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              {errorMessage ||
                'Terjadi kesalahan saat memverifikasi email Anda.'}
            </p>
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Kembali ke Login
              </Button>
              <Button
                onClick={handleResendVerification}
                variant="outline"
                className="w-full"
              >
                Kirim Ulang Verifikasi
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SEO
        title="Verifikasi Email - Silsilah Keluarga"
        description="Verifikasi email Anda untuk menyelesaikan pendaftaran akun Silsilah Keluarga Anda."
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
      <div>{renderContent()}</div>
    </>
  );
}

export default EmailVerificationPage;
