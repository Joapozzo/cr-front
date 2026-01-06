import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/app/components/auth/ResetPasswordForm';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getTenantConfig } from '@/config/tenant.loader';

const tenantConfig = getTenantConfig();

export const metadata: Metadata = {
  title: `Restablecer Contraseña | ${tenantConfig.nombre_empresa}`,
  description: 'Crea una nueva contraseña segura',
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Crea una contraseña segura para tu cuenta"
      infoTitle="Seguridad"
      infoDescription="Una contraseña fuerte protege tu cuenta. Usa al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos."
      showBackButton={false}
    >
      <Suspense fallback={<div className="flex justify-center p-8">Cargando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}

