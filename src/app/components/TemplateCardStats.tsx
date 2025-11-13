import React from 'react';

interface StatsCardTemplateProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    accentColor?: string;
}

const StatsCardTemplate: React.FC<StatsCardTemplateProps> = ({
    title,
    icon,
    children,
    accentColor = 'var(--green)'
}) => {
    return (
        <div className="bg-[var(--black)] border border-[var(--gray-300)] rounded-lg p-4 md:p-5 hover:border-[var(--green)] transition-all duration-300">
            {/* Header con título e icono */}
            <div className="flex items-center space-x-2 mb-4">
                {/* <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}20` }}
                >
                    <div style={{ color: accentColor }}>
                        {icon}
                    </div>
                </div> */}
                <h3 className="text-sm font-bold text-[var(--gray-100)] uppercase">
                    {title}
                </h3>
            </div>

            {/* Contenido de la card */}
            <div className="flex items-center justify-between">
                {children}
            </div>
        </div>
    );
};

export default StatsCardTemplate;