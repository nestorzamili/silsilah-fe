import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services';
import { useNotificationStore } from '@/stores';

export function useNotifications() {
  const { setUnreadCount } = useNotificationStore();

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
      return count;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 25000,
  });

  return { unreadCount: unreadCount ?? 0 };
}
