'use client';

import { usePlayerStore } from '@/app/stores/playerStore';
import { useFichaMedicaJugador, useSubirFichaMedica } from '@/app/hooks/useFichaMedica';
import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { FormModal, FormField, FormDataValue } from '@/app/components/modals/ModalAdmin';
import { Upload, Clock, CheckCircle2, XCircle, AlertCircle, FileX } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function FichaMedicaPage() {
    const { jugador } = usePlayerStore();
    const idJugador = jugador?.id_jugador;

    const { data: fichaMedica, isLoading, refetch } = useFichaMedicaJugador(
        idJugador ?? 0,
        { enabled: !!idJugador }
    );

    const { mutate: subirFicha, isPending: isSubiendo } = useSubirFichaMedica();
    const [showModal, setShowModal] = useState(false);

    const handleSubirFicha = async (data: Record<string, FormDataValue>) => {
        if (!idJugador) {
            throw new Error('No se pudo identificar al jugador');
        }

        // Prevenir subida si ya tiene ficha
        if (fichaMedica) {
            throw new Error('Ya tienes una ficha médica registrada. No puedes actualizarla. Si necesitas hacer cambios, contacta a un administrador.');
        }

        const archivo = data.archivo as File;

        if (!archivo) {
            throw new Error('Debe seleccionar un archivo PDF');
        }

        if (archivo.type !== 'application/pdf') {
            throw new Error('Solo se permiten archivos PDF');
        }

        if (archivo.size > 10 * 1024 * 1024) {
            throw new Error('El archivo no puede exceder 10MB');
        }

        return new Promise<void>((resolve, reject) => {
            subirFicha(
                {
                    id_jugador: idJugador,
                    archivo: archivo,
                },
                {
                    onSuccess: () => {
                        refetch();
                        setShowModal(false);
                        resolve();
                    },
                    onError: (error) => {
                        reject(error);
                    },
                }
            );
        });
    };

    const getEstadoBadge = () => {
        if (!fichaMedica) {
            return null;
        }

        // Si la ficha es válida, mostrar como activa
        if (fichaMedica.valida) {
            return (
                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Activa
                </span>
            );
        }

        // Estados según el estado de la ficha
        const estadoConfig = {
            E: {
                icon: <Clock className="w-4 h-4" />,
                text: 'En revisión',
                className: 'bg-[var(--color-warning)] text-white',
            },
            V: {
                icon: <Clock className="w-4 h-4" />,
                text: 'Vencida',
                className: 'bg-[var(--color-warning)] text-white',
            },
            R: {
                icon: <XCircle className="w-4 h-4" />,
                text: 'Rechazada',
                className: 'bg-[var(--color-danger)] text-white',
            },
            I: {
                icon: <AlertCircle className="w-4 h-4" />,
                text: 'Inactiva',
                className: 'bg-[var(--gray-300)] text-[var(--gray-100)]',
            },
            A: {
                icon: <CheckCircle2 className="w-4 h-4" />,
                text: 'Activa',
                className: 'bg-[var(--color-primary)] text-white',
            },
        };

        const config = estadoConfig[fichaMedica.estado as keyof typeof estadoConfig] || estadoConfig.I;

        return (
            <span className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${config.className}`}>
                {config.icon}
                {config.text}
            </span>
        );
    };

    const subirFichaFields: FormField[] = [
        {
            name: 'archivo',
            label: 'Archivo PDF',
            type: 'file',
            accept: 'application/pdf',
            required: true,
        },
    ];

    if (!idJugador) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-[var(--gray-100)]">No se encontraron datos del jugador</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6 px-6">
                <div className="text-start my-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <Skeleton height={32} width={200} borderRadius={6} />
                        <Skeleton height={16} width={300} borderRadius={6} className="mt-2" />
                    </SkeletonTheme>
                </div>
                <div className="bg-[var(--card-background)] rounded-lg p-6 space-y-6">
                    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                        <div className="flex items-center justify-between">
                            <Skeleton height={20} width={100} borderRadius={6} />
                            <Skeleton height={36} width={150} borderRadius={20} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton height={60} borderRadius={6} />
                            <Skeleton height={60} borderRadius={6} />
                        </div>
                        <Skeleton height={48} width={200} borderRadius={20} />
                    </SkeletonTheme>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-6">
            {/* Header */}
            <div className="text-start my-6">
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Ficha médica
                </h1>
                <p className="text-[var(--gray-100)] text-sm">
                    Gestiona tu ficha médica deportiva
                </p>
            </div>

            {/* Contenido */}
            <div className="bg-[var(--card-background)] rounded-lg border border-[var(--gray-300)] p-6 space-y-6">
                {fichaMedica ? (
                    <>
                        {/* Card de Estado */}
                        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--gray-100)] font-medium">Estado:</span>
                                {getEstadoBadge()}
                            </div>
                        </div>

                        {/* Línea divisoria */}
                        <div className="border-t border-[var(--gray-300)]"></div>

                        {/* Información adicional si está rechazada */}
                        {fichaMedica.estado === 'R' && fichaMedica.motivo_rechazo && (
                            <>
                                <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-lg p-4">
                                    <p className="text-[var(--color-danger)] text-sm font-medium mb-1">
                                        Motivo de rechazo:
                                    </p>
                                    <p className="text-[var(--color-danger)] text-sm">
                                        {fichaMedica.motivo_rechazo}
                                    </p>
                                </div>
                                {/* Línea divisoria */}
                                <div className="border-t border-[var(--gray-300)]"></div>
                            </>
                        )}

                        {/* Card de Fechas */}
                        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[var(--gray-100)] text-sm block">Fecha de emisión:</span>
                                    <p className="text-[var(--white)] font-medium text-base">
                                        {new Date(fichaMedica.fecha_emision).toLocaleDateString('es-AR')}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[var(--gray-100)] text-sm block">Fecha de vencimiento:</span>
                                    <p className="text-[var(--white)] font-medium text-base">
                                        {new Date(fichaMedica.fecha_vencimiento).toLocaleDateString('es-AR')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Línea divisoria */}
                        <div className="border-t border-[var(--gray-300)]"></div>

                        {/* Advertencia: No se puede actualizar */}
                        <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-lg p-4">
                            <p className="text-[var(--color-warning)] text-sm font-medium">
                                ⚠️ No puedes actualizar tu ficha médica una vez subida. Si necesitas hacer cambios, contacta a un administrador.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <FileX className="w-16 h-16 text-[var(--gray-200)] mx-auto mb-4" />
                        <p className="text-[var(--gray-100)] mb-2 text-lg">
                            No tienes una ficha médica registrada
                        </p>
                        <p className="text-[var(--gray-200)] text-sm mb-6">
                            Sube tu ficha médica para poder participar en los torneos
                        </p>
                        <Button
                            variant="success"
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 mx-auto"
                            disabled={isSubiendo}
                        >
                            <Upload className="w-4 h-4" />
                            {isSubiendo ? 'Subiendo...' : 'Cargar ficha médica'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal para subir ficha */}
            <FormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={fichaMedica ? 'Actualizar ficha médica' : 'Subir ficha médica'}
                fields={subirFichaFields}
                onSubmit={handleSubirFicha}
                submitText={fichaMedica ? 'Actualizar' : 'Subir'}
                type="create"
                isLoading={isSubiendo}
                maxWidth="max-w-2xl"
            >
                {fichaMedica && (
                    <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-lg p-4 mb-4">
                        <p className="text-[var(--color-warning)] text-sm font-medium mb-1">
                            ⚠️ Advertencia importante
                        </p>
                        <p className="text-[var(--color-warning)] text-sm">
                            Ya tienes una ficha médica registrada. Una vez subida, no podrás actualizarla. Si necesitas hacer cambios, contacta a un administrador.
                        </p>
                    </div>
                )}
            </FormModal>
        </div>
    );
}

