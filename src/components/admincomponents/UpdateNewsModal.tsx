import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import type { UpdateItem } from "../../types/updates";
import { createAdminUpdate, updateAdminUpdate } from "../../api/admin.updates";
import { isVideoUrl, getPresignedUrl, getCachedPresignedUrl } from "../../util/normalizeMediaUrl";

interface UpdateNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  update: UpdateItem | null;
  onSuccess: (item: UpdateItem) => void;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const err = error as {
      response?: { data?: { detail?: string; message?: string } };
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

const MAX_IMAGE_SIZE = 100 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const UpdateNewsModal: React.FC<UpdateNewsModalProps> = ({
  isOpen,
  onClose,
  update,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [propertyId, setPropertyId] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!update) {
      setTitle("");
      setContent("");
      setMediaUrls([]);
      setPendingFiles([]);
      setPropertyId("");
      return;
    }

    setTitle(update.title ?? "");
    setContent(update.content ?? "");
    const mediaFromFiles = update.media_files?.map((item) => item.url) ?? [];
    setMediaUrls([
      ...mediaFromFiles,
      ...(update.media_urls ?? []),
      ...(update.image_urls ?? []),
      update.image_url,
      update.video_url,
    ].filter(Boolean) as string[]);
    setPropertyId(update.property_id ? String(update.property_id) : "");
  }, [update]);

  useEffect(() => {
    if (mediaUrls.length === 0) return;
    Promise.all(mediaUrls.map((url) => getPresignedUrl(url))).catch(() => null);
  }, [mediaUrls]);

  const normalizedMedia = useMemo(
    () =>
      mediaUrls
        .map((url) => ({ raw: url, normalized: getCachedPresignedUrl(url) }))
        .filter((item) => Boolean(item.normalized)),
    [mediaUrls]
  );

  const mediaPayload = useMemo(() => {
    const image = normalizedMedia.find((item) => !isVideoUrl(item.normalized))?.raw;
    const video = normalizedMedia.find((item) => isVideoUrl(item.normalized))?.raw;
    const media_files = normalizedMedia.map((item) => ({
      media_type: (isVideoUrl(item.normalized) ? "video" : "image") as
        | "video"
        | "image",
      url: item.raw,
    }));
    return { image_url: image, video_url: video, media_files };
  }, [normalizedMedia]);

  const removeMedia = (url: string) => {
    setMediaUrls((prev) => prev.filter((item) => item !== url));
  };

  const previews = useMemo(
    () =>
      pendingFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [pendingFiles]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles = selectedFiles.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) return false;
      const isVideo = file.type.startsWith("video");
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      return file.size <= maxSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Some files were rejected (type/size)");
    }

    setPendingFiles((prev) => [...prev, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadPendingFiles = async (files: File[]) => {
    const uploadedKeys: string[] = [];

    for (const file of files) {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL ?? "https://api.elycapfracprop.com/api"}/files/presign-upload`,
        {
          filename: file.name,
          content_type: file.type,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        }
      );

      const uploadHeaders: Record<string, string> = {
        ...(data?.upload_headers ?? {}),
      };
      if (!Object.keys(uploadHeaders).some((key) => key.toLowerCase() === "content-type")) {
        uploadHeaders["Content-Type"] = file.type;
      }

      await axios.put(data.upload_url, file, {
        headers: uploadHeaders,
      });

      if (!data.file_key) {
        throw new Error("Upload failed");
      }

      uploadedKeys.push(data.file_key);
    }

    return uploadedKeys;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        property_id: propertyId.trim() ? Number(propertyId) : undefined,
        title: title.trim(),
        content: content.trim(),
        media_files: mediaPayload.media_files.length
          ? mediaPayload.media_files
          : undefined,
        image_url: mediaPayload.image_url,
        video_url: mediaPayload.video_url,
      };

      const result = update
        ? await updateAdminUpdate(update.id, payload)
        : await createAdminUpdate(payload);

      toast.success(update ? "Update saved" : "Update created");
      onSuccess(result);
      onClose();

      if (pendingFiles.length > 0) {
        toast.success("Media uploading in background");
        const filesToUpload = [...pendingFiles];
        setPendingFiles([]);

        uploadPendingFiles(filesToUpload)
          .then((newUrls) => {
            if (newUrls.length === 0) return;

            const combined = [...mediaUrls, ...newUrls];
            const combinedNormalized = combined
              .map((url) => ({ raw: url, normalized: getCachedPresignedUrl(url) }))
              .filter((item) => Boolean(item.normalized));

            const image = combinedNormalized.find((item) => !isVideoUrl(item.normalized))?.raw;
            const video = combinedNormalized.find((item) => isVideoUrl(item.normalized))?.raw;
            const media_files = combinedNormalized.map((item) => ({
              media_type: (isVideoUrl(item.normalized) ? "video" : "image") as
                | "video"
                | "image",
              url: item.raw,
            }));

            return updateAdminUpdate(result.id, {
              property_id: payload.property_id,
              title: payload.title,
              content: payload.content,
              media_files,
              image_url: image,
              video_url: video,
            });
          })
          .then((updated) => {
            if (!updated) return;
            setMediaUrls((prev) => [...prev, ...updated.media_files?.map((item) => item.url) ?? []]);
            onSuccess(updated);
          })
          .catch((error: unknown) => {
            toast.error(getErrorMessage(error, "Background upload failed"));
          });
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to save update"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {update ? "Edit Update" : "Create Update"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property ID (optional)
              </label>
              <input
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                type="number"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                  {previews.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {previews.map((preview) => (
                        <div
                          key={preview.url}
                          className="relative w-28 h-20 rounded-md overflow-hidden bg-gray-100"
                        >
                          {preview.file.type.startsWith("video") ? (
                            <video
                              src={preview.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              loop
                              autoPlay
                            />
                          ) : (
                            <img
                              src={preview.url}
                              alt="Pending media"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setPendingFiles((prev) =>
                                prev.filter((file) => file !== preview.file)
                              )
                            }
                            className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {normalizedMedia.length === 0 ? (
                    <p className="text-sm text-gray-500">No media uploaded.</p>
                  ) : (
                    normalizedMedia.map(({ raw, normalized }) => (
                      <div
                        key={raw}
                        className="relative w-28 h-20 rounded-md overflow-hidden bg-gray-100"
                      >
                        {isVideoUrl(normalized) ? (
                          <video
                            src={normalized}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            loop
                            autoPlay
                          />
                        ) : (
                          <img
                            src={normalized}
                            alt="Update media"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(raw)}
                          className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    multiple
                    accept={ALLOWED_TYPES.join(",")}
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Upload Media
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateNewsModal;
