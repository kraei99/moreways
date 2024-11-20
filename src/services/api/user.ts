import { api } from '@/lib/api';
import type { User, Notification } from '@/lib/types';

export interface UserUpdate {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export const userApi = {
  getProfile: async () => {
    const { data } = await api.get<User>('/user/profile');
    return data;
  },
  
  updateProfile: async (updateData: UserUpdate) => {
    const { data } = await api.put<User>('/user/profile', updateData);
    return data;
  },
  
  changePassword: async (passwordData: PasswordChange) => {
    await api.put('/user/password', passwordData);
  },
  
  getNotifications: async (params?: { page?: number; limit?: number; read?: boolean }) => {
    const { data } = await api.get<Notification[]>('/user/notifications', { params });
    return data;
  },

  markNotificationRead: async (notificationId: string) => {
    await api.put(`/user/notifications/${notificationId}/read`);
  },

  updateNotificationPreferences: async (preferences: NotificationPreferences) => {
    const { data } = await api.put('/user/notification-preferences', preferences);
    return data;
  }
};