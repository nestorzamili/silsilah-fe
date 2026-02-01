import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { changeRequestService, mediaService } from '@/services';
import { useAuthStore } from '@/stores';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/Spinner';
import type { ChangeRequest } from '@/types';

interface ChangeRequestDetailModalProps {
  request: ChangeRequest;
  onClose: () => void;
}

export function ChangeRequestDetailModal({
  request,
  onClose,
}: ChangeRequestDetailModalProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [reviewNote, setReviewNote] = useState('');

  const { data: mediaDetail } = useQuery({
    queryKey: ['media', request.entity_id],
    queryFn: () => mediaService.getById(request.entity_id!),
    enabled: request.entity_type === 'MEDIA' && !!request.entity_id,
    retry: false, // Don't retry if media is deleted
  });

  const canReview =
    request.status === 'PENDING' &&
    (user?.role === 'editor' || user?.role === 'developer') &&
    request.requested_by !== user?.id;

  const approveMutation = useMutation({
    mutationFn: () =>
      changeRequestService.approve(request.id, {
        note: reviewNote || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      onClose();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      changeRequestService.reject(request.id, {
        note: reviewNote || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      onClose();
    },
  });

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE: 'Tambah',
      UPDATE: 'Ubah',
      DELETE: 'Hapus',
    };
    return labels[action] || action;
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PERSON: 'Orang',
      RELATIONSHIP: 'Hubungan',
      MEDIA: 'Media',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      PENDING: 'secondary',
      APPROVED: 'default',
      REJECTED: 'destructive',
    };

    const labels: Record<string, string> = {
      PENDING: 'Pending',
      APPROVED: 'Disetujui',
      REJECTED: 'Ditolak',
    };

    return <Badge variant={variants[status]}>{labels[status] || status}</Badge>;
  };

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      first_name: 'Nama Depan',
      last_name: 'Nama Belakang',
      nickname: 'Nama Panggilan',
      gender: 'Jenis Kelamin',
      birth_date: 'Tanggal Lahir',
      birth_place: 'Tempat Lahir',
      death_date: 'Tanggal Wafat',
      death_place: 'Tempat Wafat',
      is_alive: 'Status',
      bio: 'Biografi',
      avatar_url: 'Foto Profil',
      phone: 'Telepon',
      email: 'Email',
      address: 'Alamat',
      occupation: 'Pekerjaan',
      education: 'Pendidikan',
      religion: 'Agama',
      nationality: 'Kewarganegaraan',
      relationship_type: 'Tipe Hubungan',
      parent_role: 'Peran Orang Tua',
      marriage_date: 'Tanggal Pernikahan',
      marriage_place: 'Tempat Pernikahan',
      divorce_date: 'Tanggal Perceraian',
      child_order: 'Urutan Anak',
      spouse_order: 'Urutan Pasangan',
    };
    return labels[key] || key;
  };

  const formatFieldValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return '-';

    if (key === 'is_alive') {
      return value ? 'Masih Hidup' : 'Almarhum/Almarhumah';
    }

    if (key === 'gender') {
      return value === 'MALE'
        ? 'Laki-laki'
        : value === 'FEMALE'
          ? 'Perempuan'
          : String(value);
    }

    if (key.includes('date') && typeof value === 'string') {
      try {
        return format(new Date(value), 'dd MMMM yyyy', { locale: idLocale });
      } catch {
        return value;
      }
    }

    if (key === 'avatar_url' && typeof value === 'string') {
      return value ? 'Ada foto' : 'Tidak ada foto';
    }

    return String(value);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getActionLabel(request.action)}{' '}
            {getEntityTypeLabel(request.entity_type)}
            {getStatusBadge(request.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              Informasi Permintaan
            </h4>
            <div className="bg-slate-50 p-3 rounded-md space-y-2 text-sm">
              <div>
                <span className="text-slate-600">Diminta oleh: </span>
                <span className="font-medium">
                  {request.requester?.full_name || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Tanggal: </span>
                <span>
                  {format(new Date(request.created_at), 'dd MMMM yyyy, HH:mm', {
                    locale: idLocale,
                  })}
                </span>
              </div>
              {request.requester_note && (
                <div>
                  <span className="text-slate-600">Alasan: </span>
                  <p className="mt-1 text-slate-700">
                    {request.requester_note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {request.entity_type === 'MEDIA' && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                {request.action === 'DELETE'
                  ? 'Media yang Akan Dihapus'
                  : 'Detail Media'}
              </h4>
              {mediaDetail ? (
                <div className="bg-slate-50 p-3 rounded-md space-y-2 text-sm">
                  {mediaDetail.url && (
                    <div className="mb-3">
                      {mediaDetail.mime_type?.startsWith('video/') ? (
                        <video
                          src={mediaDetail.url}
                          className="w-full max-h-48 rounded object-contain bg-slate-100"
                          controls
                        />
                      ) : (
                        <img
                          src={mediaDetail.url}
                          alt={mediaDetail.file_name}
                          className="w-full max-h-48 rounded object-contain bg-slate-100"
                        />
                      )}
                    </div>
                  )}
                  <div>
                    <span className="text-slate-600">Nama file: </span>
                    <span className="font-medium">{mediaDetail.file_name}</span>
                  </div>
                  {mediaDetail.caption && (
                    <div>
                      <span className="text-slate-600">Caption: </span>
                      <span>{mediaDetail.caption}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-600">Ukuran: </span>
                    <span>{(mediaDetail.file_size / 1024).toFixed(2)} KB</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Tipe: </span>
                    <span>{mediaDetail.mime_type}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-3 rounded-md text-sm text-slate-500 italic">
                  {request.status === 'APPROVED'
                    ? 'Media telah dihapus (permintaan sudah disetujui)'
                    : 'Media tidak ditemukan'}
                </div>
              )}
            </div>
          )}

          {request.entity_type !== 'MEDIA' && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Perubahan yang Diajukan
              </h4>
              <div className="bg-slate-50 p-3 rounded-md space-y-2 text-sm">
                {Object.entries(request.payload as Record<string, unknown>).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex gap-2 py-1 border-b border-slate-200 last:border-0"
                    >
                      <span className="text-slate-600 min-w-35">
                        {getFieldLabel(key)}:
                      </span>
                      <span className="font-medium text-slate-900 flex-1">
                        {formatFieldValue(key, value)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {request.reviewed_at && request.reviewer && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Informasi Review
              </h4>
              <div className="bg-slate-50 p-3 rounded-md space-y-2 text-sm">
                <div>
                  <span className="text-slate-600">Ditinjau oleh: </span>
                  <span className="font-medium">
                    {request.reviewer.full_name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Tanggal: </span>
                  <span>
                    {format(
                      new Date(request.reviewed_at),
                      'dd MMMM yyyy, HH:mm',
                      { locale: idLocale },
                    )}
                  </span>
                </div>
                {request.review_note && (
                  <div>
                    <span className="text-slate-600">Catatan: </span>
                    <p className="mt-1">{request.review_note}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {canReview && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Catatan Review (Opsional)
              </label>
              <Textarea
                placeholder="Tambahkan catatan untuk requester..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          {canReview ? (
            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => rejectMutation.mutate()}
                disabled={rejectMutation.isPending || approveMutation.isPending}
              >
                {rejectMutation.isPending && (
                  <Spinner size="sm" className="mr-2" />
                )}
                Tolak
              </Button>
              <Button
                onClick={() => approveMutation.mutate()}
                disabled={rejectMutation.isPending || approveMutation.isPending}
              >
                {approveMutation.isPending && (
                  <Spinner size="sm" className="mr-2" />
                )}
                Setujui
              </Button>
            </div>
          ) : (
            <Button onClick={onClose}>Tutup</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
