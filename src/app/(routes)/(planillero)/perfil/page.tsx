'use client';

import { Input } from '@/app/components/ui/Input';
import { User, Mail, Phone, CreditCard, Calendar, AtSign } from 'lucide-react';
import { useAuthStore } from '@/app/stores/authStore';


export default function MisDatosPage() {
    const { usuario } = useAuthStore();

    // Helper para formatear teléfono
    const formatTelefono = (telefono?: string | number | bigint | null) => {
        if (!telefono) return 'Sin definir';
        const tel = telefono.toString();
        // Formato: +54 9 XXX XXX-XXXX
        if (tel.length === 10) {
            return `${tel.slice(0, 3)} ${tel.slice(3, 6)}-${tel.slice(6)}`;
        }
        return tel;
    };

    // Helper para formatear fecha
    const formatFecha = (fecha?: Date | string | null) => {
        if (!fecha) return 'Sin definir';
        try {
            const date = new Date(fecha);
            return date.toLocaleDateString('es-AR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return 'Sin definir';
        }
    };

    if (!usuario) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-[var(--gray-100)]">No se encontraron datos del usuario</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-6">
            {/* Header */}
            <div className="text-start my-6">
                <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                    Mis Datos Personales
                </h1>
                <p className="text-[var(--gray-100)] text-sm">

                    Información personal de tu cuenta
                </p>
            </div>

            {/* Información Personal */}
            <div className="bg-[var(--card-background)] rounded-lg space-y-4">
                <h2 className="text-lg font-semibold text-[var(--white)] mb-4 border-b border-[var(--gray-300)] pb-2">
                    Información Personal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Username"
                        value={usuario.username || ''}
                        disabled
                        icon={<AtSign className="w-4 h-4" />}
                        placeholder="Sin definir"
                    />

                    <Input
                        label="Nombre"
                        value={usuario.nombre || ''}
                        disabled
                        icon={<User className="w-4 h-4" />}
                        placeholder="Sin definir"
                    />

                    <Input
                        label="Apellido"
                        value={usuario.apellido || ''}
                        disabled
                        icon={<User className="w-4 h-4" />}
                        placeholder="Sin definir"
                    />

                    <Input
                        label="DNI"
                        value={usuario.dni || ''}
                        disabled
                        icon={<CreditCard className="w-4 h-4" />}
                        placeholder="Sin definir"
                    />

                    <Input
                        label="Email"
                        value={usuario.email || ''}
                        disabled
                        icon={<Mail className="w-4 h-4" />}
                        placeholder="Sin definir"
                    />

                    <Input
                        label="Teléfono"
                        value={formatTelefono(usuario.telefono)}
                        disabled
                        icon={<Phone className="w-4 h-4" />}
                        placeholder="Sin definir"
                    />

                    <Input
                        label="Fecha de Nacimiento"
                        value={formatFecha(usuario.nacimiento)}
                        disabled
                        icon={<Calendar className="w-4 h-4" />}
                        placeholder="Sin definir"
                    />
                </div>
                {/* Botones de Acción */}
                {/* <div className="flex flex-col space-y-3 pt-4">
                    <Button variant="footer" fullWidth>
                        Editar Información
                    </Button>
                </div> */}
            </div>

        </div>
    );
}