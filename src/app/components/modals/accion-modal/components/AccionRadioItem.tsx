import { ActionItem, ActionType } from "../types";

interface AccionRadioItemProps {
    action: ActionItem;
    index: number;
    selectedAction: ActionType | null;
    onSelect: (action: ActionType) => void;
}

export const AccionRadioItem = ({
    action,
    index,
    selectedAction,
    onSelect
}: AccionRadioItemProps) => {
    return (
        <label
            className="flex items-center gap-3 p-3 border border-[#262626] rounded-lg hover:bg-[#171717] transition-colors cursor-pointer animate-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <input
                type="radio"
                name="action"
                value={action.id}
                checked={selectedAction === action.id}
                onChange={(e) =>
                    onSelect(e.target.value as ActionType)
                }
                className={`
                    relative w-5 h-5 cursor-pointer
                    appearance-none rounded-full border-2 border-[#262626] bg-[#171717]
                    transition-colors duration-300 ease-in-out
                    checked:border-[var(--color-primary)]
                    before:content-[''] before:absolute before:inset-1
                    before:rounded-full before:bg-[var(--color-primary)]
                    before:scale-0 before:transition-transform before:duration-300 before:ease-in-out
                    checked:before:scale-100
                `}
            />
            <span className="flex items-center gap-2">
                {action.icon}
                <span className="text-white font-medium">
                    {action.label}
                </span>
            </span>
        </label>
    );
};

