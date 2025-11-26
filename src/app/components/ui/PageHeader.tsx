import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    children,
    actions
}) => {
    return (
        <div className="flex items-center justify-between bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
            <div>
                <h1 className="text-3xl font-bold text-[var(--white)] mb-1">
                    {title}
                </h1>
                {description && (
                    <p className="text-[var(--gray-100)] text-sm">
                        {description}
                    </p>
                )}
            </div>
            {(actions || children) && (
                <div className="flex items-center gap-3 flex-wrap">
                    {children}
                    {actions}
                </div>
            )}
        </div>
    );
};

