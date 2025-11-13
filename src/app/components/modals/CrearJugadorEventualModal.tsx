import { AlertCircle, Save, Loader2, UserPlus } from "lucide-react";
import BaseModal from "./ModalPlanillero";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useInscribirJugadorEventual } from "@/app/hooks/useCrearJugadorEventual";
import toast from "react-hot-toast";
import { z, ZodError } from "zod";

const jugadorEventualSchema = z.object({
    dni: z.string()
        .min(7, "El DNI debe tener al menos 7 caracteres")
        .max(8, "El DNI debe tener máximo 8 caracteres")
        .regex(/^\d+$/, "El DNI debe contener solo números"),
    dorsal: z.number()
        .min(1, "El dorsal debe ser mayor a 0")
        .max(99, "El dorsal debe ser menor a 100"),
    nombre: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre debe tener máximo 50 caracteres")
        .trim(),
    apellido: z.string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido debe tener máximo 50 caracteres")
        .trim(),
    email: z.string()
        .email("El email debe tener un formato válido")
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
        dorsal: 1,
        nombre: '',
        apellido: '',
        email: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { mutateAsync: inscribirJugadorEventual, isPending } = useInscribirJugadorEventual();

    useEffect(() => {
        if (isOpen) {
            // Reset form
            setFormData({
                dni: '',
                dorsal: 1,
                nombre: '',
                apellido: '',
                email: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    const validateField = (field: string, value: any) => {
        try {
            const fieldSchema = jugadorEventualSchema.pick({ [field]: true } as any);
            fieldSchema.parse({ [field]: value });
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        } catch (error) {
            if (error instanceof ZodError) {
                setErrors(prev => ({
                    ...prev,
                    [field]: error.errors?.[0]?.message || 'Error de validación'  // Agregar ? antes de [0]
                }));
            }
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Validar campo en tiempo real
        setTimeout(() => validateField(field, value), 100);
    };

    const handleSave = async () => {
        try {
            // Validar todos los campos
            const validatedData = jugadorEventualSchema.parse({
                ...formData,
                email: formData.email,
                id_equipo: idEquipo,
                id_categoria_edicion: idCategoriaEdicion,
            });
            console.log('Response:', validatedData);

            const response = await inscribirJugadorEventual({
                idPartido,
                jugadorData: validatedData
            });



            toast.success((response as any)?.message || 'Jugador eventual inscrito correctamente');
            handleClose();

        } catch (error: any) {
            if (error instanceof ZodError) {  // Cambiar z.ZodError por ZodError
                // Errores de validación
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                // Errores del backend
                const errorMessage = error?.response?.data?.error || error?.message || 'Error al inscribir jugador eventual';
                toast.error(errorMessage);
            }
        }
    };

    const handleClose = () => {
        if (isPending) return;
        setFormData({
            dni: '',
            dorsal: 1,
            nombre: '',
            apellido: '',
            email: ''
        });
        setErrors({});
        onClose();
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Inscribir Jugador Eventual"
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
                    <Input
                        label="DNI"
                        type="text"
                        placeholder="12345678"
                        value={formData.dni}
                        onChange={(e) => handleInputChange('dni', e.target.value)}
                        error={errors.dni}
                        disabled={isPending}
                        maxLength={8}
                    />
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

                <Input
                    label="Email"
                    type="email"
                    placeholder="jugador@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    disabled={isPending}
                />
            </div>
        </BaseModal>
    );
};

export default JugadorEventualModal;