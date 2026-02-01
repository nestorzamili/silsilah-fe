import { useState } from 'react';
import type { Media } from '@/types';
import { PlayCircleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores';

interface MediaThumbnailProps {
  item: Media;
  onClick: () => void;
  onDelete: (mediaId: string) => void;
  isDeleting: boolean;
}

export function MediaThumbnail({
  item,
  onClick,
  onDelete,
  isDeleting,
}: MediaThumbnailProps) {
  const { user: currentUser } = useAuthStore();
  const isVideo = item.mime_type?.startsWith('video/');
  const [showDelete, setShowDelete] = useState(false);
  
  const canDelete = currentUser?.role === 'member' ||
                    currentUser?.id === item.uploaded_by || 
                    currentUser?.role === 'editor' || 
                    currentUser?.role === 'developer';

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <button
        onClick={onClick}
        className="h-full w-full"
      >
        {isVideo ? (
          <>
            <video
              src={item.url}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <PlayCircleIcon className="h-10 w-10 text-white/90" />
            </div>
          </>
        ) : (
          <img
            src={item.url}
            alt={item.caption || 'Media'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </button>

      {canDelete && (showDelete || isDeleting) && (
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
    </div>
  );
}
