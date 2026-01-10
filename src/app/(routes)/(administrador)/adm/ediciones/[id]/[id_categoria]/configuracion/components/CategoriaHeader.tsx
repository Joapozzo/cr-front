/**
 * Header con título y botón de publicar/despublicar
 * Componente presentacional sin lógica de negocio
 */
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface CategoriaHeaderProps {
    titulo: string;
    isPublicada: boolean;
    onTogglePublicada: () => void;
    isLoading?: boolean;
}

export default function CategoriaHeader({
    titulo,
    isPublicada,
    onTogglePublicada,
    isLoading = false,
}: CategoriaHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Configuración de la categoría {titulo}
                </h1>
                <p className="text-[var(--gray-100)] text-sm">
                    Configura los parámetros de la categoría
                </p>
            </div>
            <Button
                variant={isPublicada ? "default" : "success"}
                onClick={onTogglePublicada}
                disabled={isLoading}
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
}

