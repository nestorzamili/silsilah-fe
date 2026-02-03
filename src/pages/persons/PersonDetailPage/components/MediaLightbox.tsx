import type { Media } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { usePermissions } from '@/hooks/usePermissions';

interface MediaLightboxProps {
  media: Media[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onDelete: (mediaId: string) => void;
  isDeleting: boolean;
}

export function MediaLightbox({
  media,
  index,
  onClose,
  onNavigate,
  onDelete,
  isDeleting,
}: MediaLightboxProps) {
  const { canModify, isOwner } = usePermissions();
  const item = media[index];
  const isVideo = item.mime_type?.startsWith('video/');

  const canDelete = canModify || isOwner(item.uploaded_by);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      onNavigate(index - 1);
    }
    if (e.key === 'ArrowRight' && index < media.length - 1) {
      e.preventDefault();
      onNavigate(index + 1);
    }
  };

  const handleDeleteClick = () => {
    onDelete(item.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="absolute right-4 top-4 flex gap-2">
        {canDelete && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="rounded-full bg-red-500/80 p-2 text-white backdrop-blur-sm transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        )}
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div
        className="max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={item.url}
            className="max-h-[90vh] rounded-lg"
            controls
            autoPlay
          />
        ) : (
          <img
            src={item.url}
            alt={item.caption || 'Media'}
            className="max-h-[90vh] rounded-lg object-contain"
          />
        )}
      </div>

      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {index + 1} / {media.length}
        </div>
      )}

      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        >
          ←
        </button>
      )}
      {index < media.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        >
          →
        </button>
      )}
    </div>
  );
}
