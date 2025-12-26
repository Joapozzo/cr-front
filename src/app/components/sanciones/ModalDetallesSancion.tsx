"use client";
import { User, Calendar, Shield, AlertTriangle, FileText, Clock, CheckCircle, XCircle, Gavel, Hash } from 'lucide-react';
import { Sancion } from '@/app/types/sancion';
import { formatearFechaCorta } from '@/app/utils/fechas';
import { BaseModal } from '../modals/ModalAdmin';
import { Button } from '../ui/Button';

interface ModalDetallesSancionProps {
    sancion: Sancion | null;
    onClose: () => void;
}

export default function ModalDetallesSancion({ sancion, onClose }: ModalDetallesSancionProps) {
    if (!sancion) return null;

    const getEstadoIcon = () => {
        if (sancion.estado === 'I' || sancion.estado === 'R') return <XCircle className="w-5 h-5 text-[var(--gray-100)]" />;
        if (sancion.estado === 'C' || (sancion.fechas_restantes || 0) === 0) return <CheckCircle className="w-5 h-5 text-[var(--green)]" />;
        if (sancion.estado === 'A' && (sancion.fechas_restantes || 0) > 0) return <AlertTriangle className="w-5 h-5 text-red-400" />;
        return <CheckCircle className="w-5 h-5 text-[var(--green)]" />;
    };

    const getEstadoText = () => {
        if (sancion.estado === 'I' || sancion.estado === 'R') return 'Revocada';
        if (sancion.estado === 'C' || (sancion.fechas_restantes || 0) === 0) return 'Cumplida';
        if (sancion.estado === 'A' && (sancion.fechas_restantes || 0) > 0) return 'Activa';
        return 'Cumplida';
    };

    return (
        <BaseModal
            isOpen={!!sancion}
            onClose={onClose}
            title="Detalles de sanción"
            type="info"
            maxWidth="max-w-4xl"
        >
            <div className="space-y-4">
                {/* Estado de la sanción - Destacado */}
                <div className="flex items-center gap-3 p-4 bg-[var(--gray-300)] rounded-lg border-l-4 border-[var(--green)]">
                    {getEstadoIcon()}
                    <div className="flex-1">
                        <p className="text-xs text-[var(--gray-100)]">Estado</p>
                        <p className="text-[var(--white)] font-semibold text-lg">{getEstadoText()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-[var(--gray-100)]">Fechas</p>
                        <p className={`text-2xl font-bold ${
                            (sancion.fechas_restantes || 0) > 0 ? 'text-red-400' : 'text-[var(--green)]'
                        }`}>
                            {sancion.fechas_restantes || 0}/{sancion.fechas || 0}
                        </p>
                        <p className="text-xs text-[var(--gray-100)] mt-1">
                            Cumplidas: {(sancion.fechas || 0) - (sancion.fechas_restantes || 0)}
                        </p>
                    </div>
                </div>

                {/* Grid de información */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Jugador */}
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <User className="w-4 h-4 text-[var(--green)] mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)]">Jugador</p>
                            <p className="text-[var(--white)] font-medium text-sm truncate">
                                {sancion.jugador?.usuario?.nombre} {sancion.jugador?.usuario?.apellido}
                            </p>
                            {sancion.jugador?.usuario?.dni && (
                                <p className="text-xs text-[var(--gray-100)]">{sancion.jugador.usuario.dni}</p>
                            )}
                        </div>
                    </div>

                    {/* Jornada */}
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <Calendar className="w-4 h-4 text-[var(--blue)] mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)]">Jornada</p>
                            <p className="text-[var(--white)] font-medium">Jornada {sancion.partido?.jornada || 'N/A'}</p>
                            <p className="text-xs text-[var(--gray-100)]">
                                {sancion.partido?.dia ? formatearFechaCorta(sancion.partido.dia) : 'Por definir'}
                            </p>
                        </div>
                    </div>

                    {/* Tipo de tarjeta */}
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <Shield className="w-4 h-4 text-red-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)]">Tipo de Tarjeta</p>
                            <p className="text-[var(--white)] font-medium">{sancion.tipo_tarjeta || 'No especificado'}</p>
                            {sancion.minuto && (
                                <p className="text-xs text-[var(--gray-100)]">Minuto {sancion.minuto}'</p>
                            )}
                        </div>
                    </div>

                    {/* Artículo */}
                    {sancion.art && (
                        <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                            <Gavel className="w-4 h-4 text-[var(--yellow)] mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[var(--gray-100)]">Artículo</p>
                                <p className="text-[var(--white)] font-medium">{sancion.art}</p>
                            </div>
                        </div>
                    )}

                    {/* Multa */}
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <Hash className="w-4 h-4 text-[var(--orange)] mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)]">Multa / Apelación</p>
                            <p className="text-[var(--white)] font-medium text-sm">
                                {sancion.multa === 'S' ? 'Con multa' : 'Sin multa'} • {sancion.apelacion === 'S' ? 'Apelada' : 'Sin apelar'}
                            </p>
                        </div>
                    </div>

                    {/* Fecha de creación */}
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <Clock className="w-4 h-4 text-[var(--gray-100)] mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)]">Fecha de Sanción</p>
                            <p className="text-[var(--white)] font-medium text-sm">
                                {sancion.fecha_creacion ? formatearFechaCorta(sancion.fecha_creacion.toString()) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Partido enfrentamiento - Solo si existe */}
                {sancion.partido?.equipoLocal && sancion.partido?.equipoVisita && (
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <Shield className="w-4 h-4 text-[var(--blue)] mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)]">Enfrentamiento</p>
                            <p className="text-[var(--white)] font-medium text-sm">
                                {sancion.partido.equipoLocal.nombre} vs {sancion.partido.equipoVisita.nombre}
                            </p>
                        </div>
                    </div>
                )}

                {/* Motivo - Solo si existe */}
                {sancion.motivo && (
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <FileText className="w-4 h-4 text-[var(--green)] mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)] mb-1">Motivo</p>
                            <p className="text-[var(--white)] text-sm">{sancion.motivo}</p>
                        </div>
                    </div>
                )}

                {/* Descripción - Solo si existe */}
                {sancion.descripcion && (
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <FileText className="w-4 h-4 text-[var(--blue)] mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)] mb-1">Descripción</p>
                            <p className="text-[var(--white)] text-sm">{sancion.descripcion}</p>
                        </div>
                    </div>
                )}

                {/* Observaciones - Solo si existe */}
                {sancion.observaciones && (
                    <div className="flex items-start gap-3 p-3 bg-[var(--gray-300)] rounded-lg">
                        <FileText className="w-4 h-4 text-[var(--yellow)] mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--gray-100)] mb-1">Observaciones</p>
                            <p className="text-[var(--white)] text-sm">{sancion.observaciones}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer con botón */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                <Button onClick={onClose} variant="default">
                    Cerrar
                </Button>
            </div>
        </BaseModal>
    );
}
