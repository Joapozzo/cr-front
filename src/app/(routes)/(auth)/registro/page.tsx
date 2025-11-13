// src/app/(auth)/registro/page.tsx
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { RegisterForm } from "@/app/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crear cuenta 🎯"
      subtitle="Completa los siguientes pasos para registrarte en Copa Relámpago"
      infoTitle="únete a nosotros"
      infoDescription="Regístrate para disfrutar de todas las funcionalidades de Copa Relámpago"
      infoPosition="right"
    >
      <RegisterForm />
    </AuthLayout>
  );
}