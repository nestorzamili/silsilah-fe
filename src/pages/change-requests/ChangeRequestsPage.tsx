import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { changeRequestService } from '@/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/Spinner';
import { ChangeRequestList } from './components/ChangeRequestList';
import { EmptyState } from '@/components/ui/EmptyState';
import type { RequestStatus } from '@/types';

export function ChangeRequestsPage() {
  const [activeTab, setActiveTab] = useState<RequestStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['change-requests', activeTab, page],
    queryFn: () =>
      changeRequestService.list({
        page,
        page_size: 20,
        status: activeTab === 'all' ? undefined : activeTab,
      }),
  });

  const statusCounts = {
    pending: data?.data?.filter((r) => r.status === 'PENDING').length || 0,
    approved: data?.data?.filter((r) => r.status === 'APPROVED').length || 0,
    rejected: data?.data?.filter((r) => r.status === 'REJECTED').length || 0,
  };

  return (
    <div className="flex-1 p-6 lg:p-8 bg-slate-50">
      <div className="max-w-400 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Permintaan Perubahan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola permintaan perubahan data dari anggota
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              Semua
            </TabsTrigger>
            <TabsTrigger value="PENDING">
              Pending {statusCounts.pending > 0 && `(${statusCounts.pending})`}
            </TabsTrigger>
            <TabsTrigger value="APPROVED">
              Disetujui
            </TabsTrigger>
            <TabsTrigger value="REJECTED">
              Ditolak
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <Card className="p-12">
                <div className="flex justify-center">
                  <Spinner size="lg" />
                </div>
              </Card>
            ) : !data?.data?.length ? (
              <EmptyState
                title="Tidak ada permintaan"
                description={
                  activeTab === 'PENDING'
                    ? 'Tidak ada permintaan perubahan yang menunggu persetujuan'
                    : 'Belum ada permintaan perubahan'
                }
              />
            ) : (
              <ChangeRequestList
                requests={data.data}
                pagination={data.pagination}
                onPageChange={setPage}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ChangeRequestsPage;
