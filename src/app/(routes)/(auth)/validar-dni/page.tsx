'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página deprecada - Redirige a /registro donde está el flujo unificado
 */
export default function ValidarDNIPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/registro');
  }, [router]);

  return null;
}
