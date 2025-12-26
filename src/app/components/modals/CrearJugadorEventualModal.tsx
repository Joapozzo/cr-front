import { Loader2, UserPlus } from "lucide-react";
import BaseModal from "./ModalPlanillero";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useInscribirJugadorEventual } from "@/app/hooks/useCrearJugadorEventual";
import { planilleroService } from "@/app/services/planillero.services";
import { useAuthStore } from "@/app/stores/authStore";
import toast from "react-hot-toast";
import { z, ZodError } from "zod";

const jugadorEventualSchema = z.object({
    dni: z.string()
        .min(1, "El DNI es requerido")
        .min(7, "El DNI debe tener al menos 7 caracteres")
        .max(8, "El DNI debe tener máximo 8 caracteres")
        .regex(/^\d+$/, "El DNI debe contener solo números"),
    dorsal: z.number()
        .min(1, "El dorsal debe ser mayor a 0")
        .max(99, "El dorsal debe ser menor a 100")
        .optional(),
    nombre: z.string()
        .min(1, "El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre debe tener máximo 50 caracteres")
        .trim(),
    apellido: z.string()
        .min(1, "El apellido es requerido")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido debe tener máximo 50 caracteres")
        .trim(),
    email: z.string()
        .min(1, "El email es requerido")
        .email("El email debe tener un formato válido"),
    fecha_nacimiento: z.string()
        .optional()
        .or(z.literal("")),
    id_equipo: z.number(),
    id_categoria_edicion: z.number()
});

interface JugadorEventualModalProps {
    isOpen: boolean;
    onClose: () => void;
    idPartido: number;
    idCategoriaEdicion: number;
    idEquipo: number;
}

