"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { FileText, Trash2 } from "lucide-react";
import { BaseCard, CardHeader } from "./BaseCard";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Input";
import { useDatosCompletosPlanillero, planilleroKeys } from "@/app/hooks/usePartidoPlanillero";
import usePartidoStore from "@/app/stores/partidoStore";
import { planilleroService } from "@/app/services/planillero.services";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ObservacionesPlanilleroProps {
    idPartido: number;
    onObservacionesChange?: (observaciones: string) => void;
}

const ObservacionesPlanillero = ({ idPartido, onObservacionesChange }: ObservacionesPlanilleroProps) => {
    const { data: datosPartido } = useDatosCompletosPlanillero(idPartido);
    const { setObservaciones } = usePartidoStore();
    const queryClient = useQueryClient();
    const [observaciones, setObservacionesLocal] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const estadoPartido = datosPartido?.partido?.estado;
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hasLoadedFromBackendRef = useRef(false);

    // Cargar observaciones desde el backend cuando se cargan los datos del partido
    useEffect(() => {
        if (datosPartido?.partido?.descripcion !== undefined && !hasLoadedFromBackendRef.current) {
            const descripcionBackend = datosPartido.partido.descripcion || "";
            setObservacionesLocal(descripcionBackend);
            setObservaciones(descripcionBackend, idPartido);
            hasLoadedFromBackendRef.current = true;
            
            // Sincronizar con localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(`partidoObservaciones_${idPartido}`, descripcionBackend);
                } catch (error) {
                    console.warn('No se pudieron guardar las observaciones en localStorage:', error);
                }
            }
        }
    }, [datosPartido?.partido?.descripcion, idPartido, setObservaciones]);

    // Resetear el flag cuando cambia el partido
    useEffect(() => {
        hasLoadedFromBackendRef.current = false;
    }, [idPartido]);

    // Función para guardar en el backend con debounce
    const guardarEnBackend = useCallback(async (value: string) => {
        try {
            setIsSaving(true);
            await planilleroService.guardarObservacionesPartido(idPartido, value);
            // Invalidar la query para refrescar los datos
            queryClient.invalidateQueries({
                queryKey: planilleroKeys.datosCompletos(idPartido)
            });
            // No mostrar toast para no ser intrusivo, solo guardar silenciosamente
        } catch (error: any) {
            console.error('Error al guardar observaciones:', error);
            toast.error('Error al guardar observaciones. Se guardaron localmente.');
        } finally {
            setIsSaving(false);
        }
    }, [idPartido, queryClient]);

    // Guardar en localStorage, store y backend cuando cambian las observaciones
    const handleChange = (value: string) => {
        setObservacionesLocal(value);
        
        // Guardar en localStorage inmediatamente
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(`partidoObservaciones_${idPartido}`, value);
            } catch (error) {
                console.warn('No se pudieron guardar las observaciones en localStorage:', error);
            }
        }
        
        // Actualizar el store para que esté disponible al finalizar
        setObservaciones(value, idPartido);
        
        // Guardar en backend con debounce (esperar 1 segundo después del último cambio)
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            guardarEnBackend(value);
        }, 1000);
        
        // Notificar al componente padre
        if (onObservacionesChange) {
            onObservacionesChange(value);
        }
    };

    // Limpiar el timer al desmontar
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Notificar cambios de observaciones al componente padre
    useEffect(() => {
        if (onObservacionesChange) {
            onObservacionesChange(observaciones);
        }
    }, [observaciones, onObservacionesChange]);

    // No mostrar si el partido está finalizado (F)
    if (estadoPartido === 'F') {
        return null;
    }

    const handleBorrar = async () => {
        handleChange("");
        // Guardar inmediatamente en backend cuando se borra
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        await guardarEnBackend("");
    };

    return (
        <BaseCard>
            <CardHeader
                icon={<FileText className="text-green-400" size={16} />}
                title="Observaciones del partido"
            />
            <div className="flex flex-col gap-4 p-4">
                <Textarea
                    value={observaciones}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Anote aquí las observaciones del partido"
                    fullWidth={true}
                    className="resize-none h-40"
                    disabled={isSaving}
                />
                <div className="flex justify-between items-center">
                    {isSaving && (
                        <span className="text-xs text-[var(--gray-100)]">Guardando...</span>
                    )}
                    <div className="flex justify-end w-full gap-2 items-center">
                        <Button 
                            variant="default" 
                            onClick={handleBorrar} 
                            className="flex items-center gap-2"
                            disabled={!observaciones || isSaving}
                        >
                            <Trash2 className="w-4 h-4" />
                            Borrar
                        </Button>
                    </div>
                </div>
            </div>
        </BaseCard>
    )
}

export default ObservacionesPlanillero;