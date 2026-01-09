import { ChevronDown } from 'lucide-react';
import { Zona } from '../../types/zonas';
import { calcularVacantesOcupadas } from '../../utils/vacantesHelpers';
import Campeon from '../Campeon';
import { useEdicionStore } from '../../stores/edicionStore';

interface ZonaHeaderProps {
    zona: Zona;
    isExpanded: boolean;
    onToggle: () => void;
}

const getTipoZonaLabel = (tipo: string | null | undefined): string => {
    if (!tipo) return '';
    const labels: Record<string, string> = {
        'todos-contra-todos': 'Todos contra todos',
        'eliminacion-directa': 'Eliminación directa',
        'eliminacion-directa-ida-vuelta': 'Eliminación directa (Ida y Vuelta)',
    };
    return labels[tipo] || tipo;
};

export const ZonaHeader = ({ zona, isExpanded, onToggle }: ZonaHeaderProps) => {
    const { edicionSeleccionada } = useEdicionStore();
    const vacantesOcupadas = calcularVacantesOcupadas(zona);
    const isCompleto = vacantesOcupadas === zona.cantidad_equipos;

    return (
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onToggle}>
            <ChevronDown
                className={`w-5 h-5 text-[var(--gray-100)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
            <div className="flex-1">
                    <h3 className="text-[var(--white)] font-medium flex items-center gap-2">
                        {zona.nombre}
                        <span
                            className={`px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-md bg-opacity-20 border ${zona.etapa.id_etapa === 1
                                ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                                : zona.etapa.id_etapa === 2
                                    ? 'bg-slate-300/20 border-slate-300 text-slate-200'
                                    : 'bg-white/10 border-white/20 text-white/70'
                                }`}
                        >
                            {zona.etapa.nombre}
                        </span>
                    </h3>

                    <p className="text-sm text-[var(--gray-100)] mt-1">
                        {getTipoZonaLabel(zona.tipoZona?.nombre)}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <span className={`text-sm ${isCompleto ? 'text-[var(--color-primary)]' : 'text-[var(--orange)]'}`}>
                            {vacantesOcupadas} / {zona.cantidad_equipos} vacantes ocupadas
                        </span>
                        {zona.tipoZona?.nombre === 'todos-contra-todos' && (
                            <span className={`text-sm ${zona.terminada === 'S' ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}`}>
                                {zona.terminada === 'S' ? 'Zona terminada' : 'Zona sin terminar'}
                            </span>
                        )}
                    </div>

                    {zona.campeon === 'S' && zona.equipoCampeon && (
                        <div className="mt-3 pt-3 border-t border-[var(--gray-300)]">
                            <Campeon
                                equipo={zona.equipoCampeon}
                                nombreEdicion={edicionSeleccionada?.nombre}
                                size="sm"
                            />
                        </div>
                    )}
            </div>
        </div>
    );
};

