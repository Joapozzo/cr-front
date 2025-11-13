'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEdicionStore } from '@/app/stores/edicionStore';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { useEquiposPorCategoriaEdicion } from '@/app/hooks/useEquipos';
import { useEquiposStore } from '@/app/stores/equiposStore';
import { useEffect } from 'react';

export default function EdicionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const pathname = usePathname();
    const edicionId = params.id as string;
    const idCategoria = params.id_categoria as string;

    const { edicionSeleccionada, isEdicionSelected } = useEdicionStore();
    const { categoriaSeleccionada, isCategoriaSelected } = useCategoriaStore();
    const { setEquipos, equipos } = useEquiposStore()

    const idCategoriaEdicion = Number(categoriaSeleccionada?.id_categoria_edicion);

    const { data: equiposResponse, isLoading: loadingEquipos } = useEquiposPorCategoriaEdicion(idCategoriaEdicion);

    const isInCategoria = !!idCategoria;

    const equiposTotales = equiposResponse?.total || 0;

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
        if (edicionSeleccionada && categoriaSeleccionada && equiposResponse && !loadingEquipos) {
            setEquipos(equiposResponse.equipos);
        }
    }, [edicionSeleccionada, categoriaSeleccionada, equiposResponse, loadingEquipos, setEquipos]);

    useEffect(() => {
        if (!edicionSeleccionada || !categoriaSeleccionada) {
            setEquipos([]);
        }
    }, [edicionSeleccionada, categoriaSeleccionada, setEquipos]);

    if (!isInCategoria && !isEdicionSelected) {
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
                            {edicionSeleccionada?.nombre} - {edicionSeleccionada?.temporada}
                        </Link>
                        <span className="text-[var(--gray-100)]">/</span>
                        <span className="text-[var(--white)]">{categoriaSeleccionada?.nombre_completo}</span>
                    </>
                ) : (
                    <span className="text-[var(--white)]">{edicionSeleccionada?.nombre} - {edicionSeleccionada?.temporada}</span>
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
}