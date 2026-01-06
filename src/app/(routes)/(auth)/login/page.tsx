'use client';

import { AuthLayout } from '@/app/components/auth/AuthLayout'; 
import { LoginForm } from '@/app/components/auth/LoginForm';
import { useTenant } from '@/app/contexts/TenantContext';

export default function LoginPage() {
  const tenant = useTenant();
  
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