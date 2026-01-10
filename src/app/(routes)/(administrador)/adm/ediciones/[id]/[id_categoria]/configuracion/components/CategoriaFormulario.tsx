/**
 * Formulario de configuración principal
 * Componente contenedor que organiza las secciones
 */
import { CategoriaEdicionConfig } from '../types/configuracion.types';
import SeccionTiempos from './SeccionTiempos';
import SeccionPuntos from './SeccionPuntos';
import SeccionMercado from './SeccionMercado';
import SeccionPersonalizacion from './SeccionPersonalizacion';

interface CategoriaFormularioProps {
    config: CategoriaEdicionConfig;
    onChange: <K extends keyof CategoriaEdicionConfig>(
        field: K,
        value: CategoriaEdicionConfig[K]
    ) => void;
    isLoading?: boolean;
}

export default function CategoriaFormulario({
    config,
    onChange,
    isLoading = false,
}: CategoriaFormularioProps) {
    return (
        <div className="rounded-lg w-[70%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SeccionTiempos
                    tipoFutbol={config.tipo_futbol}
                    duracionTiempo={config.duracion_tiempo}
                    duracionEntretiempo={config.duracion_entretiempo}
                    onChange={onChange}
                />

                <SeccionPuntos
                    puntosVictoria={config.puntos_victoria}
                    puntosEmpate={config.puntos_empate}
                    puntosDerrota={config.puntos_derrota}
                    onChange={onChange}
                />

                <SeccionMercado
                    fechaInicio={config.fecha_inicio_mercado || ''}
                    fechaFin={config.fecha_fin_mercado || ''}
                    limiteCambios={config.limite_cambios}
                    recambio={config.recambio}
                    onChange={onChange}
                />

                <SeccionPersonalizacion
                    color={config.color}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

