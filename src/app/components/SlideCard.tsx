"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";

interface SlideCardProps {
    items: any[];
    icon: ReactNode;
    title: string;
    autoSlideInterval?: number;
    renderItem: (item: any, index: number) => ReactNode;
    className?: string;
}

const SlideCard: React.FC<SlideCardProps> = ({
    items = [],
    icon,
    title,
    autoSlideInterval = 6000,
    renderItem,
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide para múltiples items
    useEffect(() => {
        if (items.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % items.length);
            }, autoSlideInterval);

            return () => clearInterval(interval);
        }
    }, [currentIndex, items.length, autoSlideInterval]);

    const handleIndexChange = (newIndex: number) => {
        setCurrentIndex(newIndex);
    };

    if (items.length === 0) {
        return (
            <div className={`bg-[var(--black-950)] rounded-2xl overflow-hidden border border-[var(--black-700)] ${className}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-900)]">
                    <div className="flex items-center gap-2 text-sm">
                        {icon}
                        <span className="text-white font-bold">{title}</span>
                    </div>
                </div>

                {/* Empty state */}
                <div className="px-6 py-8 text-center">
                    <p className="text-[var(--black-400)] text-sm">
                        Aún no tienes {title.toLowerCase()}
                    </p>
                </div>
            </div>
        );
    }

    const hasMultipleItems = items.length > 1;

    return (
        <div className={`bg-[var(--black-950)] rounded-2xl overflow-hidden border border-[var(--black-700)] ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-900)]">
                <div className="flex items-center gap-2 text-sm">
                    {icon}
                    <span className="text-white font-bold">{title}</span>
                    {hasMultipleItems && (
                        <span className="text-[var(--black-400)]">
                            | {currentIndex + 1} de {items.length}
                        </span>
                    )}
                </div>

                {hasMultipleItems && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleIndexChange(
                                currentIndex === 0
                                    ? items.length - 1
                                    : currentIndex - 1
                            )}
                            className="p-1.5 text-[var(--black-500)] hover:text-[var(--black-300)] hover:bg-[var(--black-800)] rounded transition-all duration-200"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Indicadores de progreso */}
                        <div className="flex gap-1">
                            {items.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleIndexChange(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-orange-400 w-4'
                                        : 'bg-[var(--black-700)] hover:bg-[var(--black-600)]'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => handleIndexChange(
                                currentIndex === items.length - 1
                                    ? 0
                                    : currentIndex + 1
                            )}
                            className="p-1.5 text-[var(--black-500)] hover:text-[var(--black-300)] hover:bg-[var(--black-800)] rounded transition-all duration-200"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-6 py-4 relative overflow-hidden">
                {renderItem(items[currentIndex], currentIndex)}

                {/* Progress bar para auto-slide */}
                {hasMultipleItems && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--black-800)]">
                        <div
                            className="h-full bg-orange-400 transition-all duration-75 ease-linear"
                            style={{
                                width: '0%',
                                animation: `progress ${autoSlideInterval}ms linear infinite`
                            }}
                        ></div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default SlideCard;