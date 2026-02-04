import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import UpdateCard from "../components/updates/UpdateCard";
import { fetchUpdates } from "../api/updates";
import type { UpdateItem } from "../types/updates";

const Updates = () => {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        const res = await fetchUpdates({ page: 1, page_size: 20 });
        setUpdates(res.updates ?? []);
      } catch (error: unknown) {
        const err = error as {
          response?: { status?: number; data?: { detail?: string; message?: string } };
          message?: string;
        };
        if (err.response?.status === 401) {
          toast.error("Please login to view updates");
          return;
        }
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

    loadUpdates();
  }, []);

  return (
    <div className="mx-auto px-4 my-16">
      <Navbar links={[{ label: "Home", href: "/" }, { label: "Properties", href: "/properties" }]} />
      <Toaster position="top-right" />

      <section className="pt-6 mb-8">
        <h2 className="font-bold text-blue-900 text-3xl">Updates</h2>
        <p className="text-gray-400 text-sm">
          Track project updates and announcements
        </p>
      </section>

      {loading ? (
        <div className="text-sm text-gray-500">Loading updates...</div>
      ) : updates.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-500">
          No updates yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Updates;
