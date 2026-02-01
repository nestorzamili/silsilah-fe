import { useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { ChangeRequestDetailModal } from './ChangeRequestDetailModal';
import type { ChangeRequest, PaginatedResponse } from '@/types';

interface ChangeRequestListProps {
  requests: ChangeRequest[];
  pagination: PaginatedResponse<ChangeRequest>['pagination'];
  onPageChange: (page: number) => void;
}

export function ChangeRequestList({
  requests,
  pagination,
  onPageChange,
}: ChangeRequestListProps) {
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(
    null,
  );

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

    return (
      <Badge variant={variants[status]}>
        {labels[status] || status}
      </Badge>
    );
  };

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

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-16">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Pemohon
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Tanggal Pengajuan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Tanggal Review
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {requests.map((request, index) => {
                const rowNumber = pagination ? (pagination.page - 1) * pagination.page_size + index + 1 : index + 1;
                return (
                  <tr
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600 text-center">
                      {rowNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {getEntityTypeLabel(request.entity_type)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {getActionLabel(request.action)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-slate-900">
                        {request.requester?.full_name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {format(new Date(request.created_at), 'dd MMM yyyy, HH:mm', {
                        locale: idLocale,
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {request.reviewed_at ? (
                        <div>
                          <div>{format(new Date(request.reviewed_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}</div>
                          {request.reviewer && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              oleh {request.reviewer.full_name}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(request.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {pagination && pagination.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Menampilkan {(pagination.page - 1) * pagination.page_size + 1} -{' '}
            {Math.min(pagination.page * pagination.page_size, pagination.total_items)} dari{' '}
            {pagination.total_items} data
          </p>
          <Pagination>
            <PaginationContent>
              {pagination.page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(pagination.page - 1)}
                  />
                </PaginationItem>
              )}

              {[...Array(pagination.total_pages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === pagination.total_pages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === pagination.page}
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === pagination.page - 2 ||
                  page === pagination.page + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {pagination.page < pagination.total_pages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(pagination.page + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {selectedRequest && (
        <ChangeRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
}
