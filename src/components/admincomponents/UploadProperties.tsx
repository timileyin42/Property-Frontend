import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiUpload } from "react-icons/fi";

import { api } from "../../api/axios";
import { fetchProperties } from "../../api/properties";
import { PropertyTable } from "../../components/PropertyTable";
// Remove this import since it's causing conflicts
// import type { ApiProperty as ImportedApiProperty, PropertyStatus as ImportedPropertyStatus } from "../../types/property";

// Use your LOCAL types that are already defined in this file
export type PropertyStatus = "AVAILABLE" | "SOLD" | "PENDING";

export interface ApiProperty {
  id: number;
  title: string;
  location: string;
  description: string;
  status: PropertyStatus;
  image_urls: string[];
  primary_image: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  expected_roi: number;
  total_fractions: number;
  fraction_price: number;
  project_value: number;
  fractions_sold: number;
  fractions_available: number;
  is_fractional: boolean;
  created_at: string;
  updated_at: string;
}

/* =======================
   Schema Definition
======================= */

const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  project_value: z.coerce.number().positive(),
  total_fractions: z.coerce.number().int().positive(),
  fraction_price: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  area_sqft: z.coerce.number().positive(),
  expected_roi: z.coerce.number().nonnegative(),
});

// Explicitly define the type to match the schema
type PropertyFormValues = {
  title: string;
  location: string;
  description: string;
  project_value: number;
  total_fractions: number;
  fraction_price: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  expected_roi: number;
};

/* =======================
   Constants
======================= */

const MAX_FILE_SIZE = 100 * 1024 * 1024;
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
      project_value: 0,
      total_fractions: 0,
      fraction_price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area_sqft: 0,
      expected_roi: 0,
    }
  });

  /* =======================
     Image Selection
  ======================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter(
      (file) =>
        ALLOWED_TYPES.includes(file.type) &&
        file.size <= MAX_FILE_SIZE
    );

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

  const uploadImages = async (
    propertyId?: number
  ): Promise<string[]> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized");
    }

    const uploadedUrls: string[] = [];

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

    try {
      // 1. Upload images
      const imageUrls = await uploadImages();

      // 2. Prepare Payload - use "AVAILABLE" since that's in your local type
      const payload = {
        ...data,
        status: "AVAILABLE" as PropertyStatus, // Use "AVAILABLE" to match your local type
        image_urls: imageUrls,
        primary_image: imageUrls[0] || "", // Add primary_image
      };

      const res = await api.post<ApiProperty>("/admin/properties", payload);
      
      setProperties((prev) => [res.data, ...prev]);
      toast.success("Property created successfully");

      // 3. Clear everything
      reset();
      setFiles([]);
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    } catch (err: any) {
      console.error(err);
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

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <FiUpload /> Upload
          </button>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <div
                key={preview.url}
                className="relative group rounded overflow-hidden"
              >
                <img
                  src={preview.url}
                  className="w-full h-24 object-cover rounded"
                  alt={`Preview ${index + 1}`}
                />

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