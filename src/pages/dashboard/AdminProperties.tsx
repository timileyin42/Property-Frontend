import { useCallback, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { ApiProperty } from "../../types/property";
import { StatusBadge } from "../../components/StatusBadge";
import { normalizeMediaUrl, isVideoUrl } from "../../util/normalizeMediaUrl";
import {
  fetchAdminProperties,
  PropertyStatusFilter,
} from "../../api/admin.properties";
import { UpdatePropertyModal } from "../../components/admincomponents/UpdatePropertyModal";

const STATUS_TABS: Array<"ALL" | PropertyStatusFilter> = [
  "ALL",
  "AVAILABLE",
  "SOLD",
];

const AdminProperties = () => {
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<"ALL" | PropertyStatusFilter>("ALL");
  const [selectedProperty, setSelectedProperty] = useState<ApiProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAdminProperties({
        page: 1,
        page_size: 50,
        status: activeStatus === "ALL" ? undefined : activeStatus,
      });
      setProperties(response.properties ?? []);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to load properties";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [activeStatus]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleOpenModal = (property: ApiProperty) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleUpdate = (updated: ApiProperty) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const rows = useMemo(() => properties, [properties]);

  return (
    <div className="bg-white rounded-xl p-6">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Properties</h2>
          <p className="text-sm text-gray-500">
            View and update all uploaded properties
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveStatus(tab)}
            className={`px-4 py-2 text-sm rounded-lg border transition ${
              activeStatus === tab
                ? "bg-blue-900 text-white border-blue-900"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab === "ALL" ? "All Status" : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading properties...</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-gray-500">No properties found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-4">Property</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Location</th>
                <th className="text-right p-4">Total Value</th>
                <th className="text-right p-4">Fractions</th>
                <th className="text-right p-4">Updated</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((property) => {
                const mediaUrls = [
                  property.primary_image,
                  ...(property.image_urls ?? []),
                ]
                  .map((url) => normalizeMediaUrl(url))
                  .filter(Boolean) as string[];
                const imageUrl = mediaUrls.find((url) => !isVideoUrl(url));
                const videoUrl = mediaUrls.find((url) => isVideoUrl(url));

                return (
                  <tr
                    key={property.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={property.title}
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
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID {property.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="p-4 text-gray-600">{property.location}</td>
                    <td className="p-4 text-right text-gray-600">
                      ₦{property.project_value?.toLocaleString() ?? "-"}
                    </td>
                    <td className="p-4 text-right text-gray-600">
                      {property.total_fractions ?? "-"}
                    </td>
                    <td className="p-4 text-right text-gray-600">
                      {property.updated_at
                        ? new Date(property.updated_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenModal(property)}
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

      <UpdatePropertyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default AdminProperties;
