import { FORMACIONES_DISPONIBLES } from '@/app/utils/formacionesDT';

interface DreamTeamFormationSelectorProps {
    formacionActual: string;
    isPublished: boolean;
    onFormationChange: (formacion: string) => void;
}

/**
 * Componente presentacional para seleccionar la formación
 */
export const DreamTeamFormationSelector = ({
    formacionActual,
    isPublished,
    onFormationChange,
}: DreamTeamFormationSelectorProps) => {
    return (
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {Object.entries(FORMACIONES_DISPONIBLES).map(([nombre]) => (
                <button
                    key={nombre}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isPublished
                            ? 'bg-[var(--gray-300)] text-[var(--gray-100)] cursor-not-allowed opacity-50'
                            : formacionActual === nombre
                                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                                : 'bg-[var(--gray-300)] text-[var(--gray-100)] hover:bg-[var(--gray-200)] border border-[var(--gray-200)]'
                    }`}
                    onClick={() => !isPublished && onFormationChange(nombre)}
                    disabled={isPublished}
                >
                    {nombre}
                </button>
            ))}
        </div>
    );
};

