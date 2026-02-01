import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProfileSidebar } from './components/ProfileSidebar';
import { AccountInfoTab } from './components/AccountInfoTab';
import { AncestorsTab } from './components/AncestorsTab';
import { ConnectionTab } from './components/ConnectionTab';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'ancestors' | 'connection'>('profile');

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="flex flex-1 min-h-0">
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 flex flex-col overflow-y-auto bg-white">
          <div className="max-w-6xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col">
            <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide shrink-0">
              <Button 
                variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('profile')}
                className={`rounded-lg font-semibold h-9 px-4 ${activeTab === 'profile' ? 'bg-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Profil
              </Button>
              <Button 
                variant={activeTab === 'ancestors' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('ancestors')}
                className={`rounded-lg font-semibold h-9 px-4 ${activeTab === 'ancestors' ? 'bg-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Leluhur
              </Button>
              <Button 
                variant={activeTab === 'connection' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('connection')}
                className={`rounded-lg font-semibold h-9 px-4 ${activeTab === 'connection' ? 'bg-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Koneksi
              </Button>
            </div>

            {activeTab === 'profile' && <AccountInfoTab />}
            {activeTab === 'ancestors' && (
              <AncestorsTab onSwitchToConnection={() => setActiveTab('connection')} />
            )}
            {activeTab === 'connection' && <ConnectionTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
