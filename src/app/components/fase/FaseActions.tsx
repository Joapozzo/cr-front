import { MoreHorizontal, Trash2 } from 'lucide-react';
import DropdownMenu from '../DropDownMenu';
import DropdownItem from '../DrowDownItem';

interface FaseActionsProps {
    onEliminar: () => void;
}

export const FaseActions = ({ onEliminar }: FaseActionsProps) => {
    return (
        <DropdownMenu
            trigger={
                <div className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-[var(--gray-100)]" />
                </div>
            }
        >
            <DropdownItem
                onClick={onEliminar}
                variant="danger"
            >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Eliminar
            </DropdownItem>
        </DropdownMenu>
    );
};

