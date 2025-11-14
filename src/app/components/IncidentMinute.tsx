import React from 'react';

interface IncidentMinuteProps {
    minuto: number | null;
    isLocal: boolean;
    isAsistencia?: boolean;
}

const IncidentMinute: React.FC<IncidentMinuteProps> = ({
    minuto,
    isLocal,
    isAsistencia = false
}) => {
    const textColor = isAsistencia ? 'text-[#737373]' : 'text-white';
    const alignment = isLocal ? '' : 'text-right';

    return (
        <span className={`font-semibold text-xs sm:text-sm min-w-[32px] ${alignment} ${textColor}`}>
            {isAsistencia ? '' : `${minuto}'`}
        </span>
    );
};

export default IncidentMinute;
