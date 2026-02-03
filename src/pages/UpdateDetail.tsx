import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";
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
import { isVideoUrl, normalizeMediaUrl } from "../util/normalizeMediaUrl";

const getMediaUrls = (update: UpdateItem) => {
  const urls = [
    ...(update.media_files?.map((item) => item.url) ?? []),
    ...(update.media_urls ?? []),
    ...(update.image_urls ?? []),
    update.image_url,
    update.video_url,
  ].filter(Boolean) as string[];

  return urls.map((url) => normalizeMediaUrl(url)).filter(Boolean) as string[];
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

  const mediaUrls = useMemo(() => (update ? getMediaUrls(update) : []), [update]);

  useEffect(() => {
    if (!Number.isFinite(updateId)) return;

    const loadDetail = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const detail = await fetchUpdateDetail(updateId);
        setUpdate(detail);

        const commentsRes = user?.role === "ADMIN"
          ? await fetchAdminUpdateComments(updateId, { page: 1, page_size: 20 })
          : isAuthenticated
            ? await fetchUserUpdateComments(updateId, { page: 1, page_size: 20 })
            : await fetchPublicUpdateComments(updateId, { page: 1, page_size: 20 });

        setComments(commentsRes.comments ?? []);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setErrorMessage("Update not found.");
          return;
        }
        if (error?.response?.status === 401) {
          setErrorMessage("Please login to view this update.");
          return;
        }
        setErrorMessage("Failed to load update.");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [updateId, isAuthenticated, user?.role]);

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
    } catch (error: any) {
      toast.error(error?.message || "Failed to post comment");
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
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete comment");
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
      setUpdate((prev) =>
        prev
          ? {
              ...prev,
              likes_count:
                typeof res?.likes_count === "number"
                  ? res.likes_count
                  : (prev.likes_count ?? 0) + 1,
            }
          : prev
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to like update");
    } finally {
      setLikeLoading(false);
    }
  };

  if (!Number.isFinite(updateId)) {
    return <p className="text-center py-10">Invalid update.</p>;
  }

  return (
    <div className="mx-auto px-4 my-16">
      <Navbar links={[{ label: "Home", href: "/" }, { label: "Updates", href: "/updates" }]} />
      <Toaster position="top-right" />

      {loading ? (
        <div className="text-sm text-gray-500">Loading update...</div>
      ) : errorMessage ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600 max-w-xl mx-auto">
          <p className="mb-3">{errorMessage}</p>
          {errorMessage.toLowerCase().includes("login") && (
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
            >
              Go to Login
            </a>
          )}
        </div>
      ) : !update ? (
        <div className="text-sm text-gray-500">Update not found.</div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-900">{update.title}</h2>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(update.created_at).toLocaleDateString()}
            </p>
          </div>

          {mediaUrls.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaUrls.map((url) => (
                <div key={url} className="rounded-xl overflow-hidden bg-gray-100">
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

          <p className="text-gray-600 text-base leading-7">{update.content}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button
              onClick={handleToggleLike}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
              disabled={likeLoading}
            >
              <Heart className="h-4 w-4" />
              <span>{update.likes_count ?? 0}</span>
            </button>
            <span>{comments.length} comments</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-blue-900">Comments</h3>

            <div className="flex flex-col gap-3">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b last:border-b-0 pb-3">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-blue-900">
                          {comment.user_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                      {isAuthenticated && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {!isAuthenticated && (
              <p className="text-xs text-gray-500">
                Login to like or comment on updates.
              </p>
            )}
            <div className="pt-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={isAuthenticated ? "Write a comment..." : "Login to comment"}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                disabled={!isAuthenticated}
                rows={3}
              />
              <button
                onClick={handlePostComment}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg"
                disabled={!isAuthenticated}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateDetail;
