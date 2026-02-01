import { Outlet, Link } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Silsilah Keluarga"
              className="h-9 w-9 rounded-lg bg-white object-contain p-1"
            />
            <span className="text-lg font-bold text-slate-900">Silsilah</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>
            Dibuat oleh{' '}
            <a
              href="https://zamili.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-700"
            >
              Nestor Zamili
            </a>
          </p>
          <p className="mt-1">
            © 2026 Silsilah Keluarga. Hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
