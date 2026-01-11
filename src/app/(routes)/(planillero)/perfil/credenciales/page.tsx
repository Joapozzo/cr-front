'use client';

import React from 'react';
import { useMisCredenciales } from '@/app/hooks/useCredenciales';
import { TarjetaCredencial } from '@/app/components/credenciales/TarjetaCredencial';
import { adaptarCredencialParaComponente } from '@/app/components/credenciales/types';
import { AlertCircle, CreditCard, RefreshCw, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/Button';
import { CredencialesListSkeleton } from '@/app/components/skeletons/CredencialSkeleton';
import { BaseModal } from '@/app/components/modals/ModalAdmin';
import { CredencialesInfoContent } from '@/app/components/credenciales/CredencialesInfoContent';

export default function CredencialesPage() {
    const {
        data: credenciales,
        isLoading,
        isError,
        error,
        refetch
    } = useMisCredenciales();
    const [showGlobalInfo, setShowGlobalInfo] = React.useState(false);

    if (isLoading) {
        return (
            <div className="space-y-6 px-2 sm:px-4 md:px-6">
                {/* Header skeleton */}
                <div className="text-start my-4 sm:my-6">
                    <div className="h-8 w-48 bg-[var(--gray-300)] rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-72 bg-[var(--gray-300)] rounded animate-pulse" />
                </div>
                {/* Credenciales skeleton */}
                <CredencialesListSkeleton count={1} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-[var(--white)] mb-2">
                        Error al cargar credenciales
                    </h3>
                    <p className="text-[var(--gray-100)] text-sm mb-4">
                        {error?.message || 'No se pudieron cargar las credenciales'}
                    </p>
                    <Button
                        onClick={() => refetch()}
                        variant="default"
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-strong)] transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    if (!credenciales || credenciales.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-6">
                <CreditCard className="w-16 h-16 text-[var(--gray-100)] opacity-50" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-[var(--white)] mb-2">
                        No tienes credenciales
                    </h3>
                    <p className="text-[var(--gray-100)] text-sm max-w-md">
                        Aún no se han generado credenciales digitales para tu cuenta.
                        Las credenciales se generan automáticamente cuando formas parte de un equipo activo.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-2 sm:px-4 md:px-6 mb-20">
            {/* Header */}
            <div className="flex justify-between items-start my-4 sm:my-6">
                <div className="text-start">
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--white)] mb-2">
                        Mis credenciales
                    </h1>
                    <p className="text-[var(--gray-100)] text-sm">
                        Credenciales digitales activas para validación
                    </p>
                </div>
                <button
                    onClick={() => setShowGlobalInfo(true)}
                    className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                    aria-label="Información importante"
                >
                    <Info size={20} />
                </button>
            </div>

            {/* Lista de credenciales */}
            <div className="space-y-8">
                {credenciales.map((credencialBackend, index) => {
                    const credencial = adaptarCredencialParaComponente(credencialBackend);

                    return (
                        <motion.div
                            key={credencial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[var(--card-background)] rounded-lg p-4 sm:p-6 border border-[var(--gray-300)]"
                        >
                            <div className="w-full max-w-sm mx-auto space-y-6">
                                {/* Tarjeta de credencial */}
                                <TarjetaCredencial
                                    credencial={credencial}
                                    mostrarAcciones={true}
                                    autoFlip={false}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Global Info Modal */}
            <BaseModal
                isOpen={showGlobalInfo}
                onClose={() => setShowGlobalInfo(false)}
                title="Información Importante"
                type="info"
                maxWidth="max-w-md"
            >
                <div className="space-y-6">
                    <CredencialesInfoContent />
                    <div className="pt-4 border-t border-[var(--gray-300)] w-full">
                        <Button
                            onClick={() => setShowGlobalInfo(false)}
                            className="w-full"
                            variant="default"
                        >
                            Entendido
                        </Button>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}
