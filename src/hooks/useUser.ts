import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, type UserUpdate, type PasswordChange, type NotificationPreferences } from '@/services/api/user';
import { useToast } from '@/components/ui/use-toast';

export function useProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userApi.getProfile,
  });
}

export function useUserOperations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateProfile = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    },
  });

  const changePassword = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
      });
    },
  });

  const updateNotificationPreferences = useMutation({
    mutationFn: userApi.updateNotificationPreferences,
    onSuccess: () => {
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been updated.',
      });
    },
  });

  return {
    updateProfile,
    changePassword,
    updateNotificationPreferences,
  };
}

export function useNotifications(params?: { page?: number; limit?: number; read?: boolean }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', params],
    queryFn: () => userApi.getNotifications(params),
  });

  const markAsRead = useMutation({
    mutationFn: userApi.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: data,
    isLoading,
    markAsRead,
  };
}