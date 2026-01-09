'use client';

interface ZonaElegible {
    id_zona: number;
    nombre: string;
    cantidad_equipos: number;
    es_impar: boolean;
}

interface PasoSeleccionZonasProps {
    zonasElegibles: ZonaElegible[];
    zonasSeleccionadas: number[];
    loadingZonas: boolean;
    onToggleZona: (id_zona: number) => void;
}

export default function PasoSeleccionZonas({
    zonasElegibles,
    zonasSeleccionadas,
    loadingZonas,
    onToggleZona
}: PasoSeleccionZonasProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[var(--white)] mb-2">
                    Seleccionar zonas (todos contra todos)
                </label>
                {loadingZonas ? (
                    <p className="text-[var(--gray-100)]">Cargando zonas...</p>
                ) : zonasElegibles.length === 0 ? (
                    <p className="text-[var(--color-danger)]">
                        No hay zonas de tipo &quot;todos contra todos&quot; disponibles
                    </p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {zonasElegibles.map((zona) => (
                            <label
                                key={zona.id_zona}
                                className="flex items-center p-3 bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] cursor-pointer hover:border-[var(--color-primary)] transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={zonasSeleccionadas.includes(zona.id_zona)}
                                    onChange={() => onToggleZona(zona.id_zona)}
                                    className="mr-3 w-4 h-4"
                                />
                                <div className="flex-1">
                                    <p className="text-[var(--white)] font-medium">
                                        {zona.nombre}
                                    </p>
                                    <p className="text-sm text-[var(--gray-100)]">
                                        {zona.cantidad_equipos} equipos
                                        {zona.es_impar && (
                                            <span className="ml-2 text-[var(--color-danger)]">
                                                (impar - requiere fecha libre)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

