import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { RecuperarPasswordForm } from '@/app/components/auth/RecuperarPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | Copa Relámpago',
  description: 'Recupera el acceso a tu cuenta',
};

export default function RecuperarPasswordPage() {
  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Te ayudaremos a recuperar el acceso a tu cuenta"
      infoTitle="Seguridad"
      infoDescription="Tu contraseña es importante. Asegúrate de crear una contraseña segura y única."
      showBackButton={true}
    >
      <RecuperarPasswordForm />
    </AuthLayout>
  );
}

