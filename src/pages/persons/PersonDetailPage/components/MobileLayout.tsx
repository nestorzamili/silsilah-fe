import type { PersonWithRelationships, Media, Comment, RelationshipInfo } from '@/types';
import { ProfileSidebar, RelationshipsPanelWithAddModal, GalleryPanel, CommentsPanel } from './index';
import { getFullName } from '@/utils/person';

interface MobileLayoutProps {
  person: PersonWithRelationships;
  personId: string;
  relationships: RelationshipInfo[];
  media: Media[];
  comments: Comment[];
  isUploadingMedia: boolean;
  isDeletingMedia: boolean;
  isSubmittingComment: boolean;
  onDeletePersonClick: () => void;
  onUploadMedia: (file: File) => void;
  onDeleteMedia: (mediaId: string, requesterNote?: string) => void;
  onSubmitComment: (content: string) => void;
}

export function MobileLayout({
  person,
  personId,
  relationships,
  media,
  comments,
  isUploadingMedia,
  isDeletingMedia,
  isSubmittingComment,
  onDeletePersonClick,
  onUploadMedia,
  onDeleteMedia,
  onSubmitComment,
}: MobileLayoutProps) {
  return (
    <div className="flex-1 overflow-y-auto lg:hidden">
      <div className="space-y-6">
        <ProfileSidebar
          person={person}
          onDeleteClick={onDeletePersonClick}
        />
        
        <div className="px-6">
          <RelationshipsPanelWithAddModal
            personId={personId}
            relationships={relationships}
            personName={getFullName(person)}
          />
        </div>
        
        <div className="px-6">
          <GalleryPanel
            media={media}
            isUploading={isUploadingMedia}
            isDeleting={isDeletingMedia}
            onUpload={onUploadMedia}
            onDelete={onDeleteMedia}
          />
        </div>
        
        <div className="px-6 pb-6">
          <CommentsPanel
            comments={comments}
            isSubmitting={isSubmittingComment}
            onSubmit={onSubmitComment}
            isVisible={true}
            onToggle={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
