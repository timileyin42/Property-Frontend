import { api } from "../api/axios";
import type { AdminUser, UsersResponse } from "../types/user";

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const { data } = await api.get<UsersResponse>("/admin/users");
  return data.users;
};

export const fetchAdminUser = async (userId: number): Promise<AdminUser> => {
  const { data } = await api.get<AdminUser>(`/admin/users/${userId}`);
  return data;
};

export const updateAdminUser = async (
  userId: number,
  payload: Partial<Pick<AdminUser, "full_name" | "email" | "phone" | "is_active">>
): Promise<AdminUser> => {
  const { data } = await api.patch<AdminUser>(`/admin/users/${userId}`, payload);
  return data;
};


// user profile


// export const getCurrentUser = async (): Promise<User> => {
//   try {
//     const response = await apiClient.get<User>('/user/me'); // Adjust endpoint as needed
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching current user:', error);
//     throw new Error('Failed to fetch user data');
//   }
// };



// // Update user profile
// export const updateUserProfile = async (
//   data: UpdateUserProfileRequest
// ): Promise<ExtendedUserProfile> => {
//   try {
//     const response = await apiClient.patch<UpdateUserProfileResponse>(
//       '/user/profile',
//       data
//     );
    
//     // In a real implementation, you might want to fetch the updated extended profile
//     return await getExtendedUserProfile();
//   } catch (error: any) {
//     console.error('Error updating profile:', error);
    
//     if (error.response?.status === 400) {
//       throw new Error(error.response.data?.message || 'Invalid data provided');
//     }
    
//     if (error.response?.status === 401) {
//       throw new Error('Session expired. Please login again.');
//     }
    
//     throw new Error('Failed to update profile. Please try again.');
//   }
// };





// export const updateUserProfile = async (
//   data: UpdateUserProfileRequest
// ): Promise<User> => {
//   try {
//     const response = await apiClient.put<UpdateUserProfileResponse>(
//       '/user/profile',
//       data
//     );
//     return response.data.user;
//   } catch (error: any) {
//     console.error('Error updating profile:', error);
    
//     // Handle specific error messages
//     if (error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     }
    
//     throw new Error('Failed to update profile');
//   }
// };


// ---------------------------
// Admin actions
// ---------------------------
export const updateUserRole = async (
  userId: number,
  role: "ADMIN" | "INVESTOR"
): Promise<void> => {
  await api.patch(`/admin/users/${userId}/role`, { role });
};

export const deactivateUser = async (userId: number): Promise<void> => {
  await updateAdminUser(userId, { is_active: false });
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/admin/users/${userId}`);
};

export const resetUserPassword = async (userId: number): Promise<void> => {
  await api.post(`/admin/users/${userId}/reset-password`);
};
