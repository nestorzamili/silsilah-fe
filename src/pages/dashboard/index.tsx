import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { personService, graphService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Spinner } from '@/components/ui/Spinner';
import { SEO } from '@/components/SEO';
import {
  StatCard,
  GenderDistributionCard,
  LifeStatusCard,
  RecentActivitiesCard,
} from './components';

export function DashboardPage() {
  const navigate = useNavigate();
  const { isLoading: personsLoading } = useQuery({
    queryKey: QUERY_KEYS.PERSONS.LIST(1, 10),
    queryFn: () => personService.list({ page: 1, page_size: 10 }),
  });

  const { data: graphData, isLoading: graphLoading } = useQuery({
    queryKey: QUERY_KEYS.GRAPH,
    queryFn: () => graphService.getFullGraph(),
  });

  const graphStats = graphData?.stats;
  const totalMembers = graphStats?.total_persons ?? 0;
  const livingMembers = graphStats?.living_persons ?? 0;
  const deceasedMembers = graphStats?.deceased_persons ?? 0;
  const totalRelationships = graphStats?.total_relationships ?? 0;

  const maleCount = graphData?.nodes.filter((n) => n.gender === 'MALE').length ?? 0;
  const femaleCount = graphData?.nodes.filter((n) => n.gender === 'FEMALE').length ?? 0;

  const livingPercentage = totalMembers > 0 ? (livingMembers / totalMembers) * 100 : 0;

  const stats = [
    {
      name: 'Total Anggota',
      value: totalMembers,
      description: 'Terdaftar di silsilah',
    },
    {
      name: 'Anggota Hidup',
      value: livingMembers,
      description: `${livingPercentage.toFixed(0)}% dari total`,
    },
    {
      name: 'Hubungan',
      value: totalRelationships,
      description: 'Relasi keluarga',
    },
  ];

  const isLoading = personsLoading || graphLoading;

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
        title="Beranda - Silsilah Keluarga"
        description="Dashboard beranda silsilah keluarga. Pantau statistik anggota keluarga, distribusi gender, dan aktivitas terbaru dalam sistem silsilah keluarga Anda."
        keywords={['beranda', 'dashboard', 'silsilah', 'keluarga', 'statistik', 'anggota keluarga']}
        canonical="https://silsilah.zamili.dev/"
      />
      <div className="flex-1 p-6 lg:p-8 bg-slate-50">
        <div className="max-w-400 mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Beranda</h1>
              <p className="mt-1 text-sm text-slate-600 font-medium">
                Selamat datang! Berikut ringkasan silsilah keluarga berdasarkan data yang terdaftar di sistem saat ini.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/persons/new')}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Orang
              </button>
              <button
                onClick={() => navigate('/tree')}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Lihat Silsilah
              </button>
            </div>
          </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.name}
              name={stat.name}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <GenderDistributionCard
            maleCount={maleCount}
            femaleCount={femaleCount}
            totalMembers={totalMembers}
          />

          <LifeStatusCard
            livingMembers={livingMembers}
            deceasedMembers={deceasedMembers}
            totalMembers={totalMembers}
          />
        </div>

        <RecentActivitiesCard />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
