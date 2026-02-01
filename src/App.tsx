import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { MainLayout } from '@/components/layouts/MainLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/auth/ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(
  () => import('@/pages/auth/ForgotPasswordPage'),
);
const ResendVerificationPage = lazy(
  () => import('@/pages/auth/ResendVerificationPage'),
);
const ProfilePage = lazy(() => import('@/pages/auth/ProfilePage'));
const EmailVerificationPage = lazy(() => import('@/pages/auth/EmailVerificationPage'));
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const FamilyTreePage = lazy(() => import('@/pages/family-tree'));
const PersonDetailPage = lazy(() => import('@/pages/persons/PersonDetailPage'));
const PersonsListPage = lazy(() => import('@/pages/persons/PersonsListPage'));
const PersonFormPage = lazy(() => import('@/pages/persons/PersonFormPage'));
const ChangeRequestsPage = lazy(() => import('@/pages/change-requests/ChangeRequestsPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));

const NotFoundPage = lazy(() => import('@/pages/not-found'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster 
        position="bottom-right" 
        richColors
        toastOptions={{
          duration: 3000,
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={
            <PublicOnlyRoute>
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            </PublicOnlyRoute>
          }>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/resend-verification" element={<ResendVerificationPage />} />
          </Route>

          <Route path="/verify-email" element={
            <AuthLayout>
              <EmailVerificationPage />
            </AuthLayout>
          } />

          <Route
            element={(
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            )}
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tree" element={<FamilyTreePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/persons" element={<PersonsListPage />} />
            <Route path="/persons/new" element={<PersonFormPage />} />
            <Route path="/persons/:id" element={<PersonDetailPage />} />
            <Route path="/persons/:id/edit" element={<PersonFormPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
          
          <Route
            element={(
              <ProtectedRoute requiredRole="editor">
                <MainLayout />
              </ProtectedRoute>
            )}
          >
            <Route path="/change-requests" element={<ChangeRequestsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute requiredRole="developer">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/users" element={<UserManagementPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </QueryClientProvider>
  );
}