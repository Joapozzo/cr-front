import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    FileText,
} from "lucide-react";
import { BaseCard, CardHeader } from "./BaseCard";
import { PartidoCompleto } from '../types/partido';
import CardPartidosSemanaSkeleton from './skeletons/CardPartidosSemanaSkeleton';
import PartidoItemWeek from './PartidoItemWeek';

interface PartidosSemanaProps {
    partidos?: PartidoCompleto[];
    isLoading?: boolean;
}

const CardPartidosSemana: React.FC<PartidosSemanaProps> = ({ partidos = [], isLoading = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (partidos.length > 3) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % Math.max(1, partidos.length - 2));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [partidos.length]);

    if (isLoading || !partidos) {
        return <CardPartidosSemanaSkeleton/>;
    }

    return (
        <BaseCard>
            <CardHeader
                icon={<FileText className="text-[var(--color-primary)]" size={16} />}
                title="Esta semana"
                subtitle={partidos.length > 0 ? `${partidos.length} partidos` : ''}
                actions={
                    partidos.length > 3 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                className="p-1.5 text-[#525252] hover:text-[#d4d4d4] hover:bg-[#262626] rounded transition-all duration-200"
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: Math.max(1, partidos.length - 2) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'bg-[var(--color-primary)] w-4'
                                            : 'bg-[#404040] hover:bg-[#525252]'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentIndex(Math.min(partidos.length - 3, currentIndex + 1))}
                                className="p-1.5 text-[#525252] hover:text-[#d4d4d4] hover:bg-[#262626] rounded transition-all duration-200"
                                disabled={currentIndex >= partidos.length - 3}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )
                }
            />
            <PartidoItemWeek partidos={partidos} />
        </BaseCard>
    );
};

export default CardPartidosSemana;