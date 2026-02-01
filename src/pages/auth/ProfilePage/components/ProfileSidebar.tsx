import { 
  UserCircleIcon, 
  LinkIcon, 
  IdentificationIcon 
} from '@heroicons/react/24/outline';

interface ProfileSidebarProps {
  activeTab: 'profile' | 'ancestors' | 'connection';
  setActiveTab: (tab: 'profile' | 'ancestors' | 'connection') => void;
}

export function ProfileSidebar({ activeTab, setActiveTab }: ProfileSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-emerald-100/50 hidden md:flex flex-col h-full shrink-0 relative z-10 shadow-2xl shadow-emerald-900/10">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Pengaturan</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Kelola Akun</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'profile' 
            ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <UserCircleIcon className={`h-5 w-5 ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'}`} />
          Informasi Akun
        </button>
        <button
          onClick={() => setActiveTab('ancestors')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'ancestors' 
            ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <IdentificationIcon className={`h-5 w-5 ${activeTab === 'ancestors' ? 'text-emerald-600' : 'text-slate-400'}`} />
          Leluhur Saya
        </button>
        <button
          onClick={() => setActiveTab('connection')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'connection' 
            ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <LinkIcon className={`h-5 w-5 ${activeTab === 'connection' ? 'text-emerald-600' : 'text-slate-400'}`} />
          Koneksi Pohon
        </button>
      </nav>
    </aside>
  );
}
