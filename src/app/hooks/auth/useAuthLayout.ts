'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLogout } from '@/app/hooks/auth/useLogout';
import { useAuthStore } from '@/app/stores/authStore';

export const useAuthLayout = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogout();
  const { isAuthenticated } = useAuthStore();

  const isAuthEntry = pathname === '/login' || pathname === '/registro';

  const backRoute = isAuthEntry ? '/' : '/login';
  const backLabel = isAuthEntry ? 'Volver al Home' : 'Volver al Login';

  const handleBackClick = async () => {
    router.push(backRoute);
  };

  return {
    backLabel,
    handleBackClick,
    backRoute,
  };
};
