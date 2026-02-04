import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../api/axios";
import { fetchProperties } from "../../api/properties";
import { ApiProperty } from "../../types/property";
import { AdminUser } from "../../types/user";
import { assignInvestmentSchema, AssignInvestmentValues } from "../../validators/assignInvestment.schema";
import { isVideoUrl, normalizeMediaUrl } from "../../util/normalizeMediaUrl";

const AssignInvestment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userIdParam = searchParams.get("userId");
  const userId = userIdParam ? Number(userIdParam) : NaN;

  const [user, setUser] = useState<AdminUser | null>(null);
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<ApiProperty | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<AssignInvestmentValues>({
    resolver: zodResolver(assignInvestmentSchema) as Resolver<AssignInvestmentValues>,
    defaultValues: {
      user_id: userId || 0,
      property_id: 0,
      fractions_owned: 1,
      initial_value: 1,
      current_value: 1,
      image_url: "",
    },
  });

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userRes, propertiesRes] = await Promise.all([
          api.get<AdminUser>(`/admin/users/${userId}`),
          fetchProperties(),
        ]);

        setUser(userRes.data);
        setProperties(propertiesRes);
      } catch (error) {
        console.error("Failed to load assign investment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const selectedImage = useMemo(() => {
    if (!selectedProperty) return "";
    const candidate = [
      selectedProperty.primary_image,
      ...(selectedProperty.image_urls ?? []),
    ]
      .map((url) => normalizeMediaUrl(url))
      .filter(Boolean)
      .find((url) => !isVideoUrl(url));

    return candidate ?? "";
  }, [selectedProperty]);

  const selectedMediaUrls = useMemo(() => {
    if (!selectedProperty) return [] as string[];
    return [selectedProperty.primary_image, ...(selectedProperty.image_urls ?? [])]
      .map((url) => normalizeMediaUrl(url))
      .filter(Boolean) as string[];
  }, [selectedProperty]);

  useEffect(() => {
    if (!selectedProperty) return;
    setValue("property_id", selectedProperty.id);
    setValue("image_url", selectedImage);
    setValue("initial_value", selectedProperty.project_value);
    setValue("current_value", selectedProperty.project_value);
  }, [selectedProperty, selectedImage, setValue]);

  const onSubmit = async (data: AssignInvestmentValues) => {
    try {
      await api.post("/admin/investments", {
        ...data,
        image_url: selectedImage,
      });
      toast.success("Investment assigned successfully");
      navigate("/admindashboard/user_management");
    } catch (error: unknown) {
      console.error("Failed to assign investment:", error);
      const err = error as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to assign investment"
      );
    }
  };

  if (!userIdParam || Number.isNaN(userId)) {
    return <p className="text-center py-10">Missing user information.</p>;
  }

  if (loading) {
    return <p className="text-center py-10">Loading data...</p>;
  }

  return (
    <div className="mx-auto px-4">
      <Toaster />
      <section>
        <div className="pt-6 mb-8">
          <h2 className="font-bold text-blue-900 text-3xl">
            Assign Investment
          </h2>
          <p className="text-gray-400 text-sm">
            Select a property and assign investment details
          </p>
        </div>

        {user && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Assigning to</p>
            <p className="text-blue-900 font-semibold">{user.full_name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const mediaUrls = [property.primary_image, ...(property.image_urls ?? [])]
                  .map((url) => normalizeMediaUrl(url))
                  .filter(Boolean) as string[];
                const imageSrc = mediaUrls.find((url) => !isVideoUrl(url));
                const videoSrc = mediaUrls.find((url) => isVideoUrl(url));
                const isSelected = selectedProperty?.id === property.id;

                return (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => setSelectedProperty(property)}
                    className={`text-left bg-white border rounded-xl shadow-sm overflow-hidden transition ${
                      isSelected ? "border-blue-600" : "border-gray-200 hover:border-blue-400"
                    }`}
                  >
                    <div className="h-40 bg-gray-100">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : videoSrc ? (
                        <video
                          className="w-full h-full object-cover"
                          src={videoSrc}
                          muted
                          playsInline
                          loop
                          autoPlay
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Image unavailable
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-blue-900 text-sm">
                        {property.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">
                        {property.location}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
            >
              <h3 className="font-semibold text-blue-900">Investment Details</h3>

              <div>
                <label className="text-sm text-gray-600">Fractions Owned</label>
                <input
                  type="number"
                  {...register("fractions_owned")}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.fractions_owned?.message}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Initial Value</label>
                <input
                  type="number"
                  {...register("initial_value")}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.initial_value?.message}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Current Value</label>
                <input
                  type="number"
                  {...register("current_value")}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.current_value?.message}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Media</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedMediaUrls.length > 0 ? (
                    selectedMediaUrls.map((url) => (
                      <div
                        key={url}
                        className="h-24 w-full rounded-md border border-gray-200 bg-gray-50 overflow-hidden"
                      >
                        {isVideoUrl(url) ? (
                          <video
                            className="h-full w-full object-cover"
                            src={url}
                            muted
                            playsInline
                            loop
                          />
                        ) : (
                          <img
                            src={url}
                            alt={selectedProperty?.title ?? "Selected property"}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 h-24 w-full rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                      No media available
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedProperty}
                className="w-full bg-blue-900 text-white rounded-md py-3 text-sm font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Assigning..." : "Assign Property"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssignInvestment;
