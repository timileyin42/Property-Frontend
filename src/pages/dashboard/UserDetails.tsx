import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { fetchAdminUser, updateAdminUser } from "../../api/admin.users.api";
import { AdminUser } from "../../types/user";
import { adminUserUpdateSchema, AdminUserUpdateValues } from "../../validators/adminUserUpdate.schema";

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserUpdateValues>({
    resolver: zodResolver(adminUserUpdateSchema) as any,
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      try {
        const data = await fetchAdminUser(Number(id));
        setUser(data);
        reset({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone ?? "",
          is_active: data.is_active ?? true,
        });
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, reset]);

  const onSubmit = async (values: AdminUserUpdateValues) => {
    if (!id) return;

    try {
      const updated = await updateAdminUser(Number(id), values);
      setUser(updated);
      toast.success("User updated successfully");
    } catch (error: any) {
      console.error("Failed to update user:", error);
      toast.error(error?.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeactivate = async () => {
    if (!id) return;

    try {
      const updated = await updateAdminUser(Number(id), { is_active: false });
      setUser(updated);
      reset({
        full_name: updated.full_name,
        email: updated.email,
        phone: updated.phone ?? "",
        is_active: updated.is_active ?? false,
      });
      toast.success("User deactivated");
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      toast.error("Failed to deactivate user");
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading user details...</p>;
  }

  if (!user) {
    return <p className="text-center py-10">User not found.</p>;
  }

  return (
    <div className="mx-auto px-4">
      <Toaster />
      <section>
        <div className="pt-6 mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-blue-900 text-3xl">User Details</h2>
            <p className="text-gray-400 text-sm">
              Manage user information and status
            </p>
          </div>
          <button
            onClick={() => navigate("/admindashboard/user_management")}
            className="border border-blue-900 text-blue-900 rounded-md px-4 py-2 text-sm hover:bg-blue-50 transition"
          >
            Back to Users
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900">{user.full_name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">Role: {user.role}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 max-w-2xl"
        >
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              {...register("full_name")}
              className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.full_name?.message}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
            />
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              {...register("phone")}
              className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("is_active")} />
            <span className="text-sm text-gray-600">Active</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-900 text-white rounded-md px-4 py-2 text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDeactivate}
              className="border border-red-500 text-red-500 rounded-md px-4 py-2 text-sm hover:bg-red-50"
            >
              Deactivate
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UserDetails;
