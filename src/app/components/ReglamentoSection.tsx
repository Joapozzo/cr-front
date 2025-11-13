
import React from 'react';

const downloadReglamento = () => {
    window.open('/reglamento.pdf', '_blank');
};

const ReglamentoSection: React.FC = () => {
    return (
        <div className="flex flex-col bg-[var(--black-900)] rounded-[20px] overflow-hidden">
            {/* Título */}
            <div className="px-6 py-4 border-b border-[var(--black-800)] flex flex-col gap-1">
                <p className="font-bold text-white">Información</p>
            </div>

            <div className="py-2 flex flex-col">
                <button
                    onClick={downloadReglamento}
                    className="px-6 py-2 cursor-pointer font-normal text-sm text-white hover:bg-[var(--black-800)] transition-colors duration-200 text-left"
                >
                    Reglamento
                </button>
            </div>
        </div>
    );
};

export default ReglamentoSection;