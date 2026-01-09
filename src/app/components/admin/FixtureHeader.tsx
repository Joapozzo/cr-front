interface FixtureHeaderProps {
    categoriaNombre?: string;
}

/**
 * Componente para el header de la página de Fixture/DreamTeam
 */
export const FixtureHeader = ({ categoriaNombre }: FixtureHeaderProps) => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                Fixture / DreamTeam - {categoriaNombre || 'Categoría no seleccionada'}
            </h1>
            <p className="text-[var(--gray-100)]">
                Gestiona los partidos y arma el equipo ideal de cada fecha
            </p>
        </div>
    );
};

