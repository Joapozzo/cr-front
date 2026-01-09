import { useState } from 'react';
import { FormField, FormModal, useModals, FormDataValue } from '../modals/ModalAdmin';
import { Fase } from '../../types/fase';
import { CrearZonaInput, FormatoPosicion } from '../../types/zonas';
import { crearZonaSchema } from '../../schemas/zona.schema';
import FormatosPosicionStep from '../FormatosPosicionStep';
import { useZonasPorFase, useDatosParaCrearZona } from '../../hooks/useZonas';
import { useZonaActions } from '../../hooks/useZonaActions';
import { useFaseActions } from '../../hooks/useFaseActions';
import { FaseHeader } from './FaseHeader';
import { FaseActions } from './FaseActions';
import ZonaCard from '../zona/ZonaCard';
import { FaseSkeleton } from '../skeletons/FaseSkeleton';

interface FaseSectionProps {
    fase: Fase;
    idCatEdicion: number;
}

const FaseSection = ({ fase, idCatEdicion }: FaseSectionProps) => {
    const { modals, openModal, closeModal } = useModals();
    const [tipoZonaSeleccionado, setTipoZonaSeleccionado] = useState<number | null>(null);
    const [cantidadEquipos, setCantidadEquipos] = useState<number | null>(null);
    const [formatosPosicion, setFormatosPosicion] = useState<FormatoPosicion[]>([]);

    const {
        data: zonas,
        isLoading: loadingZonas,
        error: errorZonas
    } = useZonasPorFase(idCatEdicion, fase.numero_fase);

    const {
        data: datosCrearZona,
        isLoading: loadingDatos
    } = useDatosParaCrearZona();

    const { handleCrearZona } = useZonaActions({
        idCatEdicion,
        numeroFase: fase.numero_fase,
    });

    const { handleEliminarFase } = useFaseActions({ idCatEdicion });

    const handleCrearZonaSubmit = async (data: CrearZonaInput): Promise<void> => {
        await handleCrearZona(data, formatosPosicion);
        setFormatosPosicion([]);
        setCantidadEquipos(null);
        setTipoZonaSeleccionado(null);
        closeModal('create');
    };

    const handleTipoZonaChange = (name: string, value: FormDataValue) => {
        if (name === 'id_tipo_zona') {
            setTipoZonaSeleccionado(value ? Number(value) : null);
        }
        if (name === 'cantidad_equipos') {
            setCantidadEquipos(value ? Number(value) : null);
        }
    };

    const mostrarJornada = tipoZonaSeleccionado !== null && tipoZonaSeleccionado !== 1 && tipoZonaSeleccionado !== 3;

    const zonaFields: FormField[] = [
        {
            name: 'nombre',
            label: 'Nombre de la zona',
            type: 'text',
            placeholder: 'Ej: Zona A',
            required: true
        },
        {
            name: 'id_tipo_zona',
            label: 'Tipo de zona',
            type: 'select',
            required: true,
            options: datosCrearZona?.data.tiposZona?.map(tipo => ({
                value: tipo.id,
                label: tipo.nombre
            })) || []
        },
        {
            name: 'cantidad_equipos',
            label: 'Cantidad de equipos',
            type: 'number',
            placeholder: '8',
            required: true
        },
        ...(mostrarJornada ? [{
            name: 'jornada',
            label: 'Número de jornada',
            type: 'number' as const,
            placeholder: '1',
            required: true
        }] : []),
        {
            name: 'id_etapa',
            label: 'Etapa',
            type: 'select',
            required: true,
            options: datosCrearZona?.data.etapas?.map(etapa => ({
                value: etapa.id_etapa,
                label: etapa.nombre
            })) || [],
        },
        {
            name: 'campeon',
            label: '¿La zona tendrá campeón?',
            type: 'switch',
            required: true
        },
    ];

    if (loadingZonas) {
        return <FaseSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <FaseHeader
                    numeroFase={fase.numero_fase}
                    onAgregarZona={() => openModal('create')}
                    loadingDatos={loadingDatos}
                />
                <FaseActions onEliminar={() => handleEliminarFase(fase.numero_fase)} />
            </div>

            <div className="flex flex-wrap gap-4 items-start">
                {errorZonas ? (
                    <div className="w-full text-center py-12 bg-[var(--gray-400)] rounded-lg border border-[var(--color-danger)]">
                        <div className="flex flex-col items-center gap-4">
                            <div>
                                <h3 className="text-[var(--color-danger)] font-medium mb-2">
                                    Error al cargar las zonas
                                </h3>
                                <p className="text-[var(--gray-100)] text-sm">
                                    {errorZonas.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : zonas && zonas.length > 0 ? (
                    zonas.map((zona) => (
                        <div
                            key={zona.id_zona}
                            className={`${zonas.length === 1 ? 'w-full' : 'w-full xl:w-[calc(50%-0.5rem)]'}`}
                        >
                            <ZonaCard zona={zona} />
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-12 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                        <div className="flex flex-col items-center gap-4">
                            <div>
                                <h3 className="text-[var(--white)] font-medium mb-2">
                                    No hay zonas para mostrar
                                </h3>
                                <p className="text-[var(--gray-100)] text-sm max-w-md">
                                    Comienza creando las zonas para esta fase
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <FormModal
                isOpen={modals.create}
                onClose={() => {
                    closeModal('create');
                    setTipoZonaSeleccionado(null);
                    setCantidadEquipos(null);
                    setFormatosPosicion([]);
                }}
                title={`Crear zona - Fase ${fase.numero_fase}`}
                fields={zonaFields}
                onSubmit={handleCrearZonaSubmit}
                type="create"
                validationSchema={crearZonaSchema}
                submitText="Crear zona"
                onFieldChange={handleTipoZonaChange}
                maxWidth="max-w-4xl"
            >
                {tipoZonaSeleccionado !== null &&
                    datosCrearZona?.data.tiposZona?.find(t => t.id === tipoZonaSeleccionado)?.nombre === 'todos-contra-todos' &&
                    cantidadEquipos !== null && cantidadEquipos > 0 && (
                        <div className="mb-6">
                            <FormatosPosicionStep
                                cantidadEquipos={cantidadEquipos}
                                onFormatosChange={setFormatosPosicion}
                            />
                        </div>
                    )}
            </FormModal>

            <div className="border-t border-[var(--gray-300)] my-8"></div>
        </div>
    );
};

export default FaseSection;

