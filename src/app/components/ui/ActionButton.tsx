'use client';

import { ReactNode } from 'react';
import { Button } from './Button';
import { ButtonProps } from './Button';
import Link from 'next/link';

interface ActionButtonProps extends Omit<ButtonProps, 'children'> {
    icon?: ReactNode;
    children: ReactNode;
    href?: string;
}

/**
 * Botón de acción estilizado para barras de filtros
 * Mantiene tamaño y estilo consistente (sm, secondary por defecto)
 */
export function ActionButton({ 
    icon, 
    children, 
    href,
    variant = 'secondary',
    size = 'sm',
    className = '',
    ...props 
}: ActionButtonProps) {
    const buttonContent = (
        <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </>
    );

    const buttonProps = {
        variant,
        size,
        className: `flex items-center justify-center h-9 ${className}`,
        ...props
    };

    if (href) {
        return (
            <Link href={href}>
                <Button {...buttonProps}>
                    {buttonContent}
                </Button>
            </Link>
        );
    }

    return (
        <Button {...buttonProps}>
            {buttonContent}
        </Button>
    );
}

