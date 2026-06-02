import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Heart, MessageCircle } from "lucide-react";
import {
  deleteAdminUpdateComment,
  deleteUserUpdateComment,
  fetchAdminUpdateComments,
  fetchPublicUpdateComments,
  fetchUpdateDetail,
  fetchUserUpdateComments,
  postUserUpdateComment,
  toggleUpdateLike,
} from "../api/updates";
import type { UpdateComment, UpdateItem } from "../types/updates";
import { isVideoUrl, usePresignedUrls } from "../util/normalizeMediaUrl";

const getMediaKeys = (update: UpdateItem) => {
  const urls = [
    ...(update.media_files?.map((item) => item.url) ?? []),
    ...(update.media_urls ?? []),
    ...(update.image_urls ?? []),
    update.image_url,
    update.video_url,
  ].filter(Boolean) as string[];

  return Array.from(new Set(urls));
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const err = error as {
      response?: { data?: { detail?: string; message?: string }; status?: number };
      message?: string;
    };
    return (
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      fallback
    );
  }
  return fallback;
};

const getErrorStatus = (error: unknown) => {
  if (error && typeof error === "object") {
    const err = error as { response?: { status?: number } };
    return err.response?.status;
  }
  return undefined;
};

const UpdateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const updateId = id ? Number(id) : NaN;
  const { isAuthenticated, user } = useAuth();

  const [update, setUpdate] = useState<UpdateItem | null>(null);
  const [comments, setComments] = useState<UpdateComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  const mediaKeys = useMemo(() => (update ? getMediaKeys(update) : []), [update]);
  const mediaUrls = usePresignedUrls(mediaKeys);

  useEffect(() => {
    if (!Number.isFinite(updateId)) return;

    const loadDetail = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const detail = await fetchUpdateDetail(updateId);
        setUpdate(detail);
        const storageKey = `update_like_${updateId}_${user?.id ?? "guest"}`;
        const storedLike = localStorage.getItem(storageKey) === "true";
        setHasLiked(typeof detail.liked_by_user === "boolean" ? detail.liked_by_user : storedLike);

        const commentsRes = user?.role === "ADMIN"
          ? await fetchAdminUpdateComments(updateId, { page: 1, page_size: 20 })
          : isAuthenticated
            ? await fetchUserUpdateComments(updateId, { page: 1, page_size: 20 })
            : await fetchPublicUpdateComments(updateId, { page: 1, page_size: 20 });

        setComments(commentsRes.comments ?? []);
      } catch (error: unknown) {
        const status = getErrorStatus(error);
        if (status === 404) {
          setErrorMessage("Update not found.");
          return;
        }
        if (status === 401) {
          setErrorMessage("Please login to view this update.");
          return;
        }
        if (status === 403) {
          setAccessDeniedMessage("Sorry, this update is visible to investors of this project.");
          setErrorMessage(null);
          return;
        }
        setErrorMessage("Failed to load update.");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [updateId, isAuthenticated, user?.role, user?.id]);

  const handlePostComment = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await postUserUpdateComment(updateId, commentText.trim());
      if (res?.id) {
        setComments((prev) => [res, ...prev]);
      }
      setCommentText("");
      setIsCommentOpen(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to post comment"));
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      if (user?.role === "ADMIN") {
        await deleteAdminUpdateComment(commentId);
      } else {
        await deleteUserUpdateComment(commentId);
      }
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete comment"));
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like updates");
      return;
    }
    try {
      setLikeLoading(true);
      const res = await toggleUpdateLike(updateId);
      const nextLiked =
        typeof res?.liked === "boolean"
          ? res.liked
          : typeof res?.is_liked === "boolean"
            ? res.is_liked
            : !hasLiked;
      setHasLiked(nextLiked);
      const storageKey = `update_like_${updateId}_${user?.id ?? "guest"}`;
      localStorage.setItem(storageKey, String(nextLiked));
      setUpdate((prev) =>
        prev
          ? {
              ...prev,
              likes_count:
                typeof res?.likes_count === "number"
                  ? res.likes_count
                  : (prev.likes_count ?? 0) + (nextLiked ? 1 : -1),
            }
          : prev
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to like update"));
    } finally {
      setLikeLoading(false);
    }
  };

  if (!Number.isFinite(updateId)) {
    return <p className="text-center py-10">Invalid update.</p>;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar links={[{ label: "Home", href: "/" }, { label: "Updates", href: "/updates" }]} />
      <Toaster position="top-right" />

      <main className="pt-32 pb-24 px-4 sm:px-8 max-w-4xl mx-auto">
        {/* Back link */}
        <a
          href="/updates"
          className="mb-10 flex items-center gap-2 text-on-surface-variant hover:text-premium-gold w-fit transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span className="label-caps">Back to Updates</span>
        </a>

        {loading ? (
          <div className="text-sm text-on-surface-variant">Loading update...</div>
        ) : errorMessage ? (
          <div className="glass-panel rounded-xl p-6 text-sm text-on-surface-variant max-w-xl mx-auto">
            <p className="mb-3">{errorMessage}</p>
            {errorMessage.toLowerCase().includes("login") && (
              <a href="/login" className="btn-gold inline-flex px-5 py-2.5 text-[12px]">
                Go to Login
              </a>
            )}
          </div>
        ) : !update ? (
          <div className="text-sm text-on-surface-variant">Update not found.</div>
        ) : (
          <article className="space-y-8">
            <header className="space-y-3">
              <span className="data-stat text-[11px] text-on-surface-variant uppercase tracking-widest">
                {new Date(update.created_at).toLocaleDateString()}
              </span>
              <h1 className="font-display text-4xl text-on-surface">{update.title}</h1>
            </header>

            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediaUrls.map((url) => (
                  <div key={url} className="rounded-xl overflow-hidden glass-panel">
                    {isVideoUrl(url) ? (
                      <video controls className="w-full h-56 object-cover">
                        <source src={url} />
                      </video>
                    ) : (
                      <img src={url} alt={update.title} className="w-full h-56 object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-on-surface-variant text-lg leading-relaxed">{update.content}</p>

            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={handleToggleLike}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                  hasLiked
                    ? "border-error/40 bg-error-container/20 text-error"
                    : "border-[rgba(248,246,241,0.15)] text-on-surface-variant hover:border-premium-gold"
                }`}
                disabled={likeLoading}
              >
                <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                <span className="data-stat">{update.likes_count ?? 0}</span>
              </button>
              <button
                onClick={() => setIsCommentOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(248,246,241,0.15)] text-on-surface-variant hover:border-premium-gold transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="data-stat">{comments.length}</span>
              </button>
            </div>

            <div className="glass-panel rounded-xl p-6 space-y-4">
              <h3 className="font-display text-2xl text-on-surface">Comments</h3>

              <div className="flex flex-col gap-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">No comments yet.</p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-[rgba(248,246,241,0.1)] last:border-b-0 pb-3"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-on-surface">{comment.user_name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                        {isAuthenticated && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-error hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant mt-2">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {!isAuthenticated && isCommentOpen && (
                <p className="text-xs text-on-surface-variant">
                  Login to like or comment on updates.
                </p>
              )}
              {isCommentOpen && (
                <div className="pt-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={isAuthenticated ? "Write a comment..." : "Login to comment"}
                    className="w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded-lg p-3 text-sm text-on-surface outline-none focus:border-premium-gold placeholder:text-on-surface-variant/40"
                    disabled={!isAuthenticated}
                    rows={3}
                  />
                  <button
                    onClick={handlePostComment}
                    className="btn-gold mt-2 px-5 py-2.5 text-[12px] disabled:opacity-50"
                    disabled={!isAuthenticated}
                  >
                    Post Comment
                  </button>
                </div>
              )}
            </div>
          </article>
        )}
      </main>

      {accessDeniedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md glass-panel rounded-xl p-6">
            <h2 className="font-display text-2xl text-on-surface">Access Restricted</h2>
            <p className="mt-2 text-sm text-on-surface-variant">{accessDeniedMessage}</p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAccessDeniedMessage(null)}
                className="px-4 py-2 rounded-full border border-[rgba(248,246,241,0.15)] text-sm text-on-surface-variant hover:text-on-surface"
              >
                Close
              </button>
              <a href="/properties" className="btn-gold px-4 py-2 text-[12px]">
                View Properties
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateDetail;
