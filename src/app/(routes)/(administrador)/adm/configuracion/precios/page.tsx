'use client';

import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { Button } from '@/app/components/ui/Button';
import { 
    usePreciosPorEdicion, 
    usePreciosGlobales,
    useCrearPrecio,
    useEliminarPrecio
} from '@/app/hooks/useConfiguracionPrecios';
import { ConfiguracionPrecio, TipoConcepto, UnidadMedida } from '@/app/services/configuracionPrecio.services';
import { 
    DollarSign, 
    Plus, 
    Edit, 
    Trash2, 
    Loader2, 
    AlertCircle,
    Calendar,
    Copy,
    Upload,
    Download,
    Circle,
    Ticket,
    FileText,
    Trophy,
    Pill,
    Camera,
    Video,
    Wallet,
    User,
    FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import ModalConfigPrecio from '@/app/components/configuracion-precios/ModalConfigPrecio';
import TablaPreciosGlobales from '@/app/components/configuracion-precios/TablaPreciosGlobales';
import TablaPreciosCategoria from '@/app/components/configuracion-precios/TablaPreciosCategoria';

// TODO: Obtener id_edicion desde contexto o props
// Por ahora usar un valor por defecto o selector
export default function ConfiguracionPreciosPage() {
    const [id_edicion, setIdEdicion] = useState<number>(1); // TODO: Obtener de contexto
    const [showModal, setShowModal] = useState(false);
    const [precioEditando, setPrecioEditando] = useState<ConfiguracionPrecio | null>(null);
    const [filtroTipo, setFiltroTipo] = useState<TipoConcepto | undefined>(undefined);
    const [filtroActivo, setFiltroActivo] = useState<boolean | undefined>(true);

    const { data: precios, isLoading, error, refetch } = usePreciosPorEdicion(id_edicion, {
        tipo_concepto: filtroTipo,
        activo: filtroActivo
    });

    const { data: preciosGlobales } = usePreciosGlobales(id_edicion);

    const eliminarPrecio = useEliminarPrecio({
        onSuccess: () => {
            toast.success('Precio desactivado exitosamente');
            refetch();
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al desactivar precio');
        }
    });

    // Separar precios globales y por categoría
    const preciosGlobalesList = precios?.filter(p => p.id_categoria_edicion === null) || [];
    const preciosPorCategoria = precios?.filter(p => p.id_categoria_edicion !== null) || [];

    // Agrupar por categoría
    const preciosAgrupadosPorCategoria = preciosPorCategoria.reduce((acc, precio) => {
        const categoriaId = precio.id_categoria_edicion!;
        if (!acc[categoriaId]) {
            acc[categoriaId] = [];
        }
        acc[categoriaId].push(precio);
        return acc;
    }, {} as Record<number, ConfiguracionPrecio[]>);

    const handleCrearPrecio = () => {
        setPrecioEditando(null);
        setShowModal(true);
    };

    const handleEditarPrecio = (precio: ConfiguracionPrecio) => {
        setPrecioEditando(precio);
        setShowModal(true);
    };

    const handleEliminarPrecio = (id_config: number) => {
        if (confirm('¿Está seguro de desactivar este precio?')) {
            eliminarPrecio.mutate(id_config);
        }
    };

    const formatPrecio = (precio: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(precio);
    };

    const getIconoTipo = (tipo: TipoConcepto): React.ReactNode => {
        const iconos: Record<TipoConcepto, React.ReactNode> = {
            CANCHA: <Circle className="w-5 h-5" />,
            INSCRIPCION: <Ticket className="w-5 h-5" />,
            PLANILLERO: <FileText className="w-5 h-5" />,
            ARBITRO: <Trophy className="w-5 h-5" />,
            MEDICO: <Pill className="w-5 h-5" />,
            FOTOGRAFO: <Camera className="w-5 h-5" />,
            VIDEOGRAFO: <Video className="w-5 h-5" />,
            CAJERO: <Wallet className="w-5 h-5" />,
            ENCARGADO: <User className="w-5 h-5" />,
            OTRO: <FileCheck className="w-5 h-5" />
        };
        return iconos[tipo] || <FileCheck className="w-5 h-5" />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Error al cargar precios: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Configuración de precios"
                description="Gestiona los precios globales y por categoría para la edición actual"
                actions={
                    <div className="flex gap-2">
                        <Button
                            onClick={handleCrearPrecio}
                            variant="secondary"
                            className='flex items-center gap-2 w-full justify-center'
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo precio
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => toast('Funcionalidad próximamente')}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Importar
                        </Button>
                    </div>
                }
            />

            {/* Filtros */}
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-4">
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-white mb-2">
                            Tipo de Concepto
                        </label>
                        <select
                            value={filtroTipo || ''}
                            onChange={(e) => setFiltroTipo(e.target.value as TipoConcepto || undefined)}
                            className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white"
                        >
                            <option value="">Todos</option>
                            <option value="CANCHA">Cancha</option>
                            <option value="INSCRIPCION">Inscripción</option>
                            <option value="PLANILLERO">Planillero</option>
                            <option value="ARBITRO">Árbitro</option>
                            <option value="MEDICO">Médico</option>
                            <option value="FOTOGRAFO">Fotógrafo</option>
                            <option value="VIDEOGRAFO">Videógrafo</option>
                            <option value="CAJERO">Cajero</option>
                            <option value="ENCARGADO">Encargado</option>
                            <option value="OTRO">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Estado
                        </label>
                        <select
                            value={filtroActivo === undefined ? '' : filtroActivo.toString()}
                            onChange={(e) => setFiltroActivo(
                                e.target.value === '' ? undefined : e.target.value === 'true'
                            )}
                            className="w-full px-3 py-2 bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg text-white"
                        >
                            <option value="">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Precios Globales */}
            <TablaPreciosGlobales
                precios={preciosGlobalesList}
                onEditar={handleEditarPrecio}
                onEliminar={handleEliminarPrecio}
                formatPrecio={formatPrecio}
                getIconoTipo={getIconoTipo}
            />

            {/* Precios por Categoría */}
            <TablaPreciosCategoria
                preciosAgrupados={preciosAgrupadosPorCategoria}
                onEditar={handleEditarPrecio}
                onEliminar={handleEliminarPrecio}
                formatPrecio={formatPrecio}
                getIconoTipo={getIconoTipo}
            />

            {/* Modal */}
            {showModal && (
                <ModalConfigPrecio
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setPrecioEditando(null);
                    }}
                    precioEditando={precioEditando}
                    id_edicion={id_edicion}
                    onSuccess={() => {
                        refetch();
                        setShowModal(false);
                        setPrecioEditando(null);
                    }}
                />
            )}
        </div>
    );
}


