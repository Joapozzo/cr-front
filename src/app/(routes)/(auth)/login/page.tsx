import { AuthLayout } from '@/app/components/auth/AuthLayout'; 
import { LoginForm } from '@/app/components/auth/LoginForm'; 

export default function LoginPage() {
  return (
    <AuthLayout
      title="¡Bienvenido! 👋"
      subtitle=""
      infoTitle="novedades"
      infoDescription="¡Conocé la versión beta del nuevo sistema de CR!"
    >
      <LoginForm />
    </AuthLayout>
  );
}