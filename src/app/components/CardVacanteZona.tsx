import { MoreHorizontal, Shield } from "lucide-react";
import { Equipo } from "../types/equipo";
import DropdownMenu from "./DropDownMenu";
import DropdownItem from "./DrowDownItem";
import ModalSeleccionarEquipo from "./modals/ModalSeleccionarEquipo";
import { DeleteModal, useModals } from "./modals/ModalAdmin";
import { useLiberarVacante } from "../hooks/useTemporadas";
import { useEdicionStore } from "../stores/edicionStore";
import toast from "react-hot-toast";
import { PartidoZona } from "../types/partido";
import { InfoVacante } from "../types/temporada";

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
    const { mutate: liberarVacante } = useLiberarVacante();
    const { edicionSeleccionada } = useEdicionStore();

    // Determinar si hay un equipo asignado
    const equipoAsignado = equipo || (temporada && 'equipo' in temporada ? temporada.equipo as Equipo | null : null);
    const tieneEquipo = equipoAsignado !== null && equipoAsignado !== undefined;

    // Construir vacanteInfo: usar info_vacante si existe, sino construir desde el equipo
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

    const handleVaciarVacante = async () => {
        const toastId = toast.loading("Vaciando vacante...");

        try {
            await new Promise<void>((resolve, reject) => {
                liberarVacante({
                    id_zona: idZona,
                    id_categoria_edicion: idCategoriaEdicion,
                    data: {
                        vacante: vacante
                    }
                }, {
                    onSuccess: () => {
                        toast.success(`Vacante ${vacante} liberada exitosamente`, { id: toastId });
                        closeModal('delete');
                        resolve();
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Error al vaciar vacante', { id: toastId });
                        reject(error);
                    }
                });
            });
        } catch {
            // Error ya manejado en onError
        }
    };

    const handleClickCard = () => {
        if (!isOcupada) {
            openModal('create');
        }
    };

    const handleReemplazarEquipo = () => {
        openModal('edit');
    };

    const handleVaciarConfirm = () => {
        openModal('delete');
    };


    return (
        <>
            <div
                className={`relative p-4 rounded-lg transition-colors group border hover:opacity-50 ${vacanteInfo.tipo === 'equipo_directo'
                        ? 'cursor-pointer'
                        : vacanteInfo.tipo === 'automatizacion_posicion' || vacanteInfo.tipo === 'automatizacion_partido'
                            ? 'cursor-pointer'
                            : 'cursor-pointer'
                    }`}
                style={{
                    borderColor:
                        vacanteInfo.tipo === 'equipo_directo'
                            ? 'var(--green)'
                            : vacanteInfo.tipo === 'automatizacion_posicion' || vacanteInfo.tipo === 'automatizacion_partido'
                                ? 'var(--yellow)'
                                : 'var(--gray-300)',
                    backgroundColor:
                        vacanteInfo.tipo === 'equipo_directo'
                            ? 'rgba( var(--green-rgb), 0.05 )'
                            : vacanteInfo.tipo === 'automatizacion_posicion' || vacanteInfo.tipo === 'automatizacion_partido'
                                ? 'rgba( var(--yellow-rgb), 0.05 )'
                                : 'transparent',
                }}
                onClick={handleClickCard}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        {isOcupada ? (
                            <>
                                <div className={`text-xs font-medium mb-1 ${vacanteInfo.tipo === 'equipo_directo'
                                    ? 'text-[var(--green)]'
                                    : 'text-[var(--yellow)]'
                                    }`}>
                                    {nomenclatura
                                        ? (vacanteInfo.tipo === 'automatizacion_posicion'
                                            ? `POSICIÓN ${nomenclatura}`
                                            : `VACANTE ${nomenclatura}`)
                                        : (vacanteInfo.tipo === 'automatizacion_posicion'
                                            ? `POSICIÓN ${vacante}`
                                            : `VACANTE ${vacante}`)
                                    }
                                </div>

                                {/* ✅ Label principal del backend */}
                                <div className="flex items-center gap-2">
                                    {vacanteInfo.tipo === 'equipo_directo' && (
                                        <div className="w-6 h-6 bg-[var(--gray-200)] rounded-full flex items-center justify-center">
                                            <Shield className="w-3 h-3 text-[var(--gray-100)]" />
                                        </div>
                                    )}
                                    <span className={`text-sm text-[var(--white)] font-medium ${vacanteInfo.tipo === 'equipo_directo'
                                        ? 'text-[var(--gray-100)]'
                                        : 'text-[var(--yellow)]'
                                        }`}>
                                        {vacanteInfo.label}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-xs text-[var(--gray-100)] mb-1">
                                    {nomenclatura ? `${nomenclatura}` : `Vacante ${vacante}`}
                                </div>
                                <div className="text-sm text-[var(--blue)] hover:text-[var(--blue)]/80">
                                    {vacanteInfo.label}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isOcupada && (
                            <DropdownMenu
                                trigger={
                                    <div className="p-1 hover:bg-[var(--gray-200)] rounded transition-colors z-10">
                                        <MoreHorizontal className="w-3 h-3 text-[var(--gray-100)]" />
                                    </div>
                                }
                            >
                                <DropdownItem onClick={handleReemplazarEquipo}>
                                    Reemplazar {vacanteInfo.tipo === 'equipo_directo' ? 'equipo' : 'configuración'}
                                </DropdownItem>
                                <DropdownItem onClick={handleVaciarConfirm} variant="danger">
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
                onConfirm={handleVaciarVacante}
                error={null}
            />
        </>
    );
};

export default CardVacanteZona;