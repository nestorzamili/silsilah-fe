import type { PersonWithRelationships, Media, Comment, RelationshipInfo } from '@/types';
import { ProfileSidebar, RelationshipsPanelWithAddModal, GalleryPanel, CommentsPanel } from './index';
import { getFullName } from '@/utils/person';

interface DesktopLayoutProps {
  person: PersonWithRelationships;
  personId: string;
  relationships: RelationshipInfo[];
  media: Media[];
  comments: Comment[];
  isUploadingMedia: boolean;
  isDeletingMedia: boolean;
  isSubmittingComment: boolean;
  isCommentsPanelVisible: boolean;
  onDeletePersonClick: () => void;
  onUploadMedia: (file: File) => void;
  onDeleteMedia: (mediaId: string, requesterNote?: string) => void;
  onSubmitComment: (content: string) => void;
  onToggleCommentsPanel: () => void;
}

export function DesktopLayout({
  person,
  personId,
  relationships,
  media,
  comments,
  isUploadingMedia,
  isDeletingMedia,
  isSubmittingComment,
  isCommentsPanelVisible,
  onDeletePersonClick,
  onUploadMedia,
  onDeleteMedia,
  onSubmitComment,
  onToggleCommentsPanel,
}: DesktopLayoutProps) {
  return (
    <>
      <aside className="hidden lg:block w-80 shrink-0 overflow-y-auto border-r border-emerald-100/50 lg:shadow-2xl lg:shadow-emerald-900/5 z-10 xl:w-85">
        <ProfileSidebar
          person={person}
          onDeleteClick={onDeletePersonClick}
        />
      </aside>

      <main className="hidden lg:block min-w-0 flex-1 overflow-y-auto bg-white">
        <div className="space-y-6 p-6">
          <RelationshipsPanelWithAddModal
            personId={personId}
            relationships={relationships}
            personName={getFullName(person)}
            existingData={person}
          />
          <GalleryPanel
            media={media}
            isUploading={isUploadingMedia}
            isDeleting={isDeletingMedia}
            onUpload={onUploadMedia}
            onDelete={onDeleteMedia}
          />
        </div>
      </main>

      <aside className={`hidden lg:block shrink-0 overflow-y-auto border-l border-emerald-100/50 bg-white transition-all duration-300 ease-in-out z-10 ${isCommentsPanelVisible ? 'lg:w-85 xl:w-95 shadow-2xl shadow-emerald-900/10' : 'lg:w-12 shadow-md hover:shadow-lg'}`}>
        <CommentsPanel
          comments={comments}
          isSubmitting={isSubmittingComment}
          onSubmit={onSubmitComment}
          isVisible={isCommentsPanelVisible}
          onToggle={onToggleCommentsPanel}
        />
      </aside>
    </>
  );
}
