export const AccionStepIndicator = () => {
    return (
        <div className="ml-3 flex items-center gap-2 text-xs text-[#737373]">
            <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-black text-xs font-medium">
                    1
                </div>
                <span className="hidden sm:inline">Acción</span>
            </div>
            <div className="w-4 h-px bg-[#404040]"></div>
            <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#404040] flex items-center justify-center text-[#737373] text-xs">
                    2
                </div>
                <span className="hidden sm:inline">Tipo</span>
            </div>
            <div className="w-4 h-px bg-[#404040]"></div>
            <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-[#171717] border border-[#404040] flex items-center justify-center text-[#737373] text-xs">
                    3
                </div>
                <span className="hidden sm:inline">Minuto</span>
            </div>
        </div>
    );
};

