import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/Spinner';
import { auditService } from '@/services';
import type { AuditLog } from '@/services';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export function RecentActivitiesCard() {
  const navigate = useNavigate();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => auditService.getRecentActivities(5),
  });

  const getActionLabel = (action: string) => {
    const lowerAction = action.toLowerCase();

    switch (lowerAction) {
      case 'create':
        return 'menambahkan';
      case 'update':
        return 'mengedit';
      case 'delete':
        return 'menghapus';
      case 'approve_change_request':
        return 'menyetujui permintaan perubahan';
      case 'reject_change_request':
        return 'menolak permintaan perubahan';
      default:
        return action.toLowerCase().replace(/_/g, ' ');
    }
  };

  const getEntityLabel = (entityType: string) => {
    const normalizedType = entityType.toLowerCase();
    switch (normalizedType) {
      case 'person':
        return 'anggota';
      case 'relationship':
        return 'hubungan';
      case 'media':
        return 'media';
      default:
        return entityType;
    }
  };

  const getEntityName = (log: AuditLog): string => {
    if (
      log.new_value &&
      typeof log.new_value === 'object' &&
      log.new_value !== null
    ) {
      const data = log.new_value as Record<string, unknown>;

      if ('first_name' in data) {
        const firstName = data.first_name as string;
        const lastName = data.last_name as string | undefined;
        return `${firstName} ${lastName || ''}`.trim();
      }

      if (
        'type' in data &&
        'person_a_name' in data &&
        'person_b_name' in data
      ) {
        const relType = data.type as string;
        const personAName = data.person_a_name as string;
        const personBName = data.person_b_name as string;

        const typeMap: Record<string, string> = {
          PARENT: 'hubungan orang tua',
          SPOUSE: 'hubungan pasangan',
          SIBLING: 'hubungan saudara',
        };

        const typeLabel = typeMap[relType] || relType.toLowerCase();
        return `${typeLabel} antara ${personAName} dan ${personBName}`;
      }

      if ('type' in data) {
        const relType = data.type as string;
        const typeMap: Record<string, string> = {
          PARENT: 'hubungan orang tua',
          SPOUSE: 'hubungan pasangan',
          SIBLING: 'hubungan saudara',
        };
        return typeMap[relType] || relType.toLowerCase();
      }
    }

    return getEntityLabel(log.entity_type);
  };

  const getChangeDetails = (log: AuditLog): string | null => {
    if (log.action === 'UPDATE' && log.old_value && log.new_value) {
      const oldData = log.old_value as Record<string, unknown>;
      const newData = log.new_value as Record<string, unknown>;

      const changes: string[] = [];

      if (oldData.first_name !== newData.first_name) {
        changes.push(
          `nama depan dari "${oldData.first_name}" → "${newData.first_name}"`,
        );
      }
      if (oldData.last_name !== newData.last_name) {
        changes.push(
          `nama belakang dari "${oldData.last_name}" → "${newData.last_name}"`,
        );
      }

      if (oldData.gender !== newData.gender) {
        const genderMap: Record<string, string> = {
          MALE: 'Laki-laki',
          FEMALE: 'Perempuan',
        };
        changes.push(
          `jenis kelamin dari ${genderMap[oldData.gender as string] || oldData.gender} → ${genderMap[newData.gender as string] || newData.gender}`,
        );
      }

      if (oldData.birth_date !== newData.birth_date) {
        changes.push(`tanggal lahir`);
      }

      if (oldData.death_date !== newData.death_date) {
        if (!oldData.death_date && newData.death_date) {
          changes.push(`tanggal wafat ditambahkan`);
        } else if (oldData.death_date && !newData.death_date) {
          changes.push(`tanggal wafat dihapus`);
        } else {
          changes.push(`tanggal wafat`);
        }
      }

      if (oldData.bio !== newData.bio) {
        changes.push(`biografi`);
      }

      if (oldData.address !== newData.address) {
        changes.push(`alamat`);
      }

      if (oldData.occupation !== newData.occupation) {
        changes.push(`pekerjaan`);
      }

      if (oldData.nickname !== newData.nickname) {
        changes.push(`nama panggilan`);
      }

      if (oldData.birth_place !== newData.birth_place) {
        changes.push(`tempat lahir`);
      }

      if (oldData.death_place !== newData.death_place) {
        changes.push(`tempat wafat`);
      }

      if (oldData.religion !== newData.religion) {
        changes.push(`agama`);
      }

      if (oldData.nationality !== newData.nationality) {
        changes.push(`kewarganegaraan`);
      }

      if (oldData.education !== newData.education) {
        changes.push(`pendidikan`);
      }

      if (oldData.phone !== newData.phone) {
        changes.push(`telepon`);
      }

      if (oldData.email !== newData.email) {
        changes.push(`email`);
      }

      if (oldData.avatar_url !== newData.avatar_url) {
        changes.push(`foto profil`);
      }

      if (changes.length > 0) {
        return changes.join(', ');
      }
    }

    return null;
  };

  const handleActivityClick = (log: AuditLog) => {
    const normalizedType = log.entity_type.toLowerCase();
    if (normalizedType === 'person') {
      navigate(`/persons/${log.entity_id}`);
    }
  };

  return (
    <Card className="p-6 bg-white border-slate-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Aktivitas Terbaru</h3>
        <p className="text-sm text-slate-500 mt-1">
          Riwayat penambahan dan perubahan data
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : activities && activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => {
            const changeDetails = getChangeDetails(activity);
            const normalizedType = activity.entity_type.toLowerCase();
            const isClickable =
              normalizedType === 'person' && activity.action !== 'DELETE';

            return (
              <div
                key={activity.id}
                onClick={() => isClickable && handleActivityClick(activity)}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  isClickable
                    ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer'
                    : 'bg-slate-50'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {activity.action === 'CREATE' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  )}
                  {activity.action === 'UPDATE' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                  )}
                  {activity.action === 'DELETE' && (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    <span className="font-bold">
                      {activity.user_name || 'Pengguna'}
                    </span>{' '}
                    <span className="text-slate-600">
                      {getActionLabel(activity.action)}
                    </span>{' '}
                    <span className="font-semibold text-slate-900">
                      {getEntityName(activity)}
                    </span>
                  </p>

                  {changeDetails && (
                    <p className="text-xs text-slate-600 mt-1">
                      Mengubah: {changeDetails}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </p>
                </div>

                {isClickable && (
                  <div className="shrink-0 mt-2">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">
            Belum ada aktivitas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Aktivitas akan muncul di sini
          </p>
        </div>
      )}
    </Card>
  );
}
