'use client';

import { User, Mail, Calendar, Shield, Image as ImageIcon, ExternalLink, KeyRound, UserX, UserCheck } from "lucide-react";
import { UsuarioAdmin } from "@/app/types/user";
import Link from "next/link";
import { Button } from "../ui/Button";
import { ImagenPublica } from "../common/ImagenPublica";

type Column = {
    key: string;
    label: string;
    render: (value: unknown, row: UsuarioAdmin, index: number) => React.ReactNode;
};

const UsuarioImageCell = ({ row }: { row: UsuarioAdmin }) => {
    const nombreCompleto = `${row.nombre} ${row.apellido}`;
    
    return (
        <div className="flex items-center">
            {row.foto_selfie_url ? (
                <ImagenPublica
                    src={row.foto_selfie_url}
                    alt={nombreCompleto}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]"
                    fallbackIcon={<ImageIcon className="w-5 h-5 text-[var(--gray-100)]" />}
                />
            ) : row.img ? (
                <ImagenPublica
                    src={row.img}
                    alt={nombreCompleto}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                    fallbackIcon={<ImageIcon className="w-5 h-5 text-[var(--gray-100)]" />}
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--gray-300)] flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[var(--gray-100)]" />
                </div>
            )}
        </div>
    );
};

export const getUsuariosColumns = (
    onResetPassword?: (usuario: UsuarioAdmin) => void,
    onCambiarEstado?: (usuario: UsuarioAdmin) => void
): Column[] => [
    {
        key: "img",
        label: "IMAGEN",
        render: (_: unknown, row: UsuarioAdmin) => {
            return <UsuarioImageCell row={row} />;
        },
    },
    {
        key: "nombre_completo",
        label: "NOMBRE COMPLETO",
        render: (_: unknown, row: UsuarioAdmin) => {
            return (
                <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="font-medium text-[var(--white)]">
                        {`${row.nombre} ${row.apellido}`}
                    </span>
                    {row.es_jugador && row.id_jugador && (
                        <Link
                            href={`/adm/legajos/jugadores/${row.id_jugador}`}
                            className="ml-2 p-1 hover:bg-[var(--gray-300)] rounded transition-colors"
                            title="Ver perfil en legajos"
                        >
                            <ExternalLink className="w-4 h-4 text-[var(--color-primary)]" />
                        </Link>
                    )}
                </div>
            );
        },
    },
    {
        key: "email",
        label: "EMAIL",
        render: (value: unknown) => {
            const email = typeof value === 'string' ? value : '';
            return (
                <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[var(--gray-100)]" />
                    <span className="text-[var(--gray-100)]">{email}</span>
                </div>
            );
        },
    },
    {
        key: "rol",
        label: "ROL",
        render: (_: unknown, row: UsuarioAdmin) => {
            const rolNombre = row.rol.nombre.toUpperCase();
            const rolConfig: Record<string, { bg: string; text: string }> = {
                'PLANILLERO': { bg: 'bg-blue-500', text: 'text-white' },
                'USER': { bg: 'bg-[var(--color-primary)]', text: 'text-white' },
                'JUGADOR': { bg: 'bg-[var(--color-primary)]', text: 'text-white' },
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
        render: (value: unknown) => {
            const estado = value as 'I' | 'O' | 'A';
            const estadoConfig = {
                'A': { label: 'ACTIVO', bg: 'bg-[var(--import)]', text: 'text-white' },
                'I': { label: 'INACTIVO', bg: 'bg-gray-500', text: 'text-white' },
                'O': { label: 'OCULTO', bg: 'bg-red-500', text: 'text-white' },
            };
            const config = estadoConfig[estado] || estadoConfig['I'];
            
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
        render: (value: unknown) => {
            const fecha = typeof value === 'string' ? value : '';
            return (
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[var(--gray-100)]" />
                    <span className="text-[var(--gray-100)]">
                        {fecha ? new Date(fecha).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        }) : '-'}
                    </span>
                </div>
            );
        },
    },
    {
        key: "actualizado_en",
        label: "ÚLTIMA ACTUALIZACIÓN",
        render: (value: unknown) => {
            const fecha = typeof value === 'string' ? value : '';
            return (
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[var(--gray-100)]" />
                    <span className="text-[var(--gray-100)]">
                        {fecha ? new Date(fecha).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        }) : '-'}
                    </span>
                </div>
            );
        },
    },
    {
        key: "actions",
        label: "ACCIONES",
        render: (_: unknown, row: UsuarioAdmin) => {
            // Solo mostrar acciones para usuarios administrativos (ADMIN, PLANILLERO, CAJERO)
            const rolesAdministrativos = [1, 2, 5]; // ADMIN, PLANILLERO, CAJERO
            const esAdministrativo = rolesAdministrativos.includes(row.rol.id_rol);

            if (!esAdministrativo) {
                return null;
            }

            const estaActivo = row.estado === 'A';

            return (
                <div className="flex items-center gap-2">
                    {onResetPassword && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onResetPassword(row)}
                            className="flex items-center gap-2"
                            title="Regenerar contraseña"
                        >
                            <KeyRound className="w-4 h-4" />
                            Resetear Contraseña
                        </Button>
                    )}
                    {onCambiarEstado && (
                        <Button
                            variant={estaActivo ? "danger" : "success"}
                            size="sm"
                            onClick={() => onCambiarEstado(row)}
                            className="flex items-center gap-2"
                            title={estaActivo ? "Dar de baja" : "Activar usuario"}
                        >
                            {estaActivo ? (
                                <>
                                    <UserX className="w-4 h-4" />
                                    Dar de Baja
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-4 h-4" />
                                    Activar
                                </>
                            )}
                        </Button>
                    )}
                </div>
            );
        },
    },
];

