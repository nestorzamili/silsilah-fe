import { useState } from 'react';
import type { Comment } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { commentService } from '@/services';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommentsPanelProps {
  comments: Comment[];
  isSubmitting: boolean;
  onSubmit: (content: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export function CommentsPanel({
  comments,
  isSubmitting,
  onSubmit,
  isVisible,
  onToggle,
}: CommentsPanelProps) {
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const canAddComment = true;

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) =>
      commentService.update(comments[0]?.person_id || '', commentId, {
        content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['person-comments', comments[0]?.person_id || ''],
      });
      setEditingCommentId(null);
      setEditContent('');
    },
  });

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: (commentId: string) =>
      commentService.delete(comments[0]?.person_id || '', commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['person-comments', comments[0]?.person_id || ''],
      });
      setDeleteCommentId(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmit(commentText.trim());
      setCommentText('');
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCommentId && editContent.trim()) {
      updateComment({
        commentId: editingCommentId,
        content: editContent.trim(),
      });
    }
  };

  const handleDelete = () => {
    if (deleteCommentId) {
      deleteComment(deleteCommentId);
    }
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  return (
    <section className="relative flex h-full flex-col bg-white">
      <div
        className={`absolute top-4 ${isVisible ? 'right-4' : 'right-1'} z-10`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="group flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg shadow-emerald-900/10 ring-1 ring-emerald-100 transition-all hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-900/20"
          title={isVisible ? 'Sembunyikan panel' : 'Tampilkan panel'}
        >
          {isVisible ? (
            <ChevronRightIcon className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-slate-600 transition-transform group-hover:-translate-x-0.5" />
          )}
        </button>
      </div>

      {isVisible && (
        <>
          <div className="shrink-0 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Catatan & Cerita</h2>
              <p className="mt-0.5 text-sm text-slate-600">
                {comments.length > 0
                  ? `${comments.length} catatan tersimpan`
                  : 'Belum ada catatan'}
              </p>
            </div>
          </div>

          <div className="shrink-0 border-b border-slate-100 p-4">
            {canAddComment && (
              <form onSubmit={handleSubmit}>
                <div>
                  <textarea
                    placeholder="Tulis catatan, cerita, atau kenangan..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400 focus:bg-slate-100 focus:outline-none focus:ring-0"
                  />
                  {commentText.trim() && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Mengirim...' : 'Kirim'}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {comments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onEdit={() => handleEdit(comment)}
                    onDelete={() => setDeleteCommentId(comment.id)}
                    isEditing={editingCommentId === comment.id}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    isUpdating={isUpdating}
                    cancelEdit={cancelEdit}
                    handleUpdate={handleUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <svg
                    className="h-6 w-6 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">Belum ada catatan</p>
                <p className="mt-1 text-xs text-slate-500">
                  Tulis cerita atau kenangan di atas
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <ConfirmDeleteDialog
        open={!!deleteCommentId}
        onOpenChange={() => setDeleteCommentId(null)}
        onConfirm={handleDelete}
        title="Hapus Catatan"
        description="Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan."
        isLoading={isDeleting}
      />
    </section>
  );
}

function CommentItem({
  comment,
  onEdit,
  onDelete,
  isEditing,
  editContent,
  setEditContent,
  isUpdating,
  cancelEdit,
  handleUpdate,
}: {
  comment: Comment;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  editContent: string;
  setEditContent: React.Dispatch<React.SetStateAction<string>>;
  isUpdating: boolean;
  cancelEdit: () => void;
  handleUpdate: (e: React.FormEvent) => void;
}) {
  const { canEdit, isOwner } = usePermissions();
  const timeAgo = getTimeAgo(comment.created_at);

  const isEdited =
    new Date(comment.created_at).getTime() !==
    new Date(comment.updated_at).getTime();
  const editTimeAgo = isEdited ? getTimeAgo(comment.updated_at) : null;

  const canEditComment = isOwner(comment.user_id) || canEdit;

  return (
    <div className="flex gap-3 px-5 py-4 transition-colors hover:bg-slate-50/50">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage
          src={comment.user?.avatar_url}
          alt={comment.user?.full_name || 'User'}
        />
        <AvatarFallback className="bg-slate-100 text-xs font-medium text-slate-600">
          {(comment.user?.full_name || 'U').charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-slate-800">
              {comment.user?.full_name || 'User'}
            </span>
            {isEdited ? (
              <Badge
                variant="secondary"
                className="h-4 px-1.5 py-0 text-[10px] font-normal"
              >
                diubah {editTimeAgo}
              </Badge>
            ) : (
              <span className="text-xs text-slate-400">{timeAgo}</span>
            )}
          </div>

          {!isEditing && canEditComment && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  aria-label="Comment actions"
                >
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="mt-2 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit your comment..."
              className="text-sm"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cancelEdit}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUpdating || !editContent.trim()}
              >
                {isUpdating ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {comment.content}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
