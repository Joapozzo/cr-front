import { ActionItem, ActionType } from "../types";
import { AccionRadioItem } from "./AccionRadioItem";

interface AccionListProps {
    actions: readonly ActionItem[];
    selectedAction: ActionType | null;
    onSelect: (action: ActionType) => void;
}

export const AccionList = ({
    actions,
    selectedAction,
    onSelect
}: AccionListProps) => {
    return (
        <div className="space-y-3">
            {actions.map((action, index) => (
                <AccionRadioItem
                    key={action.id}
                    action={action}
                    index={index}
                    selectedAction={selectedAction}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
};

