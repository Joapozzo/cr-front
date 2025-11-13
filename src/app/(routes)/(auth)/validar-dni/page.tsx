import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { ValidarDniForm } from '@/app/components/auth/ValidarDNIForm';

export default function ValidarDniPage() {
  return (
    <AuthLayout
      title="Escanea tu DNI 🪪"
      subtitle="Usa la cámara para escanear el código de barras"
      infoTitle="seguridad"
      infoDescription="Validamos tu identidad escaneando el código de barras de tu DNI para garantizar la seguridad de todos los usuarios"
      infoPosition="right"
      showBackButton={true}
    >
      <ValidarDniForm />
    </AuthLayout>
  );
}