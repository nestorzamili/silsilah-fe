import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { personService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useAuthStore } from '@/stores';
import { useDebounce } from '@/hooks/useDebounce';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SEO } from '@/components/SEO';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import type { Person } from '@/types';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

function getFullName(person: Person): string {
  return person.last_name
    ? `${person.first_name} ${person.last_name}`
    : person.first_name;
}

function generatePaginationItems(currentPage: number, totalPages: number) {
  const items: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) items.push(i);
    return items;
  }

  items.push(1);
  if (currentPage > 3) items.push('ellipsis');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) items.push(i);

  if (currentPage < totalPages - 2) items.push('ellipsis');
  items.push(totalPages);

  return items;
}

export function PersonsListPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 25;
  
  const canAdd = currentUser?.role === 'editor' || currentUser?.role === 'developer';

  const debouncedSearch = useDebounce(searchInput.trim(), 300);

  const listQuery = useQuery({
    queryKey: QUERY_KEYS.PERSONS.LIST(page, pageSize),
    queryFn: () => personService.list({ page, page_size: pageSize }),
    placeholderData: keepPreviousData,
    enabled: !debouncedSearch,
  });

  const searchQuery = useQuery({
    queryKey: QUERY_KEYS.PERSONS.SEARCH(debouncedSearch),
    queryFn: () => personService.search(debouncedSearch, 50),
    placeholderData: keepPreviousData,
    enabled: !!debouncedSearch,
  });

  const isSearchMode = !!debouncedSearch;
  const isLoading = isSearchMode ? searchQuery.isLoading : listQuery.isLoading;
  const isFetching = isSearchMode
    ? searchQuery.isFetching
    : listQuery.isFetching;

  const persons = isSearchMode
    ? (searchQuery.data ?? [])
    : (listQuery.data?.data ?? []);

  const totalItems = isSearchMode
    ? persons.length
    : (listQuery.data?.total_items ?? 0);

  const totalPages = isSearchMode ? 1 : (listQuery.data?.total_pages ?? 1);
  const hasNext = !isSearchMode && (listQuery.data?.has_next ?? false);
  const hasPrev = !isSearchMode && (listQuery.data?.has_prev ?? false);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setPage(1);
  }, []);

  const paginationItems = generatePaginationItems(page, totalPages);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Daftar Anggota Keluarga - Silsilah Keluarga"
        description={`Daftar ${totalItems} anggota keluarga dalam sistem silsilah keluarga. Cari dan jelajahi profil keluarga Anda secara lengkap.`}
        keywords={['daftar anggota', 'keluarga', 'silsilah', 'profil keluarga', 'cari orang']}
        canonical="https://silsilah.zamili.dev/persons"
      />
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
        <header className="shrink-0 bg-white px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Anggota Keluarga
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                {totalItems} orang {isSearchMode ? 'ditemukan' : 'terdaftar'}
              </p>
            </div>
            {canAdd && (
              <button
                onClick={() => navigate('/persons/new')}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Orang
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama..."
                value={searchInput}
                onChange={handleSearchChange}
                className="h-10 border-slate-300 bg-white pl-9 pr-8 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            {isFetching && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {persons.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {persons.map((person: Person) => (
                <Link
                  key={person.id}
                  to={`/persons/${person.id}`}
                  className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-sm hover:bg-emerald-50/30"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="hidden sm:block h-12 w-12 shrink-0">
                      <AvatarImage
                        src={person.avatar_url}
                        alt={getFullName(person)}
                      />
                      <AvatarFallback className="bg-emerald-50 text-sm font-medium text-emerald-600">
                        {getFullName(person).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-slate-900 group-hover:text-emerald-600">
                        {getFullName(person)}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">
                      {person.birth_date
                        ? new Date(person.birth_date).getFullYear()
                        : '—'}
                    </span>
                    <Badge
                      variant={person.is_alive ? 'secondary' : 'outline'}
                      className="h-5 px-1.5 text-[10px]"
                    >
                      {person.is_alive ? 'Hidup' : 'Meninggal'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={UsersIcon}
                title={isSearchMode ? 'Tidak ditemukan' : 'Belum ada anggota'}
                description={
                  isSearchMode
                    ? `Tidak ada hasil untuk "${debouncedSearch}"`
                    : 'Tambahkan anggota keluarga pertama.'
                }
                action={
                  !isSearchMode
                    ? {
                        label: 'Tambah Orang',
                        onClick: () => navigate('/persons/new'),
                      }
                    : undefined
                }
              />
            </div>
          )}
        </main>

        {!isSearchMode && totalPages > 1 && (
          <footer className="shrink-0 border-t border-slate-200 px-4 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => hasPrev && setPage((p) => p - 1)}
                    className={
                      !hasPrev
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {paginationItems.map((item, idx) =>
                  item === 'ellipsis' ? (
                    <PaginationItem key={`e-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        onClick={() => setPage(item)}
                        isActive={page === item}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => hasNext && setPage((p) => p + 1)}
                    className={
                      !hasNext
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </footer>
        )}
      </div>
    </>
  );
}

export default PersonsListPage;
