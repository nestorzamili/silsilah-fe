import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personService, mediaService, commentService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SEO } from '@/components/SEO';
import { getFullName } from '@/utils/person';
import { UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores';
import { DeletePersonModal, MobileLayout, DesktopLayout } from './components';

export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isCommentsPanelVisible, setIsCommentsPanelVisible] = useState(true);

  const isMember = currentUser?.role === 'member';

  const {
    data: person,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.PERSONS.DETAIL(id!),
    queryFn: () => personService.getById(id!),
    enabled: !!id,
  });

  const { data: mediaData } = useQuery({
    queryKey: QUERY_KEYS.MEDIA.LIST(id),
    queryFn: () => mediaService.list({ person_id: id }),
    enabled: !!id,
  });

  const { data: commentsData } = useQuery({
    queryKey: QUERY_KEYS.COMMENTS.LIST(id!),
    queryFn: () => commentService.list(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => personService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PERSONS.LIST(1, 25),
      });
      queryClient.invalidateQueries({ queryKey: ['recentActivities'] });
      navigate('/persons');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => commentService.create(id!, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS.LIST(id!),
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => mediaService.upload(file, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA.LIST(id) });
      if (isMember && 'message' in data) {
        toast.success('Pengajuan berhasil dikirim', {
          description: 'Upload media Anda akan ditinjau oleh editor',
        });
      } else {
        toast.success('Media berhasil diupload');
      }
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: ({
      mediaId,
      requesterNote,
    }: {
      mediaId: string;
      requesterNote?: string;
    }) => mediaService.delete(mediaId, requesterNote),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA.LIST(id) });
      if (isMember && data && typeof data === 'object' && 'message' in data) {
        toast.success('Pengajuan berhasil dikirim', {
          description: 'Permintaan penghapusan akan ditinjau oleh editor',
        });
      } else {
        toast.success('Media berhasil dihapus');
      }
    },
  });

  const allRelationships = useMemo(() => {
    return person?.relationships ?? [];
  }, [person?.relationships]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !person) {
    return (
      <>
        <SEO
          title="Orang Tidak Ditemukan - Silsilah Keluarga"
          description="Orang yang Anda cari tidak ditemukan dalam sistem silsilah keluarga."
          keywords={['orang tidak ditemukan', 'silsilah', 'keluarga']}
          noIndex={true}
        />
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState
            icon={UserIcon}
            title="Orang tidak ditemukan"
            description="Orang yang Anda cari tidak ada atau telah dihapus."
            action={{ label: 'Kembali', onClick: () => navigate(-1) }}
          />
        </div>
      </>
    );
  }

  const media = mediaData?.data ?? [];
  const comments = commentsData?.data ?? [];

  const personName = getFullName(person);
  const personDescription =
    person.bio || `Profil ${personName} dalam silsilah keluarga.`;
  const personKeywords = [
    personName,
    'profil keluarga',
    'silsilah',
    'keluarga',
    'informasi pribadi',
    'riwayat hidup',
  ];

  return (
    <>
      <SEO
        title={`${personName} - Profil Keluarga`}
        description={personDescription}
        keywords={personKeywords}
        ogType="profile"
        ogTitle={personName}
        ogDescription={personDescription}
        twitterTitle={personName}
        twitterDescription={personDescription}
        canonical={`https://silsilah.zamili.dev/persons/${id}`}
      />
      <div className="flex flex-1 flex-col bg-white lg:flex-row overflow-hidden">
        <MobileLayout
          person={person}
          personId={id!}
          relationships={allRelationships}
          media={media}
          comments={comments}
          isUploadingMedia={uploadMutation.isPending}
          isDeletingMedia={deleteMediaMutation.isPending}
          isSubmittingComment={commentMutation.isPending}
          onDeletePersonClick={() => setDeleteModalOpen(true)}
          onUploadMedia={(file) => uploadMutation.mutate(file)}
          onDeleteMedia={(mediaId, requesterNote) =>
            deleteMediaMutation.mutate({ mediaId, requesterNote })
          }
          onSubmitComment={(content) => commentMutation.mutate(content)}
        />

        <DesktopLayout
          person={person}
          personId={id!}
          relationships={allRelationships}
          media={media}
          comments={comments}
          isUploadingMedia={uploadMutation.isPending}
          isDeletingMedia={deleteMediaMutation.isPending}
          isSubmittingComment={commentMutation.isPending}
          isCommentsPanelVisible={isCommentsPanelVisible}
          onDeletePersonClick={() => setDeleteModalOpen(true)}
          onUploadMedia={(file) => uploadMutation.mutate(file)}
          onDeleteMedia={(mediaId, requesterNote) =>
            deleteMediaMutation.mutate({ mediaId, requesterNote })
          }
          onSubmitComment={(content) => commentMutation.mutate(content)}
          onToggleCommentsPanel={() =>
            setIsCommentsPanelVisible(!isCommentsPanelVisible)
          }
        />

        <DeletePersonModal
          open={deleteModalOpen}
          personName={getFullName(person)}
          isDeleting={deleteMutation.isPending}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => {
            deleteMutation.mutate();
            setDeleteModalOpen(false);
          }}
        />
      </div>
    </>
  );
}

export default PersonDetailPage;
