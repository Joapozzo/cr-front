'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
    content: string;
    children?: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help"
            >
                {children || (
                    <Info size={16} className="text-[var(--gray-100)] hover:text-[var(--green)] transition-colors" />
                )}
            </div>
            {isVisible && (
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-[var(--gray-600)] border border-[var(--gray-300)] rounded-lg shadow-lg text-xs text-[var(--white)]">
                    {content}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="w-2 h-2 bg-[var(--gray-600)] border-r border-b border-[var(--gray-300)] transform rotate-45"></div>
                    </div>
                </div>
            )}
        </div>
    );
}

