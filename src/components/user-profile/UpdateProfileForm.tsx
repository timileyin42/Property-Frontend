import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../api/axios";
import type { ProfileUpdatePayload, User } from "../../types/userProfile";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone number is required"),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

interface UpdateProfileFormProps {
  user: User;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onProfileUpdated: (user: User) => void;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  user,
  isEditing,
  onEdit,
  onCancel,
  onProfileUpdated,
}) => {
  const defaultValues = useMemo<UpdateProfileValues>(() => {
    const [firstName = "", ...rest] = user.full_name.split(" ");
    const lastName = rest.join(" ");

    return {
      firstName,
      lastName,
      email: user.email,
      phone: user.phone ?? "",
      gender: user.gender ?? "",
      address: user.address ?? "",
      city: user.city ?? "",
      state: user.state ?? "",
    };
  }, [user]);

  const { register, handleSubmit, reset } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCancel = () => {
    reset(defaultValues);
    onCancel();
  };

  const onSubmit = async (values: UpdateProfileValues) => {
    const payload: ProfileUpdatePayload = {
      full_name: `${values.firstName} ${values.lastName}`.trim(),
      phone: values.phone,
      gender: values.gender,
      address: values.address,
      city: values.city,
      state: values.state,
    };

    try {
      const res = await api.patch<User>("/user/profile", payload);
      onProfileUpdated(res.data);
      onCancel();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const fieldClass =
    "w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded-lg px-4 py-3 text-on-surface outline-none transition-colors focus:border-premium-gold disabled:opacity-60 placeholder:text-on-surface-variant/40";
  const labelClass = "label-caps text-[10px] text-on-surface-variant";

  const field = (
    name: "firstName" | "lastName" | "email" | "phone" | "gender" | "city" | "address" | "state",
    label: string,
    opts: { disabled?: boolean; colSpan?: boolean } = {}
  ) => (
    <div className={`space-y-2 ${opts.colSpan ? "md:col-span-2" : ""}`}>
      <label className={labelClass}>{label}</label>
      <input {...register(name)} disabled={opts.disabled ?? !isEditing} className={fieldClass} />
    </div>
  );

  return (
    <div className="glass-panel rounded-xl p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h3 className="font-display text-2xl text-on-surface">Personal Information</h3>
          <p className="text-on-surface-variant text-sm">Update your personal details</p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={onEdit}
            className="btn-gold px-5 py-2.5 text-[12px] inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Update Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-full border border-[rgba(248,246,241,0.15)] text-on-surface-variant hover:text-on-surface label-caps transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="update-profile-form"
              className="btn-gold px-5 py-2.5 text-[12px] inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              Save Changes
            </button>
          </div>
        )}
      </div>

      <form
        id="update-profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {field("firstName", "First Name")}
        {field("lastName", "Last Name")}
        {field("email", "Email Address", { disabled: true })}
        {field("phone", "Phone Number")}
        {field("gender", "Gender")}
        {field("city", "City")}
        {field("address", "Residential Address", { colSpan: true })}
        {field("state", "State / Province")}
      </form>
    </div>
  );
};

export default UpdateProfileForm;
