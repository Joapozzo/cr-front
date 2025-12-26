'use client';

import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { SelfieForm } from '@/app/components/auth/SelfieForm';

export default function SelfiePage() {
  return (
    <AuthLayout
      title="Verificación de Identidad 👤"
      subtitle="Vamos a tomar una foto de tu rostro para verificar tu identidad"
      infoTitle="seguridad"
      infoDescription="Validamos tu identidad con una selfie para garantizar la seguridad de todos los usuarios"
      infoPosition="right"
      showBackButton={true}
    >
      <SelfieForm />
    </AuthLayout>
  );
}