const JugadorEventualModal: React.FC<JugadorEventualModalProps> = ({
    isOpen,
    onClose,
    idPartido,
    idEquipo,
    idCategoriaEdicion
}) => {
    const [formData, setFormData] = useState({
        dni: '',
        dorsal: undefined as number | undefined,
        nombre: '',
        apellido: '',
        email: '',
        fecha_nacimiento: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [validatingEmail, setValidatingEmail] = useState(false);
    const [validatingDNI, setValidatingDNI] = useState(false);
    const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dniTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const dniInputRef = useRef<HTMLInputElement | null>(null);
    const STORAGE_KEY = 'jugadorEventualFormData';

    const { mutateAsync: inscribirJugadorEventual, isPending } = useInscribirJugadorEventual();
    const usuario = useAuthStore((state) => state.usuario);

    // Cargar datos guardados al abrir el modal
    useEffect(() => {
        if (isOpen) {
            try {
                const savedData = localStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    setFormData({
                        dni: parsed.dni || '',
                        dorsal: parsed.dorsal,
                        nombre: parsed.nombre || '',
                        apellido: parsed.apellido || '',
                        email: parsed.email || '',
                        fecha_nacimiento: parsed.fecha_nacimiento || ''
                    });
                } else {
                    // Reset form solo si no hay datos guardados
                    setFormData({
                        dni: '',
                        dorsal: undefined,
                        nombre: '',
                        apellido: '',
                        email: '',
                        fecha_nacimiento: ''
                    });
                }
            } catch (error) {
                console.error('Error al cargar datos guardados:', error);
                setFormData({
                    dni: '',
                    dorsal: undefined,
                    nombre: '',
                    apellido: '',
                    email: '',
                    fecha_nacimiento: ''
                });
            }
            setErrors({});
        }
    }, [isOpen]);

    // Guardar datos en localStorage cuando cambien
    useEffect(() => {
        if (isOpen) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
            } catch (error) {
                console.error('Error al guardar datos:', error);
            }
        }
    }, [formData, isOpen]);

    // Validación con Zod (solo formato)
    const validateField = (field: string, value: string | number | undefined) => {
        try {
            const fieldSchema = jugadorEventualSchema.pick({ [field]: true } as Record<string, true>);
            fieldSchema.parse({ [field]: value });
            // Si el campo pasa la validación de formato, eliminar error de formato
            // PERO mantener errores de disponibilidad (que contienen "existe")
            if (field === 'email' || field === 'dni') {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    const currentError = newErrors[field];
                    // Solo eliminar si NO es un error de disponibilidad
                    // Los errores de disponibilidad contienen "existe"
                    if (currentError && !currentError.includes('existe')) {
                        delete newErrors[field];
                    }
                    return newErrors;
                });
            } else {
                // Para otros campos, eliminar el error directamente
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.issues?.[0]?.message;
                if (errorMessage) {
                    setErrors(prev => ({
                        ...prev,
                        [field]: errorMessage
                    }));
                }
            }
        }
    };

    // Validar email en tiempo real (BD + Firebase)
    const validarEmailEnTiempoReal = useCallback(async (email: string) => {
        if (!email || email.trim().length === 0) {
            return;
        }

        // Validar formato primero con Zod
        try {
            const emailSchema = jugadorEventualSchema.pick({ email: true });
            emailSchema.parse({ email });
            // Si pasa la validación de formato, continuar con validación de disponibilidad
        } catch {
            // Si falla formato, no validar disponibilidad (el error de formato ya está en errors)
            return;
        }

        if (!usuario?.uid) {
            return;
        }

        // Guardar el foco actual antes de actualizar el estado
        const activeElement = document.activeElement as HTMLInputElement;
        const shouldRefocus = activeElement === emailInputRef.current;

        // Usar requestAnimationFrame para mantener el foco
        requestAnimationFrame(() => {
            setValidatingEmail(true);
        });

        try {
            const response = await planilleroService.validarEmail(email) as { disponible: boolean; mensaje?: string };

            // Actualizar estado sin perder el foco
            requestAnimationFrame(() => {
                if (!response.disponible) {
                    setErrors(prev => ({
                        ...prev,
                        email: response.mensaje || 'Ya existe un usuario con este email'
                    }));
                } else {
                    // Eliminar TODOS los errores de email si está disponible Y tiene formato válido
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.email;
                        return newErrors;
                    });
                }
                setValidatingEmail(false);

                // Restaurar el foco si era el input de email
                if (shouldRefocus && emailInputRef.current) {
                    setTimeout(() => {
                        emailInputRef.current?.focus();
                    }, 0);
                }
            });
        } catch (error: unknown) {
            console.error('Error al validar email:', error);
            // No mostrar error si falla la validación, solo formato
            requestAnimationFrame(() => {
                setValidatingEmail(false);
                if (shouldRefocus && emailInputRef.current) {
                    setTimeout(() => {
                        emailInputRef.current?.focus();
                    }, 0);
                }
            });
        }
    }, [usuario?.uid]);

    // Validar DNI en tiempo real (BD)
    const validarDNIEnTiempoReal = useCallback(async (dni: string) => {
        if (!dni || dni.trim().length === 0) {
            return;
        }

        // Validar formato primero con Zod
        try {
            const dniSchema = jugadorEventualSchema.pick({ dni: true });
            dniSchema.parse({ dni });
            // Si pasa la validación de formato, continuar con validación de disponibilidad
        } catch {
            // Si falla formato, no validar disponibilidad (el error de formato ya está en errors)
            return;
        }

        if (!usuario?.uid) {
            return;
        }

        // Guardar el foco actual antes de actualizar el estado
        const activeElement = document.activeElement as HTMLInputElement;
        const shouldRefocus = activeElement === dniInputRef.current;

        // Usar requestAnimationFrame para mantener el foco
        requestAnimationFrame(() => {
            setValidatingDNI(true);
        });

        try {
            const response = await planilleroService.validarDNI(dni) as { disponible: boolean; mensaje?: string };

            // Actualizar estado sin perder el foco
            requestAnimationFrame(() => {
                if (!response.disponible) {
                    setErrors(prev => ({
                        ...prev,
                        dni: response.mensaje || 'Ya existe un usuario con este DNI'
                    }));
                } else {
                    // Eliminar TODOS los errores de DNI si está disponible Y tiene formato válido
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.dni;
                        return newErrors;
                    });
                }
                setValidatingDNI(false);

                // Restaurar el foco si era el input de DNI
                if (shouldRefocus && dniInputRef.current) {
                    setTimeout(() => {
                        dniInputRef.current?.focus();
                    }, 0);
                }
            });
        } catch (error: unknown) {
            console.error('Error al validar DNI:', error);
            // No mostrar error si falla la validación
            requestAnimationFrame(() => {
                setValidatingDNI(false);
                if (shouldRefocus && dniInputRef.current) {
                    setTimeout(() => {
                        dniInputRef.current?.focus();
                    }, 0);
                }
            });
        }
    }, [usuario?.uid]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Validar formato con Zod
        validateField(field, value);

        // Validaciones en tiempo real con debounce para email y DNI
        if (field === 'email' && typeof value === 'string') {
            // Limpiar timeout anterior
            if (emailTimeoutRef.current) {
                clearTimeout(emailTimeoutRef.current);
            }
            // Validar después de 800ms de inactividad
            emailTimeoutRef.current = setTimeout(() => {
                validarEmailEnTiempoReal(value);
            }, 800);
        }

        if (field === 'dni' && typeof value === 'string') {
            // Limpiar timeout anterior
            if (dniTimeoutRef.current) {
                clearTimeout(dniTimeoutRef.current);
            }
            // Validar después de 800ms de inactividad
            dniTimeoutRef.current = setTimeout(() => {
                validarDNIEnTiempoReal(value);
            }, 800);
        }
    };

    // Limpiar timeouts al desmontar
    useEffect(() => {
        return () => {
            if (emailTimeoutRef.current) {
                clearTimeout(emailTimeoutRef.current);
            }
            if (dniTimeoutRef.current) {
                clearTimeout(dniTimeoutRef.current);
            }
        };
    }, []);

    const handleSave = async () => {
        try {
            // Preparar datos para validación
            const dataToValidate = {
                ...formData,
                dorsal: formData.dorsal || undefined,
                fecha_nacimiento: formData.fecha_nacimiento || undefined,
                id_equipo: idEquipo,
                id_categoria_edicion: idCategoriaEdicion,
            };

            // Validar todos los campos
            const validatedData = jugadorEventualSchema.parse(dataToValidate);

            // Preparar datos para enviar al backend
            const jugadorData = {
                dni: validatedData.dni,
                nombre: validatedData.nombre,
                apellido: validatedData.apellido,
                email: validatedData.email,
                id_equipo: validatedData.id_equipo,
                id_categoria_edicion: validatedData.id_categoria_edicion,
                ...(validatedData.dorsal && { dorsal: validatedData.dorsal }),
                ...(validatedData.fecha_nacimiento && { fecha_nacimiento: validatedData.fecha_nacimiento }),
            };

            const response = await inscribirJugadorEventual({
                idPartido,
                jugadorData
            });

            // Limpiar datos guardados después de guardar exitosamente
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.error('Error al limpiar datos guardados:', error);
            }

            const responseData = response as { message?: string } | undefined;
            toast.success(responseData?.message || 'Jugador eventual inscrito correctamente');
            handleClose();

        } catch (error: unknown) {
            if (error instanceof ZodError) {
                // Errores de validación
                const fieldErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                // Errores del backend
                const errorObj = error as { response?: { data?: { error?: string } }; message?: string } | undefined;
                const errorMessage = errorObj?.response?.data?.error || errorObj?.message || 'Error al inscribir jugador eventual';
                toast.error(errorMessage);
            }
        }
    };

    const handleClose = () => {
        if (isPending) return;
        setFormData({
            dni: '',
            dorsal: undefined,
            nombre: '',
            apellido: '',
            email: '',
            fecha_nacimiento: ''
        });
        setErrors({});
        onClose();
    };

    // hasErrors solo debe considerar errores reales, no errores vacíos o undefined
    const hasErrors = Object.keys(errors).some(key => {
        const error = errors[key];
        return error && error.trim().length > 0;
    });

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Inscribir jugador eventual"
            actions={
                <div className="flex gap-3">
                    <Button
                        onClick={handleClose}
                        variant="default"
                        className="flex items-center gap-2 w-full justify-center"
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="success"
                        className="flex items-center gap-2 w-full justify-center"
                        disabled={isPending || hasErrors}
                    >
                        {isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Inscribiendo...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} />
                                Inscribir
                            </>
                        )}
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <Input
                            ref={dniInputRef}
                            label="DNI"
                            type="text"
                            placeholder="12345678"
                            value={formData.dni}
                            onChange={(e) => handleInputChange('dni', e.target.value)}
                            error={errors.dni}
                            disabled={isPending}
                            maxLength={8}
                            required
                        />
                        {validatingDNI && (
                            <div className="absolute right-3 top-9">
                                <Loader2 size={16} className="animate-spin text-[var(--gray-200)]" />
                            </div>
                        )}
                    </div>
                    <Input
                        label="Dorsal"
                        type="number"
                        min="1"
                        max="99"
                        placeholder="10"
                        value={formData.dorsal}
                        onChange={(e) => handleInputChange('dorsal', parseInt(e.target.value) || 1)}
                        error={errors.dorsal}
                        disabled={isPending}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Nombre"
                        type="text"
                        placeholder="Juan"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        error={errors.nombre}
                        disabled={isPending}
                        maxLength={50}
                    />
                    <Input
                        label="Apellido"
                        type="text"
                        placeholder="Pérez"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        error={errors.apellido}
                        disabled={isPending}
                        maxLength={50}
                    />
                </div>

                <div className="relative">
                    <Input
                        ref={emailInputRef}
                        label="Email"
                        type="email"
                        placeholder="jugador@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        disabled={isPending}
                        required
                    />
                    {validatingEmail && (
                        <div className="absolute right-3 top-9">
                            <Loader2 size={16} className="animate-spin text-[var(--gray-200)]" />
                        </div>
                    )}
                </div>

                <div className="pr-8">
                    <Input
                        label="Fecha de nacimiento (opcional)"
                        type="date"
                        value={formData.fecha_nacimiento}
                        onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                        error={errors.fecha_nacimiento}
                        disabled={isPending}
                    />
                </div>
            </div>
        </BaseModal>
    );
};

export default JugadorEventualModal;