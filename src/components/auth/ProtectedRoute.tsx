import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'member' | 'editor' | 'developer';
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const { data: profileData } = useUserProfile();

  useEffect(() => {
    const checkAuth = () => {
      if (!isHydrated) return;

      if (!isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }

      if (requiredRole && user) {
        const hasPermission =
          user.role === requiredRole ||
          (requiredRole === 'editor' && user.role === 'developer') ||
          (requiredRole === 'member' &&
            (user.role === 'editor' || user.role === 'developer'));

        if (!hasPermission) {
          toast.error('Anda tidak memiliki izin untuk mengakses halaman ini');
          navigate('/', { replace: true });
          return;
        }
      }

      if (profileData && profileData.id === user?.id) {
        useAuthStore.getState().setUser(profileData);
      }
    };

    checkAuth();
  }, [isAuthenticated, requiredRole, navigate, isHydrated, profileData, user]);

  if (!isHydrated || (isAuthenticated && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated && requiredRole && user) {
    const hasPermission =
      user.role === requiredRole ||
      (requiredRole === 'editor' && user.role === 'developer') ||
      (requiredRole === 'member' &&
        (user.role === 'editor' || user.role === 'developer'));

    if (!hasPermission) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Akses Ditolak</h1>
            <p className="mt-2 text-slate-600">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isHydrated, navigate]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
