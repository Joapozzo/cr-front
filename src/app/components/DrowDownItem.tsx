const DropdownItem = ({
    children,
    onClick,
    variant = 'default'
}: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
}) => {
    const variants = {
        default: 'text-[var(--white)] hover:bg-[var(--gray-300)]',
        danger: 'text-red-400 hover:bg-red-900/20',
    };

    return (
        <button
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${variants[variant]}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default DropdownItem;