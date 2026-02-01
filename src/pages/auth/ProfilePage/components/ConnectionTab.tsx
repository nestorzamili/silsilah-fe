import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, personService } from '@/services';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';
import { 
  LinkIcon, 
  MagnifyingGlassIcon, 
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';
import { useDebounce } from '@/hooks/useDebounce';
import { getFullName } from '@/utils/person';

export function ConnectionTab() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: connectedPerson, isLoading: isLoadingConnected } = useQuery({
    queryKey: ['persons', user?.person_id],
    queryFn: () => personService.getById(user!.person_id!),
    enabled: !!user?.person_id,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['persons', 'search', debouncedSearch],
    queryFn: () => personService.search(debouncedSearch, 5),
    enabled: !!debouncedSearch && debouncedSearch.length > 2,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { person_id?: string | null }) => 
      userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      toast.success(updatedUser.person_id ? 'Profil berhasil dihubungkan' : 'Koneksi berhasil diputus');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui koneksi');
    },
  });

  const handleClaimPerson = (personId: string) => {
    updateProfileMutation.mutate({
      person_id: personId,
    });
  };

  const handleUnlinkPerson = () => {
    updateProfileMutation.mutate({
      person_id: null,
    });
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
        <div className="flex items-center gap-5 mb-10">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
            <LinkIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Koneksi Silsilah</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Sinkronisasi Data Keluarga</p>
          </div>
        </div>

        {user?.person_id ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
              <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100/50 relative">
                {isLoadingConnected ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <CheckBadgeIcon className="h-10 w-10" />
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  </>
                )}
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-lg font-bold text-emerald-900 tracking-tight">
                  {connectedPerson ? getFullName(connectedPerson) : 'Profil Terhubung'}
                </h3>
                <p className="text-emerald-700/70 text-sm mt-1 mb-6 font-medium leading-relaxed max-w-xl">
                  {connectedPerson 
                    ? `Akun Anda terhubung dengan ${getFullName(connectedPerson)}. Data silsilah dan garis keturunan akan disinkronkan secara otomatis.`
                    : 'Akun Anda telah berhasil terhubung dengan silsilah keluarga. Nikmati pembaruan data otomatis dan akses ke garis keturunan.'}
                </p>
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl h-10" 
                  onClick={handleUnlinkPerson}
                  disabled={updateProfileMutation.isPending}
                >
                  Putus Koneksi
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-1 mb-2">
              <h3 className="text-lg font-bold text-slate-800">Cari Diri Anda</h3>
              <p className="text-sm text-slate-500 font-medium">Temukan data Anda di sistem silsilah untuk menghubungkan akun.</p>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
              </div>
              <Input 
                placeholder="Ketik nama lengkap Anda..." 
                className="pl-11 h-14 rounded-xl border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 text-base font-medium transition-all shadow-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isSearching && (
              <div className="flex flex-col items-center justify-center py-10">
                <Spinner className="mb-3" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Mencari...</p>
              </div>
            )}

            {searchResults && searchResults.length > 0 ? (
              <div className="space-y-3 animate-in fade-in duration-500">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Hasil Pencarian</Label>
                {searchResults.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-slate-100">
                        <AvatarImage src={person.avatar_url} />
                        <AvatarFallback className="bg-emerald-50 text-emerald-600 font-bold text-xs">
                          {person.first_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                          {getFullName(person)} {person.nickname ? `(${person.nickname})` : ''}
                        </p>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          <p className="text-[10px] font-medium text-slate-400">
                            {person.birth_date ? new Date(person.birth_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Tgl lahir tidak diketahui'}
                            {person.birth_place ? ` • ${person.birth_place}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-9 text-xs transition-all" 
                      onClick={() => handleClaimPerson(person.id)}
                      disabled={updateProfileMutation.isPending}
                    >
                      Hubungkan
                    </Button>
                  </div>
                ))}
              </div>
            ) : debouncedSearch && !isSearching && (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic text-sm">Tidak ditemukan data untuk "{debouncedSearch}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
