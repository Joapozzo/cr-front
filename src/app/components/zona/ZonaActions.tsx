import { MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import DropdownMenu from '../DropDownMenu';
import DropdownItem from '../DrowDownItem';

interface ZonaActionsProps {
    onEditar: () => void;
    onEliminar: () => void;
    isDeleting: boolean;
}

export const ZonaActions = ({ onEditar, onEliminar, isDeleting }: ZonaActionsProps) => {
    return (
        <DropdownMenu
            trigger={
                <div
                    data-dropdown
                    className={`z-999 p-2 rounded-lg transition-colors ${isDeleting
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-[var(--gray-200)] cursor-pointer'
                        }`}
                >
                    <MoreHorizontal className="w-4 h-4 text-[var(--gray-100)]" />
                </div>
            }
        >
            <DropdownItem onClick={onEditar}>
                <Edit3 className="w-4 h-4 inline mr-2" />
                Editar
            </DropdownItem>
            <DropdownItem onClick={onEliminar} variant="danger">
                {isDeleting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-[var(--color-danger)] border-t-transparent rounded-full animate-spin inline mr-2" />
                        Eliminando...
                    </>
                ) : (
                    <>
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Eliminar
                    </>
                )}
            </DropdownItem>
        </DropdownMenu>
    );
};

