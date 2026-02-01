import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  Bell,
  CheckCircle,
  XCircle,
  FileEdit,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { notificationService } from '@/services';
import { useNotificationStore } from '@/stores';
import type { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { decrementUnread } = useNotificationStore();

  const markAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAsRead(notification.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
      if (!notification.is_read) {
        decrementUnread();
      }
    },
  });

  const handleClick = () => {
    if (!notification.is_read) {
      markAsReadMutation.mutate();
    }

    if (notification.data?.entity_type && notification.data?.entity_id) {
      const entityType = notification.data.entity_type;
      const entityId = notification.data.entity_id;

      switch (entityType) {
        case 'PERSON':
          navigate(`/persons/${entityId}`);
          break;
        case 'RELATIONSHIP':
          if (notification.data.person_id) {
            navigate(`/persons/${notification.data.person_id}`);
          }
          break;
        case 'MEDIA':
          if (notification.data.person_id) {
            navigate(`/persons/${notification.data.person_id}`);
          }
          break;
        default:
          break;
      }
      onClose?.();
    } else if (notification.data?.person_id) {
      navigate(`/persons/${notification.data.person_id}`);
      onClose?.();
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'CHANGE_REQUEST':
        return <FileEdit className="h-5 w-5 text-blue-500" />;
      case 'CHANGE_APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CHANGE_REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'NEW_COMMENT':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const translateMessage = (title: string, message: string) => {
    let translatedTitle = title;
    if (
      title === 'Change Request Approved' ||
      title === 'Your change request has been approved'
    ) {
      translatedTitle = 'Permintaan Disetujui';
    } else if (
      title === 'Change Request Rejected' ||
      title === 'Your change request has been rejected'
    ) {
      translatedTitle = 'Permintaan Ditolak';
    } else if (title === 'New Change Request') {
      translatedTitle = 'Permintaan Perubahan Baru';
    }

    let translatedMessage = message;
    if (message.includes('Your change request has been approved')) {
      translatedMessage = message.replace(
        'Your change request has been approved',
        'Permintaan Anda telah disetujui',
      );
    } else if (message.includes('Your change request has been rejected')) {
      translatedMessage = message.replace(
        'Your change request has been rejected',
        'Permintaan Anda telah ditolak',
      );
    }

    return { title: translatedTitle, message: translatedMessage };
  };

  const { title, message } = translateMessage(
    notification.title,
    notification.message,
  );

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors',
        !notification.is_read && 'bg-blue-50/50',
      )}
    >
      <div className="flex gap-3">
        <div className="shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-slate-900">{title}</p>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{message}</p>
          <p className="text-xs text-slate-400 mt-1">
            {formatDistanceToNow(new Date(notification.created_at), {
              locale: idLocale,
              addSuffix: true,
            })}
          </p>
        </div>
        {!notification.is_read && (
          <div className="shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
          </div>
        )}
      </div>
    </div>
  );
}
