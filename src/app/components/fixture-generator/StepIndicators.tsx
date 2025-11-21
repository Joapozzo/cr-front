'use client';

import { CheckCircle2 } from 'lucide-react';

interface StepIndicatorsProps {
    pasoActual: number;
    totalPasos: number;
    labels: string[];
}

export default function StepIndicators({ pasoActual, totalPasos, labels }: StepIndicatorsProps) {
    return (
        <div className="flex items-center gap-2 text-xs text-[#737373]">
            {Array.from({ length: totalPasos }, (_, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === pasoActual;
                const isCompleted = stepNum < pasoActual;

                return (
                    <div key={stepNum} className="flex items-center">
                        <div className="flex items-center gap-1">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    isActive
                                        ? 'bg-[var(--green)] text-black'
                                        : isCompleted
                                        ? 'bg-[var(--green)] text-black'
                                        : 'bg-[#171717] border border-[#404040] text-[#737373]'
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 size={14} className="text-black" />
                                ) : (
                                    stepNum
                                )}
                            </div>
                            <span className="hidden sm:inline ml-1">{labels[idx]}</span>
                        </div>
                        {idx < totalPasos - 1 && (
                            <div className="w-4 h-px bg-[#404040] mx-2"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

