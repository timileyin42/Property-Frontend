import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../api/axios";
import type { ProfileUpdatePayload, User } from "../../types/userProfile";

const updateProfileIcon = "https://www.figma.com/api/mcp/asset/62a060a1-d072-4abb-beae-0c7f624bc217";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone number is required"),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
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
      gender: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
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
    };

    try {
      const res = await api.patch<User>("/user/profile", payload);
      onProfileUpdated(res.data);
      onCancel();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="bg-white border border-black/10 rounded-[14px] p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[#1e3a8a] text-[20px] font-medium leading-[28px]">
            Personal Information
          </h3>
          <p className="text-[#717182] text-[16px] leading-[24px]">
            Update your personal details
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={onEdit}
            className="bg-[#1e3a8a] text-white rounded-[8px] h-9 px-4 inline-flex items-center gap-2 text-[14px] font-medium leading-[20px]"
          >
            <img src={updateProfileIcon} alt="" className="h-4 w-4" />
            Update Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white border border-black/10 text-[#0a0a0a] rounded-[8px] h-9 px-4 text-[14px] font-medium leading-[20px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="update-profile-form"
              className="bg-[#1e3a8a] text-white rounded-[8px] h-9 px-4 inline-flex items-center gap-2 text-[14px] font-medium leading-[20px]"
            >
              <img src={updateProfileIcon} alt="" className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <form
        id="update-profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            First Name
          </label>
          <input
            {...register("firstName")}
            disabled={!isEditing}
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            Last Name
          </label>
          <input
            {...register("lastName")}
            disabled={!isEditing}
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            Email Address
          </label>
          <input
            {...register("email")}
            disabled
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            Phone Number
          </label>
          <input
            {...register("phone")}
            disabled={!isEditing}
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            Gender
          </label>
          <input
            {...register("gender")}
            disabled
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            Date of Birth
          </label>
          <input
            {...register("dateOfBirth")}
            disabled
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            Address
          </label>
          <input
            {...register("address")}
            disabled
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            City
          </label>
          <input
            {...register("city")}
            disabled
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
            State
          </label>
          <input
            {...register("state")}
            disabled
            className="bg-[#f3f3f5] rounded-[8px] h-9 px-3 text-[14px] leading-[20px] text-[#0a0a0a] disabled:opacity-50"
          />
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
