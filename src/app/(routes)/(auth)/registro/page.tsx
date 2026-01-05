'use client';

import { RegistrationProvider } from "@/app/contexts/RegistrationContext";
import { RegistrationLayout } from "@/app/components/auth/RegistrationLayout";
import { RegistrationFlow } from "@/app/components/auth/RegistrationFlow";

export default function RegisterPage() {
  return (
    <RegistrationProvider>
      <RegistrationLayout
        title="Crear cuenta 🎯"
        subtitle="Completa los siguientes pasos para registrarte en Copa Relámpago"
        infoTitle="únete a nosotros"
        infoDescription="Regístrate para disfrutar de todas las funcionalidades de Copa Relámpago"
        infoPosition="right"
        showBackButton={true}
      >
        <RegistrationFlow />
      </RegistrationLayout>
    </RegistrationProvider>
  );
}