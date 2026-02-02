import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-cyan-50 flex">
      <div className="hidden w-1/2 lg:flex flex-col justify-between bg-linear-to-br from-emerald-600 to-cyan-600 p-12 text-white">
        <div className="flex flex-col items-start">
          <img
            src="/logo.png"
            alt="Silsilah Keluarga"
            className="h-24 w-24 mb-6"
          />
        </div>

        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-4 tracking-tight whitespace-nowrap">
            Kisah Keluarga Kita Dimulai Di Sini
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed font-medium">
            Menghubungkan Generasi,
            <br />
            Menjaga Warisan Keluarga Kita
          </p>
        </div>

        <div className="text-sm">
          <p>
            © 2026 Silsilah Keluarga. Dibuat dengan ❤️ oleh{' '}
            <a
              href="https://zamili.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white font-semibold"
            >
              Nestor Zamili
            </a>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-3">
              <img
                src="/logo.png"
                alt="Silsilah Keluarga"
                className="h-20 w-20"
              />
              <h1 className="text-3xl font-bold text-emerald-600 tracking-tight">
                Silsilah Keluarga
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
