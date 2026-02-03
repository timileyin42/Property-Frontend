import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { ApiProperty } from "../../types/property";
import {
  PropertyStatusFilter,
  UpdateAdminPropertyPayload,
  updateAdminProperty,
} from "../../api/admin.properties";
import { normalizeMediaUrl, isVideoUrl } from "../../util/normalizeMediaUrl";

interface UpdatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: ApiProperty | null;
  onUpdate: (updatedProperty: ApiProperty) => void;
}

const STATUS_OPTIONS: PropertyStatusFilter[] = [
  "AVAILABLE",
  "SOLD",
];

const MAX_IMAGE_SIZE = 100 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const CHUNK_SIZE = 6 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const toNumberOrUndefined = (value: string) => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const UpdatePropertyModal: React.FC<UpdatePropertyModalProps> = ({
  isOpen,
  onClose,
  property,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PropertyStatusFilter>("AVAILABLE");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [areaSqft, setAreaSqft] = useState("");
  const [expectedRoi, setExpectedRoi] = useState("");
  const [totalFractions, setTotalFractions] = useState("");
  const [fractionPrice, setFractionPrice] = useState("");
  const [projectValue, setProjectValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!property) return;
    setStatus((property.status as PropertyStatusFilter) || "AVAILABLE");
    setTitle(property.title ?? "");
    setLocation(property.location ?? "");
    setDescription(property.description ?? "");
    setMediaUrls((property.image_urls ?? []).filter(Boolean));
    setBedrooms(property.bedrooms?.toString() ?? "");
    setBathrooms(property.bathrooms?.toString() ?? "");
    setAreaSqft(property.area_sqft?.toString() ?? "");
    setExpectedRoi(property.expected_roi?.toString() ?? "");
    setTotalFractions(property.total_fractions?.toString() ?? "");
    setFractionPrice(property.fraction_price?.toString() ?? "");
    setProjectValue(property.project_value?.toString() ?? "");
  }, [property]);

  const normalizedMediaUrls = useMemo(
    () =>
      mediaUrls
        .map((url) => ({ raw: url, normalized: normalizeMediaUrl(url) }))
        .filter((item) => Boolean(item.normalized)),
    [mediaUrls]
  );

  const removeMedia = (url: string) => {
    setMediaUrls((prev) => prev.filter((item) => item !== url));
  };

  const uploadVideoInChunks = async (file: File, sig: any): Promise<string> => {
    const totalSize = file.size;
    let start = 0;
    let end = Math.min(CHUNK_SIZE, totalSize);
    const uploadId = `${file.name}-${Date.now()}`;
    let secureUrl = "";

    while (start < totalSize) {
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("api_key", sig.api_key);
      formData.append("timestamp", String(sig.timestamp));
      formData.append("signature", sig.signature);
      formData.append("folder", sig.folder);
      formData.append("resource_type", sig.resource_type);

      if (sig.allowed_formats) {
        formData.append("allowed_formats", sig.allowed_formats);
      }

      const uploadRes = await axios.post(sig.upload_url, formData, {
        headers: {
          "Content-Range": `bytes ${start}-${end - 1}/${totalSize}`,
          "X-Unique-Upload-Id": uploadId,
        },
      });

      if (uploadRes.data?.secure_url) {
        secureUrl = uploadRes.data.secure_url;
      }

      start = end;
      end = Math.min(start + CHUNK_SIZE, totalSize);
    }

    if (!secureUrl) {
      throw new Error("Cloudinary upload failed");
    }

    return secureUrl;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    try {
      setLoading(true);
      const uploadedUrls: string[] = [];

      for (const file of validFiles) {
        const resourceType = file.type.startsWith("video") ? "video" : "image";
        const payload = {
          resource_type: resourceType,
          file_size_bytes: file.size,
          ...(property?.id ? { property_id: property.id } : {}),
        };

        const { data: sig } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL ?? "https://api.elycapfracprop.com/api"}/media/upload-signature`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
          }
        );

        const isVideo = file.type.startsWith("video");
        const shouldChunk = isVideo && file.size > MAX_IMAGE_SIZE;

        if (shouldChunk) {
          const secureUrl = await uploadVideoInChunks(file, sig);
          uploadedUrls.push(secureUrl);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sig.api_key);
        formData.append("timestamp", String(sig.timestamp));
        formData.append("signature", sig.signature);
        formData.append("folder", sig.folder);
        formData.append("resource_type", sig.resource_type);

        if (sig.allowed_formats) {
          formData.append("allowed_formats", sig.allowed_formats);
        }

        const uploadRes = await axios.post(sig.upload_url, formData);

        if (!uploadRes.data?.secure_url) {
          throw new Error("Cloudinary upload failed");
        }

        uploadedUrls.push(uploadRes.data.secure_url);
      }

      if (uploadedUrls.length > 0) {
        setMediaUrls((prev) => [...prev, ...uploadedUrls]);
        toast.success("Media uploaded");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload media";
      toast.error(message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!property) return;

    if (!title.trim() || !location.trim() || !description.trim()) {
      toast.error("Title, location, and description are required");
      return;
    }

    setLoading(true);
    try {
      const payload: UpdateAdminPropertyPayload = {
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
        status,
        image_urls: mediaUrls.length ? mediaUrls : undefined,
        bedrooms: toNumberOrUndefined(bedrooms),
        bathrooms: toNumberOrUndefined(bathrooms),
        area_sqft: toNumberOrUndefined(areaSqft),
        expected_roi: toNumberOrUndefined(expectedRoi),
        total_fractions: toNumberOrUndefined(totalFractions),
        fraction_price: toNumberOrUndefined(fractionPrice),
        project_value: toNumberOrUndefined(projectValue),
      };

      const updated = await updateAdminProperty(property.id, payload);
      toast.success("Property updated successfully");
      onUpdate(updated);
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update property";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Update Property</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">{property.title}</p>
            <p className="text-sm text-gray-600">{property.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Location *
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatusFilter)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                disabled={loading}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                  {normalizedMediaUrls.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No media uploaded.
                    </p>
                  ) : (
                    normalizedMediaUrls.map(({ raw, normalized }) => (
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
                            alt="Property media"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (sqft)
                </label>
                <input
                  type="number"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected ROI
                </label>
                <input
                  type="number"
                  value={expectedRoi}
                  onChange={(e) => setExpectedRoi(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Fractions
                </label>
                <input
                  type="number"
                  value={totalFractions}
                  onChange={(e) => setTotalFractions(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fraction Price
                </label>
                <input
                  type="number"
                  value={fractionPrice}
                  onChange={(e) => setFractionPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Value
              </label>
              <input
                type="number"
                value={projectValue}
                onChange={(e) => setProjectValue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                disabled={loading}
              />
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
                {loading ? "Updating..." : "Update Property"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
