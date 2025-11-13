import { Shield, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/Button"
import { useState, useEffect } from "react"
import { CardTeamHomeUserSkeleton } from "./skeletons/CardTeamHomeUserSkeleton";
import { URI_IMG } from "./ui/utils";
import { IPlantel } from "../types/plantel";

interface CardTeamHomeUserProps {
    equipos: IPlantel[];
    isLoading?: boolean;
}

const CardTeamHomeUser: React.FC = ({ equipos: teamsPlayer, isLoading = false }: CardTeamHomeUserProps) => {
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (teamsPlayer.length > 1) {
            const interval = setInterval(() => {
                handleTeamChange((currentTeamIndex + 1) % teamsPlayer.length);
            }, 8000);

            return () => clearInterval(interval);
        }
    }, [currentTeamIndex, teamsPlayer.length]);

    const handleTeamChange = (newIndex: number) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentTeamIndex(newIndex);
            setIsTransitioning(false);
        }, 150);
    };

    if (isLoading) {
        return (
            <CardTeamHomeUserSkeleton />
        );
    }

    // Renderizar equipos si el usuario tiene equipos
    if (teamsPlayer.length > 0) {
        const currentTeam = teamsPlayer[currentTeamIndex];
        const hasMultipleTeams = teamsPlayer.length > 1;

        return (
            <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="text-white" size={16} />
                        <span className="text-white font-bold">Mis Equipos</span>
                        {hasMultipleTeams && (
                            <span className="text-[var(--black-300)]">
                                | {currentTeamIndex + 1} de {teamsPlayer.length}
                            </span>
                        )}
                    </div>

                    {hasMultipleTeams && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    handleTeamChange(
                                        currentTeamIndex === 0
                                            ? teamsPlayer.length - 1
                                            : currentTeamIndex - 1
                                    )
                                }
                                className="p-1.5 text-[var(--black-400)] hover:text-white hover:bg-[var(--black-700)] rounded transition-all duration-200 active:scale-95"
                                disabled={isTransitioning}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Indicadores de progreso */}
                            <div className="flex gap-1">
                                {teamsPlayer.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleTeamChange(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTeamIndex
                                                ? "bg-green-500 w-4"
                                                : "bg-[var(--black-600)] hover:bg-[var(--black-500)]"
                                            }`}
                                        disabled={isTransitioning}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    handleTeamChange(
                                        currentTeamIndex === teamsPlayer.length - 1
                                            ? 0
                                            : currentTeamIndex + 1
                                    )
                                }
                                className="p-1.5 text-[var(--black-400)] hover:text-white hover:bg-[var(--black-700)] rounded transition-all duration-200 active:scale-95"
                                disabled={isTransitioning}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Team Card */}
                <div className="px-6 py-4 relative overflow-hidden">
                    <div
                        className={`transition-all duration-300 ease-in-out ${isTransitioning
                                ? "opacity-50 transform scale-95"
                                : "opacity-100 transform scale-100"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center relative overflow-hidden group">
                                {currentTeam.img_equipo ? (
                                    <img
                                        src={URI_IMG + currentTeam.img_equipo}
                                        alt={currentTeam.nombre_equipo}
                                        className="w-10 h-10 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <Shield
                                        className="text-[var(--black-400)] transition-transform duration-300 group-hover:scale-110"
                                        size={24}
                                    />
                                )}

                                {/* Subtle glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-white font-medium mb-1 transition-colors duration-300 hover:text-green-300">
                                    {currentTeam.nombre_equipo}
                                </h4>
                                <p className="text-[var(--black-400)] text-sm">
                                    {currentTeam.nombre_cat_edicion}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                {currentTeam.eventual === "si" && (
                                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded border border-orange-500/30 animate-pulse">
                                        Eventual
                                    </span>
                                )}
                                {currentTeam.sancionado === "si" && (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded border border-red-500/30">
                                        Sancionado
                                    </span>
                                )}
                                {currentTeam.eventual === "no" &&
                                    currentTeam.sancionado === "no" && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded border border-green-500/30 relative overflow-hidden">
                                            Activo
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                                        </span>
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Progress bar para auto-slide */}
                    {hasMultipleTeams && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--black-700)]">
                            <div
                                className="h-full bg-green-400 transition-all duration-75 ease-linear"
                                style={{
                                    width: "0%",
                                    animation: "progress 8s linear infinite",
                                }}
                            ></div>
                        </div>
                    )}
                </div>

                <style jsx>{`
              @keyframes progress {
                from {
                  width: 0%;
                }
                to {
                  width: 100%;
                }
              }

              @keyframes shimmer {
                from {
                  transform: translateX(-100%);
                }
                to {
                  transform: translateX(100%);
                }
              }
            `}</style>
            </div>
        );
    }

    // Usuario sin equipos
    return (
        <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-white font-bold">Mi Equipo</span>
                </div>
            </div>

            <div className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--black-700)] rounded-lg flex items-center justify-center">
                        <Shield className="text-[var(--black-400)]" size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[var(--black-300)] font-medium mb-1">
                            Todavía no tienes equipo
                        </p>
                        <p className="text-[var(--black-400)] text-sm">
                            Únete a un equipo para comenzar a jugar
                        </p>
                    </div>
                </div>

                <Button
                    size="sm"
                    variant="default"
                    className="w-full mt-4"
                >
                    Unirme a un equipo
                </Button>
            </div>
        </div>
    );
}

export default CardTeamHomeUser;