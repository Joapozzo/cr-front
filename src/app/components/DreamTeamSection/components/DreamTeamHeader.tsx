import { Button } from '../../ui/Button';

interface DreamTeamHeaderProps {
    categoriaNombre?: string;
    isPublished: boolean;
    isPublicando: boolean;
    isVaciando: boolean;
    onPublicar: () => void;
    onVaciar: () => void;
}

/**
 * Componente presentacional para el header con acciones
 */
export const DreamTeamHeader = ({
    categoriaNombre,
    isPublished,
    isPublicando,
    isVaciando,
    onPublicar,
    onVaciar,
}: DreamTeamHeaderProps) => {
    return (
        <div className="mb-4 flex items-center justify-between">
            <div>
                <p className="text-[var(--gray-100)] text-sm mt-1">
                    {categoriaNombre || 'Categoría no seleccionada'}
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="success" size="sm" onClick={onPublicar} disabled={isPublicando || isPublished}>
                    {isPublicando ? 'Publicando...' : isPublished ? 'Publicado' : 'Publicar'}
                </Button>
                <Button variant="danger" size="sm" onClick={onVaciar} disabled={isPublished || isVaciando}>
                    {isVaciando ? 'Vaciando...' : 'Vaciar formación'}
                </Button>
            </div>
        </div>
    );
};

