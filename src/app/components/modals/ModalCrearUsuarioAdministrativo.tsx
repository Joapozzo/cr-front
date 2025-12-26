'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Input } from '../ui/Input';
import { FormModal, FormField, FormDataValue } from './ModalAdmin';
import { useRolesAdministrativos, useCrearUsuarioAdministrativo, useGenerarPasswordSeguro } from '@/app/hooks/useUsuariosAdmin';
import { toast } from 'react-hot-toast';

interface ModalCrearUsuarioAdministrativoProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

// Componente auxiliar para los requisitos de password
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
        <div
            className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-[var(--green)]' : 'bg-[var(--gray-200)]'
                }`}
        />
        <span
            className={`text-xs ${met ? 'text-[var(--green)]' : 'text-[var(--gray-200)]'
                }`}
        >
            {text}
        </span>
    </div>
);

export default function ModalCrearUsuarioAdministrativo({
    isOpen,
    onClose,
    onSuccess,
}: ModalCrearUsuarioAdministrativoProps) {
    const [emailPrefix, setEmailPrefix] = useState('');
    const [password, setPassword] = useState('');

    const { data: roles, isLoading: loadingRoles } = useRolesAdministrativos();
    const generarPassword = useGenerarPasswordSeguro();
    const crearUsuario = useCrearUsuarioAdministrativo({
        onSuccess: () => {
            toast.success('Usuario administrativo creado correctamente');
            handleClose();
            if (onSuccess) onSuccess();
        },
        onError: (error: unknown) => {
            // Manejar errores del backend
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { error?: string; errors?: Array<{ field?: string; message?: string }> } } };
                const errorData = axiosError.response?.data;
                
                // Mostrar toast con el error general si existe
                if (errorData?.error) {
                    toast.error(errorData.error);
                }
                
                // Los errores específicos por campo se manejan automáticamente por FormModal
                if (errorData?.errors && errorData.errors.length > 0) {
                    // Mostrar toast para cada error
                    errorData.errors.forEach((err: { field?: string; message?: string }) => {
                        if (err.message) {
                            toast.error(err.message);
                        }
                    });
                }
            } else {
                const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario';
                toast.error(errorMessage);
            }
        },
    });

    // Preparar opciones de roles - Solo ADMIN (1), PLANILLERO (2), CAJERO (5)
    const rolesOptions = roles
        ?.filter(rol => [1, 2, 5].includes(rol.id_rol)) // Filtrar solo roles administrativos
        .map(rol => ({
            value: rol.id_rol,
            label: rol.nombre.toUpperCase(),
        })) || [];

    // Validaciones visuales de password (igual que RegisterForm)
    const hasMinLength = password?.length >= 8;
    const hasLowerCase = /[a-z]/.test(password || '');
    const hasUpperCase = /[A-Z]/.test(password || '');
    const hasNumber = /[0-9]/.test(password || '');
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password || '');

    const handleGenerarPassword = async () => {
        try {
            const newPassword = await generarPassword.mutateAsync(16);
            setPassword(newPassword);
            // Sincronizar con el campo del formulario usando onFieldChange
            handleFieldChange('password', newPassword);
            toast.success('Contraseña generada correctamente');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al generar contraseña';
            toast.error(errorMessage);
        }
    };

    // Construir email completo
    const emailCompleto = emailPrefix ? `${emailPrefix}@coparelampago.com` : '';

    const handleSubmit = async (data: Record<string, FormDataValue>) => {
        const nombre = String(data.nombre || '').trim();
        const apellido = String(data.apellido || '').trim();
        const email = emailCompleto || String(data.email || '').trim().toLowerCase();
        // Usar el estado local 'password' en lugar de data.password porque es un campo personalizado
        const passwordValue = password || String(data.password || '');
        const id_rol = Number(data.id_rol);

        // Validaciones adicionales
        if (!emailPrefix.trim()) {
            throw new Error('El prefijo del email es requerido');
        }

        if (!email.endsWith('@coparelampago.com')) {
            throw new Error('El email debe tener el dominio @coparelampago.com');
        }

        if (!passwordValue || passwordValue.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }

        // Recalcular validaciones con el passwordValue actual
        const hasLowerCaseCheck = /[a-z]/.test(passwordValue);
        const hasUpperCaseCheck = /[A-Z]/.test(passwordValue);
        const hasNumberCheck = /[0-9]/.test(passwordValue);
        const hasSpecialCharCheck = /[^a-zA-Z0-9]/.test(passwordValue);

        // Validaciones de password (igual que RegisterForm)
        if (!hasLowerCaseCheck) {
            throw new Error('La contraseña debe contener al menos una minúscula');
        }
        if (!hasUpperCaseCheck) {
            throw new Error('La contraseña debe contener al menos una mayúscula');
        }
        if (!hasNumberCheck) {
            throw new Error('La contraseña debe contener al menos un número');
        }
        if (!hasSpecialCharCheck) {
            throw new Error('La contraseña debe contener al menos un carácter especial');
        }

        crearUsuario.mutate({
            nombre,
            apellido,
            email,
            password: passwordValue,
            id_rol,
        });
    };

    const handleFieldChange = (name: string, value: FormDataValue) => {
        // Sincronizar password local
        if (name === 'password') {
            setPassword(String(value || ''));
        }
    };

    const handleClose = () => {
        setEmailPrefix('');
        setPassword('');
        onClose();
    };

    // Campos del formulario (sin email y password, los manejamos custom)
    const fields: FormField[] = [
        {
            name: 'nombre',
            label: 'Nombre',
            type: 'text',
            placeholder: 'Ingrese el nombre',
            required: true,
        },
        {
            name: 'apellido',
            label: 'Apellido',
            type: 'text',
            placeholder: 'Ingrese el apellido',
            required: true,
        },
        {
            name: 'id_rol',
            label: 'Rol',
            type: 'select',
            placeholder: loadingRoles ? 'Cargando roles...' : 'Seleccionar rol',
            required: true,
            options: rolesOptions,
        },
    ];

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Crear usuario"
            fields={fields}
            onSubmit={handleSubmit}
            submitText="Crear Usuario"
            type="create"
            isLoading={crearUsuario.isPending}
            autoClose={false}
            onFieldChange={handleFieldChange}
        >
            {/* Campos personalizados: Email y Password */}
            <div className="space-y-4 mb-4">
                {/* Email con prefijo editable */}
                <div className="space-y-2">
                    <label className="block text-sm font-light text-[var(--white)]">
                        Email <span className="text-[var(--red)]">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={emailPrefix}
                            onChange={(e) => {
                                const prefix = e.target.value.replace(/[@\s]/g, ''); // No permitir @ ni espacios
                                setEmailPrefix(prefix);
                                handleFieldChange('email', `${prefix}@coparelampago.com`);
                            }}
                            placeholder="usuario"
                            className="flex-1"
                        />
                        <div className="px-3 py-2.5 bg-[var(--gray-300)] text-[var(--gray-200)] rounded-[20px] border border-[#2D2F30] whitespace-nowrap">
                            @coparelampago.com
                        </div>
                    </div>
                </div>

                {/* Password con botón de generar integrado */}
                <div className="space-y-2">
                    <label className="block text-sm font-light text-[var(--white)]">
                        Contraseña <span className="text-[var(--red)]">*</span>
                    </label>
                    <div className="relative">
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                const newPassword = e.target.value;
                                setPassword(newPassword);
                                handleFieldChange('password', newPassword);
                            }}
                            placeholder="Ingrese o genere una contraseña"
                            className="pr-28"
                        />
                        <button
                            type="button"
                            onClick={handleGenerarPassword}
                            disabled={generarPassword.isPending}
                            className="absolute right-12 top-1/2 -translate-y-1/2 text-[var(--gray-200)] hover:text-[var(--green)] transition-colors flex items-center gap-1.5 disabled:opacity-50 z-10"
                            title="Generar contraseña segura"
                        >
                            <RefreshCw className={`w-4 h-4 ${generarPassword.isPending ? 'animate-spin' : ''}`} />
                            <span className="text-xs font-medium">Generar</span>
                        </button>
                    </div>
                </div>

                {/* Validaciones visuales de password (igual que RegisterForm) */}
                {password && (
                    <div className="bg-[var(--gray-400)] rounded-lg p-4 space-y-2">
                        <p className="text-xs font-medium text-[var(--gray-200)] mb-2">
                            Tu contraseña debe contener:
                        </p>
                        <div className="space-y-1.5">
                            <PasswordRequirement met={hasMinLength} text="Al menos 8 caracteres" />
                            <PasswordRequirement met={hasLowerCase} text="Una letra minúscula" />
                            <PasswordRequirement met={hasUpperCase} text="Una letra mayúscula" />
                            <PasswordRequirement met={hasNumber} text="Un número" />
                            <PasswordRequirement met={hasSpecialChar} text="Un carácter especial (!@#$%^&*)" />
                        </div>
                    </div>
                )}
            </div>
        </FormModal>
    );
}

