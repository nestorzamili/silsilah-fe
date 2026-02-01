import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { notificationService } from '@/services';
import { useNotificationStore } from '@/stores';
import { NotificationItem } from './NotificationItem';

interface NotificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationSheet({
  open,
  onOpenChange,
}: NotificationSheetProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { resetUnread } = useNotificationStore();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'sheet'],
    queryFn: () => notificationService.list({ page: 1, page_size: 20 }),
    enabled: open,
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-100 p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifikasi</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="text-xs"
              >
                {markAllAsReadMutation.isPending ? (
                  <Spinner size="sm" className="mr-1" />
                ) : null}
                Tandai Semua Dibaca
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Spinner />
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-12 w-12" />}
              title="Tidak Ada Notifikasi"
              description="Anda akan menerima notifikasi tentang aktivitas penting di sini"
            />
          ) : (
            <div className="space-y-2">
              {data.data.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={() => onOpenChange(false)}
                />
              ))}
            </div>
          )}
        </div>

        {data?.data && data.data.length > 0 && (
          <div className="px-6 py-3 border-t bg-slate-50">
            <Button
              variant="link"
              className="w-full text-sm"
              onClick={() => {
                onOpenChange(false);
                navigate('/notifications');
              }}
            >
              Lihat Semua Notifikasi
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
