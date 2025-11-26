'use client';

import { User, Mail, Calendar, Shield, Image as ImageIcon, Eye, ExternalLink } from "lucide-react";
import { UsuarioAdmin } from "@/app/types/user";
import { useState } from "react";
import { ImageViewerModal } from "@/app/components/ui/ImageViewerModal";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

type Column = {
    key: string;
    label: string;
    render: (value: any, row?: any) => React.ReactNode;
};

const UsuarioImageCell = ({ row }: { row: UsuarioAdmin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const hasImages = row.img || row.foto_selfie_url;

    return (
        <>
            <div className="flex items-center gap-2">
                {row.foto_selfie_url ? (
                    <img
                        src={row.foto_selfie_url}
                        alt={`${row.nombre} ${row.apellido}`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[var(--green)]"
                        title="Foto de verificación"
                    />
                ) : row.img ? (
                    <img
                        src={row.img}
                        alt={`${row.nombre} ${row.apellido}`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--gray-300)] flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-[var(--gray-100)]" />
                    </div>
                )}
                {hasImages && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        className="p-1 h-8 w-8"
                        title="Ver imágenes"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <ImageViewerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imgPublica={row.img}
                imgSelfie={row.foto_selfie_url}
                nombre={`${row.nombre} ${row.apellido}`}
            />
        </>
    );
};

export const getUsuariosColumns = (): Column[] => [
    {
        key: "img",
        label: "IMAGEN",
        render: (_: any, row: UsuarioAdmin) => <UsuarioImageCell row={row} />,
    },
    {
        key: "nombre_completo",
        label: "NOMBRE COMPLETO",
        render: (_: any, row: UsuarioAdmin) => (
            <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-[var(--green)]" />
                <span className="font-medium text-[var(--white)]">
                    {`${row.nombre} ${row.apellido}`}
                </span>
                {row.es_jugador && row.id_jugador && (
                    <Link
                        href={`/adm/legajos/jugadores/${row.id_jugador}`}
                        className="ml-2 p-1 hover:bg-[var(--gray-300)] rounded transition-colors"
                        title="Ver perfil en legajos"
                    >
                        <ExternalLink className="w-4 h-4 text-[var(--green)]" />
                    </Link>
                )}
            </div>
        ),
    },
    {
        key: "email",
        label: "EMAIL",
        render: (value: string) => (
            <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[var(--gray-100)]" />
                <span className="text-[var(--gray-100)]">{value}</span>
            </div>
        ),
    },
    {
        key: "rol",
        label: "ROL",
        render: (_: any, row: UsuarioAdmin) => {
            const rolNombre = row.rol.nombre.toUpperCase();
            const rolConfig: Record<string, { bg: string; text: string }> = {
                'PLANILLERO': { bg: 'bg-blue-500', text: 'text-white' },
                'USER': { bg: 'bg-[var(--green)]', text: 'text-white' },
                'JUGADOR': { bg: 'bg-[var(--green)]', text: 'text-white' },
                'INVITADO': { bg: 'bg-yellow-500', text: 'text-white' },
            };
            const config = rolConfig[rolNombre] || { bg: 'bg-[var(--gray-200)]', text: 'text-[var(--gray-100)]' };
            
            return (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} flex items-center gap-1 w-fit`}>
                    <Shield className="w-3 h-3" />
                    {rolNombre}
                </span>
            );
        },
    },
    {
        key: "estado",
        label: "ESTADO",
        render: (value: 'I' | 'O' | 'A') => {
            const estadoConfig = {
                'A': { label: 'ACTIVO', bg: 'bg-[var(--import)]', text: 'text-white' },
                'I': { label: 'INACTIVO', bg: 'bg-gray-500', text: 'text-white' },
                'O': { label: 'OCULTO', bg: 'bg-red-500', text: 'text-white' },
            };
            const config = estadoConfig[value] || estadoConfig['I'];
            
            return (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                    {config.label}
                </span>
            );
        },
    },
    {
        key: "creado_en",
        label: "FECHA CREACIÓN",
        render: (value: string) => (
            <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[var(--gray-100)]" />
                <span className="text-[var(--gray-100)]">
                    {new Date(value).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            </div>
        ),
    },
    {
        key: "actualizado_en",
        label: "ÚLTIMA ACTUALIZACIÓN",
        render: (value: string) => (
            <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[var(--gray-100)]" />
                <span className="text-[var(--gray-100)]">
                    {new Date(value).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            </div>
        ),
    },
];

