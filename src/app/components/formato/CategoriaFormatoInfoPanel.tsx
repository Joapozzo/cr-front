export const CategoriaFormatoInfoPanel = () => {
    return (
        <div className="bg-[var(--blue)]/10 border border-[var(--blue)]/20 rounded-lg p-4 mt-8">
            <h3 className="text-[var(--blue)] font-medium mb-2">Información del formato</h3>
            <ul className="text-sm text-[var(--gray-100)] space-y-1">
                <li>• <strong>Todos contra todos:</strong> Cada equipo juega contra todos los demás en la zona</li>
                <li>• <strong>Eliminación directa:</strong> Sistemas de eliminación por partidos únicos</li>
                <li>• Puedes configurar múltiples fases para crear un torneo complejo</li>
                <li>• Las vacantes pueden ser ocupadas por equipos directos o por clasificados de otras zonas</li>
            </ul>
        </div>
    );
};

