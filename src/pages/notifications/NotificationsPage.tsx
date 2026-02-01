import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { notificationService } from '@/services';
import { useNotificationStore } from '@/stores';
import { NotificationItem } from '@/components/notifications/NotificationItem';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { resetUnread } = useNotificationStore();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'page', page, filter],
    queryFn: () =>
      notificationService.list({
        page,
        page_size: pageSize,
        unread_only: filter === 'unread',
      }),
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
      resetUnread();
    },
  });

  const unreadCount = data?.data?.filter((n) => !n.is_read).length ?? 0;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifikasi</h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola dan lihat semua notifikasi Anda
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={filter}
              onValueChange={(value: 'all' | 'unread') => {
                setFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Notifikasi</SelectItem>
                <SelectItem value="unread">Belum Dibaca</SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                {markAllAsReadMutation.isPending ? (
                  <Spinner size="sm" className="mr-2" />
                ) : null}
                Tandai Semua Dibaca
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner />
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12">
              <EmptyState
                icon={<Bell className="h-16 w-16" />}
                title={
                  filter === 'unread'
                    ? 'Tidak Ada Notifikasi Belum Dibaca'
                    : 'Tidak Ada Notifikasi'
                }
                description={
                  filter === 'unread'
                    ? 'Semua notifikasi Anda sudah dibaca'
                    : 'Anda akan menerima notifikasi tentang aktivitas penting di sini'
                }
              />
            </div>
          ) : (
            <div className="space-y-2">
              {data.data.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                >
                  <NotificationItem notification={notification} />
                </div>
              ))}
            </div>
          )}

          {data && data.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-between bg-white rounded-lg border border-slate-200 px-6 py-4">
              <div className="text-sm text-slate-600">
                Halaman {data.page} dari {data.total_pages} ({data.total_items}{' '}
                notifikasi)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.has_prev}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.has_next}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
