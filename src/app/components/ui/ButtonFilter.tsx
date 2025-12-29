interface ButtonFilterProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export const ButtonFilter: React.FC<ButtonFilterProps> = ({
    isActive,
    onClick,
    children,
}) => {
    return (
        <button
            onClick={onClick}
            className={`
        px-4 py-2 flex justify-center items-center gap-2.5 rounded-full w-full
        font-semibold text-sm border-none cursor-pointer transition-all duration-100 ease-in-out
        ${isActive
                    ? "bg-[var(--gray-100)] text-[var(--gray-950)]"
                    : "bg-[var(--gray-300)] text-white hover:bg-[var(--gray-200)]"
                }
        max-[500px]:text-xs max-[400px]:text-xs max-[400px]:px-2.5 max-[400px]:py-1.5
      `}
        >
            {children}
        </button>
    );
};