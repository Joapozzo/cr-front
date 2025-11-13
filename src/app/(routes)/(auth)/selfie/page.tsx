import { SelfieForm } from '@/app/components/auth/SelfieForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verificación de Selfie | Copa Relámpago',
  description: 'Completa tu registro subiendo una selfie para verificación',
};

export default function SelfiePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <SelfieForm />
      </div>
    </div>
  );
}

