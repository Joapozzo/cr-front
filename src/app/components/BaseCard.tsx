interface BaseCardProps {
    children: React.ReactNode;
    className?: string;
}

interface CardHeaderProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({ children, className = "" }) => {
    return (
        <div className={`bg-[var(--black-900)] rounded-2xl overflow-hidden border border-[#262626] ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ icon, title, subtitle, actions }) => {
    return (
        <div className={`flex items-center px-6 py-4 bg-[var(--black-800)] ${actions ? 'justify-between' : 'justify-center'}`}>
            <div className="flex items-center gap-2 text-sm">
                {icon}
                <span className="text-white font-bold">{title}</span>
                {subtitle && (
                    <span className="text-[#737373]">| {subtitle}</span>
                )}
            </div>
            {actions && actions}
        </div>
    );
};