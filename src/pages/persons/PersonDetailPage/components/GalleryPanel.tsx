import { useRef, useState } from 'react';
import type { Media } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { usePermissions } from '@/hooks/usePermissions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MediaThumbnail } from './MediaThumbnail';
import { MediaLightbox } from './MediaLightbox';

interface GalleryPanelProps {
  media: Media[];
  isUploading: boolean;
  isDeleting: boolean;
  onUpload: (file: File) => void;
  onDelete: (mediaId: string, requesterNote?: string) => void;
}

export function GalleryPanel({
  media,
  isUploading,
  isDeleting,
  onUpload,
  onDelete,
}: GalleryPanelProps) {
  const { isMember, canModify } = usePermissions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [requesterNote, setRequesterNote] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  const handleConfirmDelete = () => {
    if (mediaToDelete) {
      onDelete(mediaToDelete.id, requesterNote || undefined);
      setDeleteModalOpen(false);
      setMediaToDelete(null);
      setRequesterNote('');
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setMediaToDelete(null);
    setRequesterNote('');
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Galeri</h2>
          {media.length > 0 && (
            <p className="mt-0.5 text-sm text-slate-600">
              {media.length} foto & video
            </p>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          className="hidden"
        />
        {canModify && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Unggah'}
          </button>
        )}
      </div>

      {media.length === 0 ? (
        canModify ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center py-8 text-slate-400 transition-colors hover:text-slate-500"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <PlusIcon className="h-6 w-6" />
            </div>
            <span className="text-sm text-slate-700">
              Tambahkan foto pertama
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Klik untuk upload
            </span>
          </button>
        ) : (
          <div className="flex w-full flex-col items-center justify-center py-8 text-slate-400">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm text-slate-500">Belum ada media</span>
          </div>
        )
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {media.map((item, index) => (
            <MediaThumbnail
              key={item.id}
              item={item}
              onClick={() => setLightboxIndex(index)}
              onDelete={(mediaId) => {
                const mediaItem = media.find((m) => m.id === mediaId);
                if (mediaItem) {
                  setMediaToDelete(mediaItem);
                  setDeleteModalOpen(true);
                }
              }}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <MediaLightbox
          media={media}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          onDelete={(mediaId) => {
            const mediaItem = media.find((m) => m.id === mediaId);
            if (mediaItem) {
              setMediaToDelete(mediaItem);
              setDeleteModalOpen(true);
            }
          }}
          isDeleting={isDeleting}
        />
      )}

      <Dialog open={deleteModalOpen} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isMember ? 'Ajukan Penghapusan Media' : 'Hapus Media'}
            </DialogTitle>
            {isMember && (
              <DialogDescription className="text-slate-600">
                Pengajuan penghapusan Anda akan ditinjau oleh editor sebelum
                media dihapus.
              </DialogDescription>
            )}
          </DialogHeader>

          {isMember ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Media:</span>{' '}
                  {mediaToDelete?.caption ||
                    mediaToDelete?.file_name ||
                    'Tanpa judul'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requester-note">
                  Alasan penghapusan{' '}
                  <span className="text-slate-500">(opsional)</span>
                </Label>
                <Textarea
                  id="requester-note"
                  placeholder="Contoh: Media tidak relevan, duplikat, atau tidak sesuai..."
                  value={requesterNote}
                  onChange={(e) => setRequesterNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isDeleting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Pengajuan'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-600">
                {mediaToDelete
                  ? `Apakah Anda yakin ingin menghapus "${mediaToDelete.caption || 'media ini'}"? Tindakan ini tidak dapat dibatalkan.`
                  : 'Apakah Anda yakin ingin menghapus media ini? Tindakan ini tidak dapat dibatalkan.'}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Menghapus...
                    </>
                  ) : (
                    'Hapus'
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
