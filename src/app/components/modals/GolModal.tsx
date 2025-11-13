import { useState, useEffect } from "react";
import BaseModal from "./ModalPlanillero";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import Select from "../ui/Select";
import { useDatosCompletosPlanillero } from "@/app/hooks/usePartidoPlanillero";
import { useParams } from "next/navigation";
import { JugadorPlantel } from "@/app/types/partido";

interface GolModalProps {
    isOpen: boolean;
    onClose: () => void;
    jugador: { id: number; nombre: string; apellido: string; dorsal: number | null };
    onSubmit: (data: {
        penal: "S" | "N";
        en_contra: "S" | "N";
        asistencia: "S" | "N";
        id_jugador_asistencia?: number;
    }) => void;
    idEquipo: number;
    onBack?: () => void;
}

const GolModal: React.FC<GolModalProps> = ({
    isOpen,
    onClose,
    jugador,
    onSubmit,
    idEquipo,
    onBack,
}) => {
    const params = useParams<{ id_partido: string }>();
    const idPartido = parseInt(params.id_partido, 10);
    const [tipoGol, setTipoGol] = useState<'normal' | 'penal' | 'en_contra' | null>(null);
    const [tieneAsistencia, setTieneAsistencia] = useState<boolean>(false);
    const [jugadorAsistencia, setJugadorAsistencia] = useState<number | null>(null);

    const obtenerJugadoresDelEquipo = (
        datosPartido: any,
        idEquipo: number,
        jugadorActualId?: number
    ) => {
        if (!datosPartido) return [];

        const todosJugadores = [...datosPartido.plantel_local, ...datosPartido.plantel_visita];

        return todosJugadores.filter((jugador: JugadorPlantel) =>
            jugador.id_equipo === idEquipo &&
            jugador.dorsal &&
            jugador.dorsal > 0 &&
            (jugadorActualId ? jugador.id_jugador !== jugadorActualId : true)
        );
    };

    const { data: datosPartido } = useDatosCompletosPlanillero(idPartido);
    const jugadoresDisponibles = obtenerJugadoresDelEquipo(datosPartido, idEquipo, jugador.id);

    useEffect(() => {
        if (isOpen) {
            setTipoGol(null);
            setTieneAsistencia(false);
            setJugadorAsistencia(null);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            // Resetear después de que se cierra
            setTimeout(() => {
                setTipoGol(null);
                setTieneAsistencia(false);
                setJugadorAsistencia(null);
            }, 200);
        }
    }, [isOpen]);

    // Resetear asistencia cuando se cambia tipo de gol
    useEffect(() => {
        if (tipoGol === 'penal' || tipoGol === 'en_contra') {
            setTieneAsistencia(false);
            setJugadorAsistencia(null);
        }
    }, [tipoGol]);

    const handleSiguiente = () => {
        if (!tipoGol) return;

        // Validar asistencia si está seleccionada Y el tipo de gol lo permite
        if (tieneAsistencia && !jugadorAsistencia && tipoGol === 'normal') return;

        const data = {
            penal: tipoGol === 'penal' ? "S" as const : "N" as const,
            en_contra: tipoGol === 'en_contra' ? "S" as const : "N" as const,
            asistencia: (tieneAsistencia && tipoGol === 'normal') ? "S" as const : "N" as const,
            id_jugador_asistencia: (tieneAsistencia && tipoGol === 'normal') ? jugadorAsistencia! : undefined
        };

        onSubmit(data);
    };

    const handleClose = () => {
        // setTipoGol(null);
        // setTieneAsistencia(false);
        // setJugadorAsistencia(null);
        onClose();
    };

    const handleBack = () => {
        if (onBack) {
            setTipoGol(null);
            setTieneAsistencia(false);
            setJugadorAsistencia(null);
            onBack();
        }
    };

    const tiposGol = [
        { id: 'normal', label: 'Gol Normal' },
        { id: 'penal', label: 'Penal' },
        { id: 'en_contra', label: 'Gol en Contra' }
    ] as const;

    const puedeAgregarAsistencia = tipoGol === 'normal';
    const canContinue = tipoGol && (!tieneAsistencia || !puedeAgregarAsistencia || jugadorAsistencia);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button
                                onClick={handleBack}
                                className="p-1.5 rounded-lg hover:bg-[#262626] transition-colors"
                            >
                                <ArrowLeft size={18} className="text-[#737373]" />
                            </button>
                        )}
                        <span>Registrar Gol</span>
                    </div>
                    {/* Indicador de pasos */}
                    <div className="ml-3 flex items-center gap-2 text-xs text-[#737373]">
                        <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[#262626] border border-[#404040] flex items-center justify-center text-white text-xs">
                                1
                            </div>
                            <span className="hidden sm:inline">Acción</span>
                        </div>
                        <div className="w-4 h-px bg-[#404040]"></div>
                        <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[var(--green)] flex items-center justify-center text-black text-xs font-medium">
                                2
                            </div>
                            <span className="hidden sm:inline">Tipo</span>
                        </div>
                        <div className="w-4 h-px bg-[#404040]"></div>
                        <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#404040] flex items-center justify-center text-[#737373] text-xs">
                                3
                            </div>
                            <span className="hidden sm:inline">Minuto</span>
                        </div>
                    </div>
                </div>
            }
            actions={
                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="default"
                        className="flex items-center gap-2 w-full justify-center"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSiguiente}
                        disabled={!canContinue}
                        variant="success"
                        className="flex items-center gap-2 w-full justify-center"
                    >
                        <Save size={16} />
                        Siguiente
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Información del jugador */}
                <div className="bg-[#171717] border border-[#262626] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-medium">
                                {jugador.apellido.toUpperCase()}, {jugador.nombre}
                            </h3>
                            <p className="text-sm text-[#737373]">
                                Dorsal #{jugador.dorsal}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tipo de gol */}
                <div>
                    <label className="block text-sm font-medium text-[#737373] mb-3">
                        Tipo de gol:
                    </label>
                    <div className="space-y-3">
                        {tiposGol.map((tipo, index) => (
                            <label
                                key={tipo.id}
                                className="flex items-center gap-3 p-3 border border-[#262626] rounded-lg hover:bg-[#171717] transition-colors cursor-pointer animate-in slide-in-from-left-2 duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <input
                                    type="radio"
                                    name="tipoGol"
                                    value={tipo.id}
                                    checked={tipoGol === tipo.id}
                                    onChange={() => setTipoGol(tipo.id)}
                                    className={`
                                        relative w-5 h-5 cursor-pointer
                                        appearance-none rounded-full border-2 border-[#262626] bg-[#171717]
                                        transition-colors duration-300 ease-in-out
                                        checked:border-[var(--green)]
                                        before:content-[''] before:absolute before:inset-1
                                        before:rounded-full before:bg-[var(--green)]
                                        before:scale-0 before:transition-transform before:duration-300 before:ease-in-out
                                        checked:before:scale-100
                                    `}
                                />
                                <span className="text-white font-medium">
                                    {tipo.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {puedeAgregarAsistencia && (
                    <div>
                        <label className="flex items-center gap-3 p-3 border border-[#262626] rounded-lg hover:bg-[#171717] transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                checked={tieneAsistencia}
                                onChange={(e) => {
                                    setTieneAsistencia(e.target.checked);
                                    if (!e.target.checked) {
                                        setJugadorAsistencia(null);
                                    }
                                }}
                                className={`
                                    relative w-5 h-5 cursor-pointer
                                    appearance-none rounded border-2 border-[#262626] bg-[#171717]
                                    transition-colors duration-300 ease-in-out
                                    checked:border-[var(--green)] checked:bg-[var(--green)]
                                    before:content-['✓'] before:absolute before:inset-0
                                    before:text-black before:text-sm before:font-bold
                                    before:flex before:items-center before:justify-center
                                    before:opacity-0 before:transition-opacity before:duration-300
                                    checked:before:opacity-100
                                `}
                            />
                            <span className="text-white font-medium">
                                Tiene asistencia
                            </span>
                        </label>

                        {tieneAsistencia && (
                            <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                                <Select
                                    label="Jugador asistente"
                                    value={jugadorAsistencia || ''}
                                    onChange={(value) => setJugadorAsistencia(Number(value))}
                                    options={[
                                        { value: '', label: 'Seleccionar jugador...' },
                                        ...(jugadoresDisponibles || []).map((jugador: JugadorPlantel) => ({
                                            value: jugador.id_jugador,
                                            label: `#${jugador.dorsal} - ${jugador.apellido.toUpperCase()}, ${jugador.nombre}`
                                        }))
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default GolModal;