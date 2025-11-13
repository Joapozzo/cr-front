import React from 'react';
import {
    ChevronRight,
    FileText,
    Users,
    Trophy,
    Play
} from "lucide-react";
import { BaseCard, CardHeader } from "./BaseCard";

const CardAccesosRapidos: React.FC = () => {
    const accesos = [
        {
            icon: <FileText className="text-green-400" size={20} />,
            titulo: "Planillar Partido",
            descripcion: "Nuevo partido",
            color: "green"
        },
        {
            icon: <Trophy className="text-green-400" size={20} />,
            titulo: "Mis Partidos",
            descripcion: "Ver historial",
            color: "green"
        },
        {
            icon: <Users className="text-green-400" size={20} />,
            titulo: "Equipos",
            descripcion: "Información",
            color: "green"
        },
    ];

    return (
        <BaseCard>
            <CardHeader
                icon={<Play className="text-green-400" size={16} />}
                title="Accesos Rápidos"
            />
            <div className="px-6 py-4">
                <div className="grid grid-cols-1 gap-3">
                    {accesos.map((acceso, index) => (
                        <button
                            key={index}
                            className="flex items-center gap-4 p-4 bg-[#171717] hover:bg-[#262626] rounded-lg border border-[#262626] hover:border-green-500/30 transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-200">
                                {acceso.icon}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white font-medium group-hover:text-green-300 transition-colors duration-200">
                                    {acceso.titulo}
                                </p>
                                <p className="text-[#525252] text-sm">
                                    {acceso.descripcion}
                                </p>
                            </div>
                            <ChevronRight className="text-[#525252] group-hover:text-green-400 transition-colors duration-200" size={16} />
                        </button>
                    ))}
                </div>
            </div>
        </BaseCard>
    );
};

export default CardAccesosRapidos;