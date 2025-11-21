'use client';

import SeccionInterzonales from './SeccionInterzonales';
import SeccionFormatoTorneo from './SeccionFormatoTorneo';
import SeccionFechaLibre from './SeccionFechaLibre';
import SeccionPlanillero from './SeccionPlanillero';
import { GenerarFixtureInput } from '@/app/types/fixture-generator';
import { Usuario } from '@/app/types/user';

interface ZonaElegible {
    id_zona: number;
    nombre: string;
    cantidad_equipos: number;
}

interface PasoConfiguracionProps {
    formData: Partial<GenerarFixtureInput>;
    zonasElegibles: ZonaElegible[];
    planilleros: Usuario[];
    fechaLibreHabilitada: boolean;
    totalFechasFixture: number;
    onFormDataChange: (field: keyof GenerarFixtureInput, value: string | number | boolean | undefined) => void;
}

export default function PasoConfiguracion({
    formData,
    zonasElegibles,
    planilleros,
    fechaLibreHabilitada,
    totalFechasFixture,
    onFormDataChange
}: PasoConfiguracionProps) {
    return (
        <div className="space-y-6">
            <SeccionInterzonales
                incluirInterzonales={formData.incluir_interzonales || false}
                distribucionInterzonales={formData.distribucion_interzonales || 'distribuida'}
                posicionInterzonales={formData.posicion_interzonales}
                zonasSeleccionadas={formData.zonas_seleccionadas || []}
                zonasElegibles={zonasElegibles}
                totalFechasFixture={totalFechasFixture}
                onToggleInterzonales={(checked) => {
                    onFormDataChange('incluir_interzonales', checked);
                }}
                onDistribucionChange={(value) => onFormDataChange('distribucion_interzonales', value)}
                onPosicionChange={(value) => onFormDataChange('posicion_interzonales', value)}
            />

            <SeccionFormatoTorneo
                formatoTorneo={formData.formato_torneo || 'ida'}
                onFormatoChange={(formato) => onFormDataChange('formato_torneo', formato)}
            />

            <SeccionFechaLibre
                permitirFechaLibre={formData.permitir_fecha_libre || false}
                fechaLibreHabilitada={fechaLibreHabilitada}
                incluirInterzonales={formData.incluir_interzonales || false}
                onToggleFechaLibre={(checked) => onFormDataChange('permitir_fecha_libre', checked)}
            />

            <SeccionPlanillero
                autocompletarPlanillero={formData.autocompletar_planillero || false}
                planilleros={planilleros}
                onToggleAutocompletar={(checked) => {
                    onFormDataChange('autocompletar_planillero', checked);
                }}
            />
        </div>
    );
}

