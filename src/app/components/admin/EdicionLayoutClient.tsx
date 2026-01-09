'use client';

import { usePathname, useParams as useNextParams } from 'next/navigation';
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
    const nextParams = useNextParams();
    
    // Usar params del layout si están disponibles, sino usar useParams como fallback
    const { edicionId, idCategoria, idEquipo } = {
        edicionId: params.id || (nextParams?.id as string) || '',
        idCategoria: params.id_categoria || (nextParams?.id_categoria as string) || undefined,
        idEquipo: params.id_equipo || (nextParams?.id_equipo as string) || undefined,
    };

    const { edicionSeleccionada, setEdicionSeleccionada } = useEdicionStore();
    const { categoriaSeleccionada, setCategoriaSeleccionada } = useCategoriaStore();
    const { setEquipos } = useEquiposStore();

    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);
    const { data: equiposResponse, isLoading: loadingEquipos } = useEquiposPorCategoriaEdicion(idCategoriaEdicion);

    // Detectar si estamos en una ruta de categoría usando idCategoria o el pathname como fallback
    // El pathname para categorías es: /adm/ediciones/[id]/[id_categoria]/[page]
    const pathSegments = pathname.split('/').filter(Boolean);
    const isInCategoriaPath = pathSegments.length >= 4 && pathSegments[0] === 'adm' && pathSegments[1] === 'ediciones' && pathSegments.length >= 4;
    const isInCategoria = !!idCategoria || isInCategoriaPath;
    const isInEquipo = !!idEquipo || (pathname.includes('/equipos/') && pathSegments.length >= 6);
    
    // Si estamos en una ruta de categoría pero no tenemos idCategoria de params, intentar obtenerlo del pathname
    const idCategoriaFromPath = isInCategoriaPath && !idCategoria 
        ? pathSegments[3] // /adm/ediciones/[id]/[id_categoria]/...
        : idCategoria;

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
        // Actualizar el store cuando hay serverCategoria y no coincide con el store actual
        // o cuando no hay categoriaSeleccionada en el store
        if (serverCategoria) {
            const shouldUpdate = !categoriaSeleccionada || 
                categoriaSeleccionada.id_categoria_edicion !== serverCategoria.id_categoria_edicion;
            
            if (shouldUpdate) {
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
            href: `/adm/ediciones/${edicionId}/${idCategoriaFromPath || idCategoria}/resumen`,
        },
        {
            id: 'formato',
            label: 'Formato',
            href: `/adm/ediciones/${edicionId}/${idCategoriaFromPath || idCategoria}/formato`,
        },
        {
            id: 'fixture',
            label: 'Fixture / DreamTeam',
            href: `/adm/ediciones/${edicionId}/${idCategoriaFromPath || idCategoria}/fixture`,
        },
        {
            id: 'estadisticas',
            label: 'Estadísticas',
            href: `/adm/ediciones/${edicionId}/${idCategoriaFromPath || idCategoria}/estadisticas`,
        },
        {
            id: 'equipos',
            label: 'Equipos (' + equiposTotales + ')',
            href: `/adm/ediciones/${edicionId}/${idCategoriaFromPath || idCategoria}/equipos`,
        },
        {
            id: 'configuracion',
            label: 'Configuración',
            href: `/adm/ediciones/${edicionId}/${idCategoriaFromPath || idCategoria}/configuracion`,
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

    // Si no hay edición y no estamos en una categoría, mostrar mensaje
    if (!isInCategoria && !edicionActual) {
        return <div>Selecciona una edición o categoría</div>
    }

    // Debug: verificar valores (remover en producción si es necesario)
    // console.log('EdicionLayoutClient Debug:', { isInCategoria, idCategoria, edicionId, pathname, categoriaActual, categoriaSeleccionada });

    return (
        <div className="space-y-6">
            {/* Breadcrumb dinámico - SIEMPRE visible cuando hay edición o categoría */}
            <div className="flex items-center space-x-2 text-sm mb-4">
                <Link
                    href="/adm/ediciones"
                    className="flex items-center text-[var(--gray-100)] hover:text-[var(--white)] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Ediciones
                </Link>
                <span className="text-[var(--gray-100)]">/</span>

                {isInCategoria ? (
                    <>
                        <Link
                            href={`/adm/ediciones/${edicionId}`}
                            className="text-[var(--gray-100)] hover:text-[var(--white)] transition-colors"
                        >
                            {edicionActual?.nombre} - {edicionActual?.temporada}
                        </Link>
                        <span className="text-[var(--gray-100)]">/</span>
                        {isInEquipo ? (
                            <>
                        <Link
                            href={`/adm/ediciones/${edicionId}/${idCategoriaFromPath || idCategoria}/equipos`}
                            className="text-[var(--gray-100)] hover:text-[var(--white)] transition-colors"
                        >
                            {categoriaActual?.categoria.nombre_completo || categoriaSeleccionada?.nombre_completo}
                        </Link>
                                <span className="text-[var(--gray-100)]">/</span>
                                <span className="text-[var(--color-primary)] font-medium">{equipoActual?.nombre || 'Equipo'}</span>
                            </>
                        ) : (
                            <>
                                <span className="text-[var(--color-primary)] font-medium">
                                    {categoriaActual?.categoria.nombre_completo || categoriaSeleccionada?.nombre_completo || 'Categoría'}
                                </span>
                                {/* Mostrar nombre de la página actual si no estamos en resumen */}
                                {!pathname.endsWith('/resumen') && (
                                    <>
                                        <span className="text-[var(--gray-100)]">/</span>
                                        <span className="text-[var(--color-primary)] font-medium">
                                            {pathname.includes('/formato') ? 'Formato' :
                                             pathname.includes('/fixture') ? 'Fixture / DreamTeam' :
                                             pathname.includes('/estadisticas') ? 'Estadísticas' :
                                             pathname.includes('/equipos') && !pathname.includes('/equipos/') ? 'Equipos' :
                                             pathname.includes('/equipos/') ? 'Equipo' :
                                             pathname.includes('/configuracion') ? 'Configuración' : ''}
                                        </span>
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <span className="text-[var(--color-primary)] font-medium">
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
                                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
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

