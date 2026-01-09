import { MoreHorizontal } from "lucide-react";
import { Equipo } from "../../types/equipo";
import DropdownMenu from "../DropDownMenu";
import DropdownItem from "../DrowDownItem";
import ModalSeleccionarEquipo from "../modals/ModalSeleccionarEquipo";
import { DeleteModal, useModals } from "../modals/ModalAdmin";
import { useVacanteZonaActions } from "../../hooks/useVacanteZonaActions";
import { useEdicionStore } from "../../stores/edicionStore";
import { PartidoZona } from "../../types/partido";
import { InfoVacante } from "../../types/temporada";
import { VacanteInfo } from "./VacanteInfo";

interface CardVacanteZonaProps {
    equipo: Equipo | null;
    vacante: number;
    idZona: number;
    idCategoriaEdicion: number;
    nomenclatura?: string;
    temporada?: {
        info_vacante?: InfoVacante;
        [key: string]: unknown;
    };
    esEliminacionDirecta?: boolean;
    numeroFaseActual?: number;
    partido?: PartidoZona;
}

const CardVacanteZona = ({
    equipo,
    vacante,
    idZona,
    idCategoriaEdicion,
    nomenclatura,
    temporada,
    esEliminacionDirecta,
    numeroFaseActual,
    partido
}: CardVacanteZonaProps) => {
    const { modals, openModal, closeModal } = useModals();
    const { handleVaciarVacante } = useVacanteZonaActions();
    const { edicionSeleccionada } = useEdicionStore();

    // Determinar si hay un equipo asignado
    const equipoAsignado = equipo || (temporada && 'equipo' in temporada ? temporada.equipo as Equipo | null : null);
    const tieneEquipo = equipoAsignado !== null && equipoAsignado !== undefined;

    // Construir vacanteInfo
    const vacanteInfo = temporada?.info_vacante || (tieneEquipo && equipoAsignado ? {
        isOcupada: true,
        label: equipoAsignado.nombre || 'Equipo asignado',
        tipo: 'equipo_directo' as const,
        detalles: null
    } : {
        isOcupada: false,
        label: 'Seleccionar equipo',
        tipo: 'vacia' as const,
        detalles: null
    });

    const isOcupada = vacanteInfo.isOcupada;
    const idEdicion = edicionSeleccionada?.id_edicion || 0;

    const handleVaciarConfirm = async () => {
        try {
            await handleVaciarVacante(idZona, idCategoriaEdicion, vacante);
            closeModal('delete');
        } catch {
            // Error ya manejado en el hook
        }
    };

    const handleClickCard = () => {
        if (!isOcupada) {
            openModal('create');
        }
    };

    return (
        <>
            <div
                className={`relative p-4 rounded-lg transition-colors group border ${vacanteInfo.tipo === 'equipo_directo'
                    ? 'cursor-pointer'
                    : vacanteInfo.tipo === 'automatizacion_posicion' || vacanteInfo.tipo === 'automatizacion_partido'
                        ? 'cursor-pointer'
                        : 'cursor-pointer'
                    }`}
                style={{
                    borderColor:
                        vacanteInfo.tipo === 'equipo_directo'
                            ? 'var(--color-primary)'
                            : vacanteInfo.tipo === 'automatizacion_posicion' || vacanteInfo.tipo === 'automatizacion_partido'
                                ? 'var(--yellow)'
                                : 'var(--gray-300)',
                    backgroundColor:
                        vacanteInfo.tipo === 'equipo_directo'
                            ? 'rgba( var(--color-primary-rgb), 0.05 )'
                            : vacanteInfo.tipo === 'automatizacion_posicion' || vacanteInfo.tipo === 'automatizacion_partido'
                                ? 'rgba( var(--yellow-rgb), 0.05 )'
                                : 'transparent',
                }}
                onClick={handleClickCard}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 group-hover:opacity-50 transition-opacity">
                        <VacanteInfo
                            vacanteInfo={vacanteInfo}
                            nomenclatura={nomenclatura}
                            vacante={vacante}
                            equipoAsignado={equipoAsignado}
                        />
                    </div>

                    <div className="flex items-center gap-2 opacity-100" onClick={(e) => e.stopPropagation()}>
                        {isOcupada && (
                            <DropdownMenu
                                trigger={
                                    <div className="p-1 hover:bg-[var(--gray-200)] rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                                        <MoreHorizontal className="w-3 h-3 text-[var(--gray-100)]" />
                                    </div>
                                }
                            >
                                <DropdownItem onClick={() => openModal('edit')}>
                                    Reemplazar {vacanteInfo.tipo === 'equipo_directo' ? 'equipo' : 'configuración'}
                                </DropdownItem>
                                <DropdownItem onClick={() => openModal('delete')} variant="danger">
                                    Vaciar vacante
                                </DropdownItem>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>

            <ModalSeleccionarEquipo
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                idEdicion={idEdicion}
                idZona={idZona}
                idCategoriaEdicion={idCategoriaEdicion}
                vacante={vacante}
                isOcupada={false}
                esEliminacionDirecta={esEliminacionDirecta}
                numeroFaseActual={numeroFaseActual}
                idPartido={partido ? partido.id_partido : undefined}
            />

            <ModalSeleccionarEquipo
                isOpen={modals.edit}
                onClose={() => closeModal('edit')}
                idEdicion={idEdicion}
                idZona={idZona}
                idCategoriaEdicion={idCategoriaEdicion}
                vacante={vacante}
                isOcupada={true}
                idPartido={partido ? partido.id_partido : undefined}
            />

            <DeleteModal
                isOpen={modals.delete}
                onClose={() => closeModal('delete')}
                title="Vaciar vacante"
                message={`¿Estás seguro de que quieres vaciar la vacante ${vacante}?`}
                itemName={equipo?.nombre}
                onConfirm={handleVaciarConfirm}
                error={null}
            />
        </>
    );
};

export default CardVacanteZona;

