'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { AvatarPerfil } from '@/app/components/perfil/AvatarPerfil';
import { useAuthStore } from '@/app/stores/authStore';
import { useActualizarDatosPerfil } from '@/app/hooks/perfil/useActualizarDatosPerfil';
import { User, Mail, Phone, Calendar, AtSign, Save } from 'lucide-react';
import { PageHeader } from '@/app/components/ui/PageHeader';

export default function PerfilAdminPage() {
    const { usuario } = useAuthStore();
    const { mutate: actualizarDatos, isPending } = useActualizarDatosPerfil();

    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        telefono: usuario?.telefono?.toString() || '',
        nacimiento: usuario?.nacimiento 
            ? new Date(usuario.nacimiento).toISOString().split('T')[0]
            : '',
    });
    const [hasChanges, setHasChanges] = useState(false);

    // Detectar cambios
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    // Formatear teléfono
    const formatTelefono = (telefono?: string | number | bigint | null) => {
        if (!telefono) return '';
        return telefono.toString();
    };

    // Formatear fecha
    const formatFecha = (fecha?: Date | string | null) => {
        if (!fecha) return '';
        try {
            const date = new Date(fecha);
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    // Guardar cambios
    const handleSave = () => {
        if (!hasChanges) return;

        const datos: any = {};
        
        if (formData.nombre !== usuario?.nombre) {
            datos.nombre = formData.nombre;
        }
        if (formData.apellido !== usuario?.apellido) {
            datos.apellido = formData.apellido;
        }
        if (formData.telefono !== formatTelefono(usuario?.telefono)) {
            datos.telefono = formData.telefono || null;
        }
        if (formData.nacimiento !== formatFecha(usuario?.nacimiento)) {
            datos.nacimiento = formData.nacimiento || null;
        }

        if (Object.keys(datos).length === 0) {
            return;
        }

        actualizarDatos(datos, {
            onSuccess: () => {
                setHasChanges(false);
            },
        });
    };

    useEffect(() => {
        setFormData({
            nombre: usuario?.nombre || '',
            apellido: usuario?.apellido || '',
            telefono: usuario?.telefono?.toString() || '',
            nacimiento: usuario?.nacimiento ? new Date(usuario.nacimiento).toISOString().split('T')[0] : '',
        });
    }, [usuario]);

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
        <div className="space-y-6">
            <PageHeader
                title="Mi Perfil"
                description="Gestiona tu información personal y foto de perfil"
            />

            {/* Avatar Section */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <AvatarPerfil
                        imagenUrl={usuario.img}
                        nombre={`${usuario.nombre} ${usuario.apellido}`}
                        editable={true}
                        size="xl"
                    />
                    <div className="flex-1 w-full md:w-auto">
                        <h2 className="text-xl font-bold text-[var(--white)] mb-2">
                            {usuario.nombre} {usuario.apellido}
                        </h2>
                        <p className="text-[var(--gray-100)] mb-1">
                            <Mail className="w-4 h-4 inline mr-2" />
                            {usuario.email}
                        </p>
                        {usuario.username && (
                            <p className="text-[var(--gray-100)]">
                                <AtSign className="w-4 h-4 inline mr-2" />
                                @{usuario.username}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Información Personal */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--white)]">
                        Información personal
                    </h2>
                    {hasChanges && (
                        <Button
                            onClick={handleSave}
                            disabled={isPending}
                            className="flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        icon={<User className="w-4 h-4" />}
                        placeholder="Ingresa tu nombre"
                        disabled
                    />

                    <Input
                        label="Apellido"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        icon={<User className="w-4 h-4" />}
                        placeholder="Ingresa tu apellido"
                        disabled
                    />

                    <Input
                        label="Teléfono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        icon={<Phone className="w-4 h-4" />}
                        placeholder="Ingresa tu teléfono"
                        type="tel"
                        disabled
                    />

                    <Input
                        label="Fecha de Nacimiento"
                        value={formData.nacimiento}
                        onChange={(e) => handleInputChange('nacimiento', e.target.value)}
                        icon={<Calendar className="w-4 h-4" />}
                        placeholder="Fecha de nacimiento"
                        type="date"
                        disabled
                    />

                    <Input
                        label="Email"
                        value={usuario.email || ''}
                        disabled
                        icon={<Mail className="w-4 h-4" />}
                        placeholder="Email"
                    />

                    <Input
                        label="DNI"
                        value={usuario.dni || ''}
                        disabled
                        icon={<User className="w-4 h-4" />}
                        placeholder="DNI"
                    />
                </div>
            </div>
        </div>
    );
}

