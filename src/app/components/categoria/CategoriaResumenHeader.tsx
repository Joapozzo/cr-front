"use client";

import { Button } from "@/app/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

interface CategoriaResumenHeaderProps {
    nombreCategoria: string;
    isPublicada: boolean;
    onTogglePublicada: () => void;
    isUpdating: boolean;
}

/**
 * Componente de encabezado para el resumen de categoría.
 * Incluye título, descripción y botón para publicar/despublicar.
 */
export const CategoriaResumenHeader = ({
    nombreCategoria,
    isPublicada,
    onTogglePublicada,
    isUpdating,
}: CategoriaResumenHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Resumen - {nombreCategoria || 'Categoría'}
                </h1>
                <p className="text-[var(--gray-100)]">
                    Información general y estado actual de la categoría
                </p>
            </div>
            <Button
                variant={isPublicada ? "default" : "success"}
                onClick={onTogglePublicada}
                disabled={isUpdating}
                className="flex items-center gap-2"
            >
                {isPublicada ? (
                    <>
                        <EyeOff className="w-4 h-4" />
                        <span>Despublicar</span>
                    </>
                ) : (
                    <>
                        <Eye className="w-4 h-4" />
                        <span>Publicar</span>
                    </>
                )}
            </Button>
        </div>
    );
};

