'use client';

import { ConfiguracionPrecio, TipoConcepto } from '@/app/services/configuracionPrecio.services';
import { Edit, Trash2, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface TablaPreciosGlobalesProps {
    precios: ConfiguracionPrecio[];
    onEditar: (precio: ConfiguracionPrecio) => void;
    onEliminar: (id_config: number) => void;
    formatPrecio: (precio: number) => string;
    getIconoTipo: (tipo: TipoConcepto) => React.ReactNode;
}

export default function TablaPreciosGlobales({
    precios,
    onEditar,
    onEliminar,
    formatPrecio,
    getIconoTipo
}: TablaPreciosGlobalesProps) {
    if (precios.length === 0) {
        return null;
    }

    return (
        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
                Precios globales (Aplican a todas las categorías)
            </h2>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--gray-300)]">
                            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gray-100)]">
                                Concepto
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gray-100)]">
                                Unidad
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gray-100)]">
                                Monto
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--gray-100)]">
                                Vigencia
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-[var(--gray-100)]">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {precios.map((precio) => (
                            <tr 
                                key={precio.id_config}
                                className="border-b border-[var(--gray-300)] hover:bg-[var(--black-950)] transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="text-[var(--color-primary)]">
                                            {getIconoTipo(precio.tipo_concepto)}
                                        </div>
                                        <span className="text-white font-medium">
                                            {precio.tipo_concepto}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-[var(--gray-100)]">
                                    {precio.unidad.replace('_', ' ')}
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-[var(--color-primary)] font-bold">
                                        {formatPrecio(precio.monto)}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2 text-sm text-[var(--gray-100)]">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(precio.fecha_desde).toLocaleDateString('es-AR')}
                                            {precio.fecha_hasta && 
                                                ` - ${new Date(precio.fecha_hasta).toLocaleDateString('es-AR')}`
                                            }
                                        </span>
                                        {precio.activo && (
                                            <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Vigente
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="import"
                                            size="sm"
                                            onClick={() => onEditar(precio)}
                                            className="p-2"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        {precio.activo && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEliminar(precio.id_config)}
                                                className="p-2 text-[var(--gray-100)] hover:text-red-400"
                                                title="Desactivar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


