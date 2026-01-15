'use client';

import { AuthLayout } from '@/app/components/auth/AuthLayout'; 
import { LoginForm } from '@/app/components/auth/LoginForm';
import { useTenant } from '@/app/contexts/TenantContext';
import { useAuthStateListener } from '@/app/hooks/auth/useAuthStateListener';

export default function LoginPage() {
  const tenant = useTenant();

  // ✅ MOBILE-SAFE: Usar listener centralizado que procesa usuarios idempotentemente
  useAuthStateListener({
    redirigir: true, // Redirigir automáticamente después de procesar
  });
  
  return (
    <AuthLayout
      title="¡Bienvenido! 👋"
      subtitle=""
      infoTitle="novedades"
      infoDescription={`¡Conocé la versión beta del nuevo sistema de ${tenant.nombre_corto}!`}
    >
      <LoginForm />
    </AuthLayout>
  );
}