import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiUpload } from "react-icons/fi";

import { api } from "../../api/axios";
import { fetchProperties } from "../../api/properties";
import { updateAdminProperty } from "../../api/admin.properties";
import { PropertyTable } from "../../components/PropertyTable";
import type { ApiProperty } from "../../types/property";
import type { InterestStatus } from "../../types/investment";

export type PropertyStatus = InterestStatus;

/* =======================
   Schema Definition
======================= */

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().optional()
);

const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  project_value: optionalNumber,
  total_fractions: z.coerce.number().min(1, "Total fractions is required"),
  fraction_price: optionalNumber,
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  area_sqft: optionalNumber,
  expected_roi: optionalNumber,
});

// Explicitly define the type to match the schema
type PropertyFormValues = {
  title: string;
  location: string;
  description: string;
  project_value?: number;
  total_fractions: number;
  fraction_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  expected_roi?: number;
};

/* =======================
   Constants
======================= */

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

/* =======================
   Component
======================= */

const AdminInvestmentsPage: React.FC = () => {
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any, // Type assertion to fix the resolver issue
    defaultValues: {
      title: "",
      location: "",
      description: "",
      project_value: undefined,
      total_fractions: undefined,
      fraction_price: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      area_sqft: undefined,
      expected_roi: undefined,
    }
  });

  /* =======================
     Image Selection
  ======================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) return false;

      const isVideo = file.type.startsWith("video");
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      return file.size <= maxSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Some files were rejected (type/size)");
    }

    setFiles((prev) => [...prev, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    if (previews[index]?.url) {
      URL.revokeObjectURL(previews[index].url);
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  /* =======================
     Upload to Cloudinary
  ======================= */

  const uploadImages = async (propertyId?: number): Promise<string[]> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized");
    }

    const uploadedUrls: string[] = [];

    const uploadVideoInChunks = async (
      file: File,
      sig: {
        api_key: string;
        timestamp: string | number;
        signature: string;
        folder: string;
        resource_type: string;
        upload_url: string;
        allowed_formats?: string;
      }
    ): Promise<string> => {
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

    for (const file of files) {
      const resourceType = file.type.startsWith("video") ? "video" : "image";
      const payload = {
        resource_type: resourceType,
        file_size_bytes: file.size,
        ...(propertyId !== undefined && { property_id: propertyId }),
      };

      // 1️⃣ Get upload signature
      const { data: sig } = await api.post(
        "/media/upload-signature",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2️⃣ Upload to Cloudinary
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

    return uploadedUrls;
  };

  /* =======================
     Submit Handler
  ======================= */

  const onSubmit: SubmitHandler<PropertyFormValues> = async (data) => {
    if (files.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    const uploadPromise = uploadImages();

    try {
      const payload = {
        ...data,
        status: "AVAILABLE" as PropertyStatus,
        image_urls: [] as string[],
        primary_image: "",
      };

      let res: { data: ApiProperty } | null = null;

      try {
        res = await api.post<ApiProperty>("/admin/properties", payload);
      } catch (createError: any) {
        // Fallback to blocking upload if server requires images on create
        const imageUrls = await uploadPromise;
        const retryPayload = {
          ...data,
          status: "AVAILABLE" as PropertyStatus,
          image_urls: imageUrls,
          primary_image: imageUrls[0] || "",
        };
        res = await api.post<ApiProperty>("/admin/properties", retryPayload);
      }

      if (res) {
        setProperties((prev) => [res!.data, ...prev]);
        toast.success("Property created successfully");

        uploadPromise
          .then((imageUrls) => {
            if (!imageUrls.length) return null;
            return updateAdminProperty(res!.data.id, {
              image_urls: imageUrls,
              primary_image: imageUrls[0],
            });
          })
          .then((updated) => {
            if (!updated) return;
            setProperties((prev) =>
              prev.map((property) =>
                property.id === updated.id ? updated : property
              )
            );
          })
          .catch((error) => {
            console.error(error);
            toast.error("Background media upload failed");
          });

        // Clear everything
        reset();
        setFiles([]);
        previews.forEach((p) => URL.revokeObjectURL(p.url));
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Please login as admin to upload media");
        return;
      }
      toast.error(err.response?.data?.message || "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================
     Load Properties
  ======================= */

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProperties();
        // Type assertion to handle the type mismatch
        setProperties(data as unknown as ApiProperty[]);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setLoadingProperties(false);
      }
    };
    load();
  }, []);

  /* =======================
     UI
  ======================= */

  return (
    <div className="flex flex-col gap-4">
      <Toaster position="top-center" />
      <h2 className="text-xl font-bold text-blue-900">Upload New Property</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-4 p-6 border rounded-xl bg-white"
      >
        {/* We loop through the schema shape keys to generate inputs */}
        {(Object.keys(propertySchema.shape) as Array<keyof PropertyFormValues>).map((key) => {
          const isNumber = key !== "title" && key !== "location" && key !== "description";
          
          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-medium capitalize">
                {key.replace("_", " ")}
              </label>
              {key === "description" ? (
                <textarea
                  {...register(key)}
                  className="bg-gray-100 rounded-lg p-2 min-h-[80px]"
                />
              ) : (
                <input
                  type={isNumber ? "number" : "text"}
                  step="any"
                  required={key === "total_fractions"}
                  {...register(key)}
                  className="bg-gray-100 rounded-lg p-2"
                />
              )}
              {errors[key] && (
                <p className="text-red-500 text-sm">{errors[key]?.message}</p>
              )}
            </div>
          );
        })}

        {/* Image Upload Section UI */}
        <div className="col-span-2 border rounded-lg p-4">
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
          />

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <FiUpload /> Upload
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <div
                key={preview.url}
                className="relative group rounded overflow-hidden"
              >
                {preview.file.type.startsWith("video") ? (
                  <video
                    src={preview.url}
                    className="w-full h-24 object-cover rounded"
                    muted
                  />
                ) : (
                  <img
                    src={preview.url}
                    className="w-full h-24 object-cover rounded"
                    alt={`Preview ${index + 1}`}
                  />
                )}

                {/* ❌ Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating..." : "Create Property"}
          </button>
        </div>
      </form>

      {/* Type assertion for PropertyTable to handle the type mismatch */}
      <PropertyTable 
        properties={properties as any} 
        loading={loadingProperties} 
      />
    </div>
  );
};

export default AdminInvestmentsPage;
