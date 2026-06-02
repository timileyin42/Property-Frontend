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
        if (err.response?.status === 403) {
          return;
        }
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
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar links={[{ label: "Home", href: "/" }, { label: "Properties", href: "/properties" }]} />
      <Toaster position="top-right" />

      <main className="pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <span className="label-caps text-premium-gold mb-4 block">Intelligence</span>
          <h1 className="font-display text-4xl sm:text-5xl text-on-surface mb-2">Investor Updates</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Real-time intelligence and structural milestones from your fractional real estate
            portfolio.
          </p>
        </header>

        {loading ? (
          <div className="text-sm text-on-surface-variant">Loading updates...</div>
        ) : updates.length === 0 ? (
          <div className="glass-panel rounded-xl p-10 text-center text-on-surface-variant">
            No updates yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Updates;
