import { useState, useRef } from "react";

const DropdownMenu = ({
    trigger,
    children,
    className = ''
}: {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 100);
    };

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="cursor-pointer">{trigger}</div>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg shadow-lg z-20">
                    <div className="py-1">{children}</div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
