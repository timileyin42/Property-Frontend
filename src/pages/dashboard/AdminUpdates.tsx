import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetchUpdates } from "../../api/updates";
import type { UpdateItem } from "../../types/updates";
import UpdateNewsModal from "../../components/admincomponents/UpdateNewsModal";
import { isVideoUrl, getPresignedUrl, getCachedPresignedUrl } from "../../util/normalizeMediaUrl";

const AdminUpdates = () => {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const res = await fetchUpdates({ page: 1, page_size: 50 });
      setUpdates(res.updates ?? []);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load updates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates();
  }, []);

  useEffect(() => {
    const mediaKeys = updates.flatMap((update) =>
      [
        ...(update.media_files?.map((item) => item.url) ?? []),
        ...(update.media_urls ?? []),
        ...(update.image_urls ?? []),
        update.image_url,
        update.video_url,
      ].filter(Boolean)
    ) as string[];
    if (mediaKeys.length === 0) return;
    Promise.all(mediaKeys.map((key) => getPresignedUrl(key))).catch(() => null);
  }, [updates]);

  const handleOpen = (update?: UpdateItem) => {
    setSelectedUpdate(update ?? null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedUpdate(null);
  };

  const handleSuccess = (item: UpdateItem) => {
    setUpdates((prev) => {
      const exists = prev.find((entry) => entry.id === item.id);
      if (exists) {
        return prev.map((entry) => (entry.id === item.id ? item : entry));
      }
      return [item, ...prev];
    });
  };

  const rows = useMemo(() => updates, [updates]);

  return (
    <div className="bg-white rounded-xl p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Project Updates</h2>
          <p className="text-sm text-gray-500">
            Create and manage updates for your investors
          </p>
        </div>
        <button
          onClick={() => handleOpen()}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
        >
          Create Update
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading updates...</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-gray-500">No updates yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-4">Update</th>
                <th className="text-left p-4">Created</th>
                <th className="text-right p-4">Likes</th>
                <th className="text-right p-4">Comments</th>
                <th className="text-right p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((update) => {
                const urls = [
                  ...(update.media_files?.map((item) => item.url) ?? []),
                  ...(update.media_urls ?? []),
                  ...(update.image_urls ?? []),
                  update.image_url,
                  update.video_url,
                ].filter(Boolean) as string[];
                const normalized = urls
                  .map((url) => getCachedPresignedUrl(url))
                  .filter(Boolean) as string[];
                const imageUrl = normalized.find((url) => !isVideoUrl(url));
                const videoUrl = normalized.find((url) => isVideoUrl(url));

                return (
                  <tr key={update.id} className="border-b last:border-b-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={update.title}
                              className="h-full w-full object-cover"
                            />
                          ) : videoUrl ? (
                            <video
                              className="h-full w-full object-cover"
                              src={videoUrl}
                              muted
                              playsInline
                              loop
                              autoPlay
                            />
                          ) : (
                            <span className="text-xs text-gray-400">No media</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {update.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {update.content}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(update.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right text-gray-500">
                      {update.likes_count ?? 0}
                    </td>
                    <td className="p-4 text-right text-gray-500">
                      {update.comments_count ?? 0}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpen(update)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <UpdateNewsModal
        isOpen={isModalOpen}
        onClose={handleClose}
        update={selectedUpdate}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default AdminUpdates;
