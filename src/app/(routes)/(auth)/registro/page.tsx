'use client';

import { RegistrationProvider } from "@/app/contexts/RegistrationContext";
import { RegistrationLayout } from "@/app/components/auth/RegistrationLayout";
import { RegistrationFlow } from "@/app/components/auth/RegistrationFlow";
import { useTenant } from "@/app/contexts/TenantContext";
import { useAuthStateListener } from '@/app/hooks/auth/useAuthStateListener';

export default function RegisterPage() {
  const tenant = useTenant();

  // ✅ MOBILE-SAFE: Usar listener centralizado que procesa usuarios idempotentemente
  useAuthStateListener({
    redirigir: true, // Redirigir automáticamente después de procesar
  });
  
  return (
    <RegistrationProvider>
      <RegistrationLayout
        title="Crear cuenta 🎯"
        subtitle={`Completa los siguientes pasos para registrarte en ${tenant.nombre_empresa}`}
        infoTitle="únete a nosotros"
        infoDescription={`Regístrate para disfrutar de todas las funcionalidades de ${tenant.nombre_empresa}`}
        infoPosition="right"
        showBackButton={true}
      >
        <RegistrationFlow />
      </RegistrationLayout>
    </RegistrationProvider>
  );
}