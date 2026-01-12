'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Credencial } from './types';
import { EstadoCredencial } from './EstadoCredencial';
import { QRCredencial } from './QRCredencial';
import { EscudoEquipo } from '../common/EscudoEquipo';
import { Share2, Download, RefreshCw, QrCode, Copy, Info, X } from 'lucide-react';
import { Geist, Geist_Mono } from 'next/font/google';
import { cn } from './utils';
import { useTenant } from '@/app/contexts/TenantContext';
import { CardInfoPopover } from './CardInfoPopover';
import { credencialesService } from '@/app/services/credenciales.client';

const geistSans = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
});

interface TarjetaCredencialProps {
    credencial: Credencial;
    mostrarAcciones?: boolean;
    autoFlip?: boolean;
    onValidar?: () => void;
    className?: string;
}

export const TarjetaCredencial: React.FC<TarjetaCredencialProps> = ({
    credencial,
    mostrarAcciones = true,
    autoFlip = false,
    onValidar,
    className,
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [dni, setDni] = useState<string>(credencial.jugador.dni || '');
    const [copied, setCopied] = useState(false);
    const infoButtonRef = React.useRef<HTMLButtonElement>(null);
    const tenant = useTenant();

    useEffect(() => {
        if (autoFlip) {
            const timer = setTimeout(() => setIsFlipped(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [autoFlip]);

    // Obtener DNI del backend si no viene
    useEffect(() => {
        const obtenerDniDelBackend = async () => {
            // Solo obtener si no tenemos DNI inicialmente
            if (!credencial.jugador.dni && credencial.id) {
                try {
                    const credencialCompleta = await credencialesService.obtenerCredencial(credencial.id);
                    if (credencialCompleta.jugador.dni) {
                        setDni(credencialCompleta.jugador.dni);
                    }
                } catch (error) {
                    console.error('Error al obtener DNI del backend:', error);
                }
            }
        };
        obtenerDniDelBackend();
    }, [credencial.id, credencial.jugador.dni]);

    // Handle flip logic
    // Handle flip logic
    const handleFlip = (e: React.MouseEvent) => {
        // Prevent flip if clicking on interactive elements or if info is open
        if (showInfo) return;
        setIsFlipped(!isFlipped);
    };

    // Estado para estilos condicionales
    const isRevoked = credencial.estado === 'REVOCADA';
    const isExpired = credencial.estado === 'VENCIDA';
    const invalid = isRevoked || isExpired;
    // Animation variants
    const variants = {
        front: { rotateY: 0 },
        back: { rotateY: 180 },
    };

    const cardAspectRatio = "aspect-[1.586/1.1] min-h-[260px]"; // Adjusted height to prevent cut-off

    return (
        <div className={cn(
            "flex flex-col items-center gap-6 w-full mx-auto select-none relative",
            geistSans.variable,
            geistMono.variable,
            "font-sans",
            className
        )}>
            {/* 3D Container - Ajustado para mobile-first y layout limpio */}
            <div
                className={cn("relative w-full group perspective-1000 cursor-pointer", cardAspectRatio)}
                onClick={handleFlip}
                style={{ perspective: '1200px' }}
            >
                <motion.div
                    className="relative w-full h-full preserve-3d shadow-xl rounded-[1.2rem]"
                    style={{ 
                        transformStyle: 'preserve-3d',
                    }}
                    animate={isFlipped ? 'back' : 'front'}
                    variants={variants}
                    transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
                >
                    {/* --- FRONTAL --- */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden rounded-[1.2rem] overflow-hidden bg-neutral-900 border border-white/5"
                        style={{ 
                            backfaceVisibility: 'hidden', 
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)',
                        }}
                    >
                        {/* Fondo Minimalista Premium (Igual en ambos lados) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/80 to-neutral-950"></div>
                        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                        {/* Overlay para estados críticos */}
                        {(isRevoked || isExpired) && (
                            <div className="absolute inset-0 z-30 bg-neutral-950/80 backdrop-blur-[1px] flex items-center justify-center">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-bold tracking-widest border uppercase shadow-lg transform -rotate-6",
                                    isRevoked
                                        ? "bg-red-950/90 text-red-500 border-red-500/50"
                                        : "bg-amber-950/90 text-amber-500 border-amber-500/50"
                                )}>
                                    {isRevoked ? 'REVOCADA' : 'VENCIDA'}
                                </span>
                            </div>
                        )}

                        {/* Contenido Principal */}
                        <div className="relative z-10 w-full h-full flex flex-col p-5 sm:p-6 justify-between">

                            {/* Header: Logo & Status */}
                            <div className="flex justify-between items-start w-full">
                                <div className="flex items-center gap-3">
                                    <EscudoEquipo
                                        src={credencial.equipo.escudoUrl}
                                        alt={credencial.equipo.nombre}
                                        size={42}
                                        className="drop-shadow-md"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider leading-none mb-0.5">Club</span>
                                        <span className="text-sm font-semibold text-white leading-none truncate max-w-[120px] sm:max-w-[160px]">
                                            {credencial.equipo.nombre}
                                        </span>
                                    </div>
                                </div>
                                <EstadoCredencial estado={credencial.estado} variant="minimal" />
                            </div>

                            {/* Center: Player Info */}
                            <div className="flex items-end gap-4 pb-1">
                                {/* Foto integrada - Rectángulo redondeado suave */}
                                <div className="relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border border-white/10 shadow-inner bg-neutral-800">
                                    {credencial.jugador.fotoUrl ? (
                                        <Image
                                            src={credencial.jugador.fotoUrl}
                                            alt={credencial.jugador.apellido}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                            <span className="text-neutral-600 text-xs">Sin Foto</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col pb-0.5 min-w-0 flex-1">
                                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none truncate">
                                        {credencial.jugador.apellido}
                                    </h2>
                                    <p className="text-lg sm:text-xl font-normal text-neutral-400 tracking-tight leading-tight truncate mb-2">
                                        {credencial.jugador.nombre}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-0.5">DNI</p>
                                            <p className={`text-xs text-neutral-300 font-medium ${geistMono.className}`}>
                                                {credencial.jugador.dni}
                                            </p>
                                        </div>
                                        <div className="w-px h-6 bg-white/10"></div>
                                        <div>
                                            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-0.5">Categoría</p>
                                            <p className="text-xs text-neutral-300 font-medium truncate max-w-[100px]">
                                                {credencial.equipo.categoria}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decoration & Info Button */}
                            <div className="absolute right-5 bottom-5 z-20 flex gap-2">
                                {/* Info Button Container */}
                                <div className="relative">
                                    <button
                                        ref={infoButtonRef}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowInfo(!showInfo);
                                        }}
                                        className={cn(
                                            "p-1.5 rounded-full transition-all backdrop-blur-sm active:scale-95",
                                            showInfo ? "bg-white text-neutral-900" : "bg-white/10 hover:bg-white/20 text-white/50 hover:text-white"
                                        )}
                                    >
                                        {showInfo ? <X size={16} /> : <Info size={16} />}
                                    </button>
                                </div>

                                {/* Visual QR Hint */}
                                <div className="p-1.5 rounded-full text-white/20">
                                    <QrCode size={16} />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* --- DORSO (Updated) --- */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden rounded-[1.2rem] overflow-hidden bg-neutral-900 border border-white/5"
                        style={{
                            transform: 'rotateY(180deg)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                        }}
                    >
                        {/* Fondo Minimalista Premium (IDÉNTICO AL FRENTE) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/80 to-neutral-950"></div>
                        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-3 p-6">

                            {/* QR Code centrado */}
                            <QRCredencial
                                value={credencial.qrData}
                                size={180}
                                hideBackground
                                bgColor="transparent"
                                fgColor="#FFFFFF"
                            />

                            {/* ID Credencial abajo - Para copiar */}
                            <div
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        await navigator.clipboard.writeText(credencial.id);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    } catch (error) {
                                        console.error('Error al copiar:', error);
                                    }
                                }}
                                className="group/id flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                            >
                                {copied ? (
                                    <span className="text-base text-green-400 font-medium tracking-wider">
                                        ¡Copiado!
                                    </span>
                                ) : (
                                    <>
                                        <span className={`text-base text-white font-medium tracking-wider ${geistMono.className}`}>
                                            {credencial.id}
                                        </span>
                                        <Copy size={14} className="text-white/60 group-hover/id:text-white transition-colors" />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Actions Panel - Minimalist */}
            {mostrarAcciones && (
                <div className="flex items-center justify-center gap-6 w-full max-w-[80%] pt-2">
                    <ActionButton
                        icon={<RefreshCw size={18} />}
                        label="Voltear"
                        onClick={handleFlip}
                        disabled={invalid}
                    />
                    {/* <ActionButton
                        icon={<Share2 size={18} />}
                        label="Compartir"
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: `Credencial ${credencial.jugador.apellido}`,
                                        text: `Jugador ${credencial.equipo.nombre}`,
                                        url: credencial.qrData
                                    });
                                } catch (err) { console.error(err); }
                            } else {
                                await navigator.clipboard.writeText(credencial.qrData);
                                alert('Link copiado');
                            }
                        }}
                    />
                    <ActionButton
                        icon={<Download size={18} />}
                        label="Guardar"
                        onClick={(e) => {
                            e.stopPropagation();
                            alert('Guardar imagen no implementado aún');
                        }}
                    /> */}
                </div>
            )}
            {/* Portal Popover */}
            <CardInfoPopover
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
                anchorRef={infoButtonRef}
                credencial={credencial}
            />
        </div>
    );
};

// Subcomponente de botón para mantener limpieza
const ActionButton = ({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick: (e: any) => void, disabled: boolean }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-2 group ${
            disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
        }`}
        disabled={disabled}
    >
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-transparent transition-all duration-200 ease-out ${
            disabled
                ? 'bg-neutral-400/20 text-neutral-500 border-neutral-500/30'
                : 'bg-neutral-100 text-neutral-600 hover:bg-white hover:border-neutral-200 hover:shadow-sm hover:scale-105 hover:text-black'
        }`}>
            {icon}
        </div>
        <span className={`text-[10px] font-medium transition-colors ${
            disabled
                ? 'text-neutral-500'
                : 'text-neutral-400 group-hover:text-neutral-600'
        }`}>
            {label}
        </span>
    </button>
);

export default TarjetaCredencial;
