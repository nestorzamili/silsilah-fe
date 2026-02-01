import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services';
import { useAuthStore } from '@/stores';

export function useUserProfile() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['user-profile'],
    queryFn: authService.getProfile,
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
