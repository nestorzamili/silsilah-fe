import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon } from '@heroicons/react/24/outline';
import { SEO } from '@/components/SEO';

export function NotFoundPage() {
  return (
    <>
      <SEO
        title="Halaman Tidak Ditemukan - Silsilah Keluarga"
        description="Maaf, halaman yang Anda cari tidak dapat ditemukan di situs Silsilah Keluarga."
        keywords={['halaman tidak ditemukan', '404', 'silsilah', 'keluarga']}
        noIndex={true}
        robots="noindex, follow"
      />
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl font-bold text-emerald-600">404</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-slate-600">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </p>
        <Link to="/" className="mt-6">
          <Button>
            <HomeIcon className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </>
  );
}

export default NotFoundPage;
