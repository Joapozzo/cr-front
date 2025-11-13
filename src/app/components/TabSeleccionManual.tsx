import { useState } from 'react';
import { useEquiposPorCategoriaEdicion } from '../hooks/useEquipos';
import { useOcuparVacante } from '../hooks/useTemporadas';
import { Button } from './ui/Button';
import Select, { SelectOption } from './ui/Select';
import toast from 'react-hot-toast';

interface TabSeleccionManualProps {
    idEdicion: number;
    idZona: number;
    idCategoriaEdicion: number;
    vacante: number;
    isOcupada: boolean;
    onClose: () => void;
}

const TabSeleccionManual = ({
    idEdicion,
    idZona,
    idCategoriaEdicion,
    vacante,
    isOcupada,
    onClose
}: TabSeleccionManualProps) => {
    const [selectedEquipo, setSelectedEquipo] = useState<number | null>(null);

    const { data: equipos, isLoading } = useEquiposPorCategoriaEdicion(idCategoriaEdicion);
    const { mutate: ocuparVacante, isPending } = useOcuparVacante();

    const equiposOptions: SelectOption[] = equipos?.equipos.map(equipo => ({
        value: equipo.id_equipo,
        label: equipo.nombre,
        image: equipo.img || undefined
    })) || [];

    const handleSubmit = () => {
        if (!selectedEquipo) {
            toast.error('Debe seleccionar un equipo');
            return;
        }

        ocuparVacante({
            id_zona: idZona,
            id_categoria_edicion: idCategoriaEdicion,
            data: {
                id_equipo: selectedEquipo,
                vacante: vacante
            }
        }, {
            onSuccess: () => {
                toast.success('Equipo asignado exitosamente');
                onClose();
            },
            onError: (error) => {
                toast.error(error.message || 'Error al asignar equipo');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[var(--gray-100)]">Cargando equipos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[var(--white)] mb-2">
                    Seleccionar equipo
                </label>
                <Select
                    options={equiposOptions}
                    value={selectedEquipo || ''}
                    onChange={(value) => setSelectedEquipo(Number(value))}
                    placeholder="Selecciona un equipo..."
                    showImages={true}
                    bgColor='bg-[var(--gray-300)]'
                />
            </div>

            <div className="flex gap-3 justify-end">
                <Button
                    variant="more"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancelar
                </Button>
                <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={!selectedEquipo || isPending}
                >
                    {isPending ? 'Asignando...' : isOcupada ? 'Reemplazar' : 'Asignar'}
                </Button>
            </div>
        </div>
    );
};

export default TabSeleccionManual;