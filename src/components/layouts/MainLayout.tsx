import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore, useNotificationStore } from '@/stores';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationSheet } from '@/components/notifications/NotificationSheet';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Beranda', href: '/', icon: HomeIcon },
  { name: 'Silsilah', href: '/tree', icon: ChartBarIcon },
  { name: 'Anggota', href: '/persons', icon: UsersIcon },
  {
    name: 'Permintaan',
    href: '/change-requests',
    icon: DocumentCheckIcon,
    roles: ['editor', 'developer'],
  },
];

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === 'true';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);

  // Start polling for notifications
  useNotifications();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setTimeout(() => {
      toast.success('Anda telah berhasil keluar');
    }, 100);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setUserMenuOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 transform bg-white border-r border-emerald-100/50 shadow-2xl shadow-emerald-900/10 transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64 h-full`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-emerald-100/50 px-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 overflow-hidden px-2"
            >
              <div className="h-10 w-10 shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Silsilah Keluarga"
                  className="h-full w-full object-contain"
                />
              </div>
              <span
                className={`text-lg font-black text-emerald-900 tracking-tight transition-all duration-300 ${
                  sidebarCollapsed
                    ? 'lg:hidden lg:w-0 lg:opacity-0'
                    : 'lg:opacity-100'
                }`}
              >
                Silsilah
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-100/50 lg:hidden"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 p-4">
            {navigation
              .filter(
                (item) => !item.roles || item.roles.includes(user?.role || ''),
              )
              .map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarCollapsed ? item.name : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100/50'
                        : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700'
                    } ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${
                        isActive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span
                      className={`transition-all duration-300 ${
                        sidebarCollapsed
                          ? 'lg:hidden lg:w-0 lg:opacity-0'
                          : 'lg:opacity-100'
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
          </nav>

          <div className="hidden border-t border-emerald-100/50 p-3 lg:block">
            <button
              onClick={toggleSidebarCollapse}
              className={`flex w-full items-center gap-2 rounded-xl p-2 text-slate-400 hover:bg-white/50 hover:text-emerald-600 transition-all ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Perluas sidebar' : 'Kecilkan sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeftIcon className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Kecilkan
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="border-t border-emerald-100/50 p-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex w-full items-center gap-3 rounded-xl p-2 transition-all ${
                  userMenuOpen
                    ? 'bg-white shadow-sm ring-1 ring-emerald-100'
                    : 'hover:bg-emerald-50/50'
                } ${sidebarCollapsed ? 'lg:justify-center lg:p-2' : ''}`}
                title={
                  sidebarCollapsed
                    ? user?.full_name ||
                      user?.display_name ||
                      user?.email ||
                      'User'
                    : undefined
                }
              >
                <div className="relative shrink-0">
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={user?.avatar_url}
                      alt={user?.full_name || 'User'}
                    />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                      {(user?.full_name || user?.email || 'U')
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold border-2 border-white"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </div>
                <div
                  className={`min-w-0 flex-1 text-left transition-all duration-300 ${
                    sidebarCollapsed
                      ? 'lg:hidden lg:w-0 lg:opacity-0'
                      : 'lg:opacity-100'
                  }`}
                >
                  <p className="truncate text-sm font-bold text-slate-900">
                    {user?.full_name || user?.display_name || 'User'}
                  </p>
                  <p className="truncate text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                    {user?.role}
                  </p>
                </div>
                <ChevronUpIcon
                  className={`h-4 w-4 shrink-0 text-slate-300 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  } ${sidebarCollapsed ? 'lg:hidden' : ''}`}
                />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div
                    className={`absolute bottom-full z-20 mb-2 rounded-xl border border-emerald-100 bg-white py-1.5 shadow-xl shadow-emerald-900/5 ${sidebarCollapsed ? 'lg:left-full lg:bottom-0 lg:ml-2' : 'left-0 right-0'}`}
                    style={sidebarCollapsed ? { minWidth: '200px' } : undefined}
                  >
                    <button
                      onClick={() => {
                        setNotificationSheetOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <BellIcon className="h-4 w-4" />
                      <span className="flex-1 text-left">Notifikasi</span>
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] font-bold"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </button>
                    <div className="my-1 border-t border-emerald-50" />
                    <Link
                      to="/profile"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setSidebarOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      Profil Saya
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setSidebarOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <Cog6ToothIcon className="h-4 w-4" />
                      Pengaturan
                    </Link>

                    {user?.role === 'developer' && (
                      <Link
                        to="/admin/users"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setSidebarOpen(false);
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <UserGroupIcon className="h-4 w-4" />
                        Manajemen Pengguna
                      </Link>
                    )}

                    <div className="my-1 border-t border-emerald-50" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Keluar Aplikasi
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <header className="shrink-0 sticky top-0 z-30 flex h-14 items-center justify-between border-b border-emerald-100/50 bg-white/80 px-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <span className="ml-3 font-bold text-emerald-900 tracking-tight">
              Silsilah Keluarga
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotificationSheetOpen(true)}
            className="relative p-2 hover:bg-emerald-50"
          >
            <BellIcon className="h-5 w-5 text-slate-600" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </header>

        <main className="flex-1 flex flex-col overflow-y-auto relative bg-white">
          <Outlet />
        </main>
      </div>

      <NotificationSheet
        open={notificationSheetOpen}
        onOpenChange={setNotificationSheetOpen}
      />
    </div>
  );
}
