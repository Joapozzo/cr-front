import React from 'react';

interface CardComponentProps {
    titulo: string;
    children: React.ReactNode;
    className?: string;
}

export const CardComponent: React.FC<CardComponentProps> = ({
    titulo,
    children,
    className = "",
}) => {
    return (
        <div className="relative py-4 select-none bg-[var(--gray-400)] rounded-[20px] w-full flex flex-col">
            {/* Header con título */}
            <div className="flex items-center justify-center w-full h-fit mb-4 px-8 w-full">
                <span className="text-white font-medium text-start w-full">{titulo}</span>
            </div>

            {/* Línea divisoria */}
            <div className="w-full h-px bg-[var(--gray-300)] mb-4"></div>

            {/* Contenido children */}
            <div className="w-full px-5">{children}</div>
        </div>
    );
};