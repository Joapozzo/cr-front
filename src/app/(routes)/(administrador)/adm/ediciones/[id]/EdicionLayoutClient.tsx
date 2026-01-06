'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEdicionStore } from '@/app/stores/edicionStore';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useEquiposPorCategoriaEdicion } from '@/app/hooks/useEquipos';
import { useEquiposStore } from '@/app/stores/equiposStore';
import { useEffect } from 'react';
import { EdicionAdmin } from '@/app/types/edicion';
import { CategoriaEdicionDto } from '@/app/types/categoria';

interface EdicionLayoutClientProps {
    edicion: EdicionAdmin | null;
    categoria: CategoriaEdicionDto | null;
    params: {
        id: string;
        id_categoria?: string;
        id_equipo?: string;
    };
    children: React.ReactNode;
}

export const EdicionLayoutClient = ({
    edicion: serverEdicion,
    categoria: serverCategoria,
    params,
    children
}: EdicionLayoutClientProps) => {
    const pathname = usePathname();
    const { edicionId, idCategoria, idEquipo } = {
        edicionId: params.id,
        idCategoria: params.id_categoria,
        idEquipo: params.id_equipo,
    };

    const { edicionSeleccionada, setEdicionSeleccionada } = useEdicionStore();
    const { categoriaSeleccionada, setCategoriaSeleccionada } = useCategoriaStore();
    const { setEquipos } = useEquiposStore();

    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);
    const { data: equiposResponse, isLoading: loadingEquipos } = useEquiposPorCategoriaEdicion(idCategoriaEdicion);

    const isInCategoria = !!idCategoria;
    const isInEquipo = !!idEquipo;

    // Hidratar stores con datos del servidor (solo como cache UX)
    useEffect(() => {
        if (serverEdicion && !edicionSeleccionada) {
            setEdicionSeleccionada({
                id_edicion: serverEdicion.id_edicion,
                nombre: serverEdicion.nombre,
                temporada: serverEdicion.temporada,
                cantidad_eventuales: serverEdicion.cantidad_eventuales,
                partidos_eventuales: serverEdicion.partidos_eventuales,
                apercibimientos: serverEdicion.apercibimientos,
                puntos_descuento: serverEdicion.puntos_descuento,
                img: serverEdicion.img,
            });
        }
    }, [serverEdicion, edicionSeleccionada, setEdicionSeleccionada]);

    useEffect(() => {
        if (serverCategoria && !categoriaSeleccionada) {
            setCategoriaSeleccionada({
                id_edicion: serverCategoria.edicion.id_edicion,
                id_categoria_edicion: serverCategoria.id_categoria_edicion,
                nombre_completo: serverCategoria.categoria.nombre_completo,
                tipo_futbol: serverCategoria.configuracion.tipo_futbol,
                duracion_tiempo: serverCategoria.configuracion.duracion_tiempo,
                duracion_entretiempo: serverCategoria.configuracion.duracion_entretiempo,
                publicada: serverCategoria.configuracion.publicada,
                puntos_victoria: serverCategoria.configuracion.puntos_victoria,
                puntos_empate: serverCategoria.configuracion.puntos_empate,
                puntos_derrota: serverCategoria.configuracion.puntos_derrota,
                limite_cambios: serverCategoria.configuracion.limite_cambios,
                recambio: serverCategoria.configuracion.recambio,
                color: serverCategoria.configuracion.color,
            });
        }
    }, [serverCategoria, categoriaSeleccionada, setCategoriaSeleccionada]);

    // Buscar el equipo actual si estamos en la ruta de un equipo
    const equipoActual = isInEquipo && equiposResponse?.equipos
        ? equiposResponse.equipos.find(eq => eq.id_equipo === Number(idEquipo))
        : null;

    const equiposTotales = equiposResponse?.total || 0;

    // Usar datos del servidor como fuente de verdad, stores solo como cache
    const edicionActual = serverEdicion || (edicionSeleccionada ? {
        id_edicion: edicionSeleccionada.id_edicion,
        nombre: edicionSeleccionada.nombre,
        temporada: edicionSeleccionada.temporada,
    } as EdicionAdmin : null);

    const categoriaActual = serverCategoria || null;

    const edicionTabs = [
        {
            id: 'categorias',
            label: 'Categorías',
            href: `/adm/ediciones/${edicionId}`,
        },
        {
            id: 'configuracion',
            label: 'Configuración',
            href: `/adm/ediciones/${edicionId}/configuracion`,
        },
    ];

    const categoriaTabs = [
        {
            id: 'resumen',
            label: 'Resumen',
            href: `/adm/ediciones/${edicionId}/${idCategoria}/resumen`,
        },
        {
            id: 'formato',
            label: 'Formato',
            href: `/adm/ediciones/${edicionId}/${idCategoria}/formato`,
        },
        {
            id: 'fixture',
            label: 'Fixture / DreamTeam',
            href: `/adm/ediciones/${edicionId}/${idCategoria}/fixture`,
        },
        {
            id: 'estadisticas',
            label: 'Estadísticas',
            href: `/adm/ediciones/${edicionId}/${idCategoria}/estadisticas`,
        },
        {
            id: 'equipos',
            label: 'Equipos (' + equiposTotales + ')',
            href: `/adm/ediciones/${edicionId}/${idCategoria}/equipos`,
        },
        {
            id: 'configuracion',
            label: 'Configuración',
            href: `/adm/ediciones/${edicionId}/${idCategoria}/configuracion`,
        },
    ];

    const tabs = isInCategoria ? categoriaTabs : edicionTabs;

    const isActiveTab = (href: string) => {
        if (href === `/adm/ediciones/${edicionId}`) {
            return pathname === href;
        }
        return pathname === href;
    };

    useEffect(() => {
        if (categoriaSeleccionada && equiposResponse && !loadingEquipos) {
            setEquipos(equiposResponse.equipos);
        }
    }, [categoriaSeleccionada, equiposResponse, loadingEquipos, setEquipos]);

    useEffect(() => {
        if (!categoriaSeleccionada) {
            setEquipos([]);
        }
    }, [categoriaSeleccionada, setEquipos]);

    if (!isInCategoria && !edicionActual) {
        return <div>Selecciona una edición o categoría</div>
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb dinámico */}
            <div className="flex items-center space-x-2">
                <Link
                    href="/adm/ediciones"
                    className="flex items-center text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Ediciones
                </Link>
                <span className="text-[var(--gray-100)]">/</span>

                {isInCategoria ? (
                    <>
                        <Link
                            href={`/adm/ediciones/${edicionId}`}
                            className="text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
                        >
                            {edicionActual?.nombre} - {edicionActual?.temporada}
                        </Link>
                        <span className="text-[var(--gray-100)]">/</span>
                        {isInEquipo ? (
                            <>
                                <Link
                                    href={`/adm/ediciones/${edicionId}/${idCategoria}/equipos`}
                                    className="text-[var(--green)] hover:text-[var(--green-win)] transition-colors"
                                >
                                    {categoriaActual?.categoria.nombre_completo || categoriaSeleccionada?.nombre_completo}
                                </Link>
                                <span className="text-[var(--gray-100)]">/</span>
                                <span className="text-[var(--white)]">{equipoActual?.nombre || 'Equipo'}</span>
                            </>
                        ) : (
                            <span className="text-[var(--white)]">
                                {categoriaActual?.categoria.nombre_completo || categoriaSeleccionada?.nombre_completo}
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-[var(--white)]">
                        {edicionActual?.nombre} - {edicionActual?.temporada}
                    </span>
                )}
            </div>

            {/* Tabs dinámicos */}
            <div className="border-b border-[var(--gray-300)]">
                <nav className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={`
                                py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                                ${isActiveTab(tab.href)
                                    ? 'border-[var(--green)] text-[var(--green)]'
                                    : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                                }
                            `}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div>
                {children}
            </div>
        </div>
    );
};

