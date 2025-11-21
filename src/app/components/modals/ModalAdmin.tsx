'use client';

import { useState, useEffect } from 'react';
import { X, Check, Trash2, AlertTriangle, Plus, Edit3, Upload, FileText, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { Input, DateInput, TimeInput } from '../ui/Input';
import Select from '../ui/Select';
import { Button } from '../ui/Button';
import Switch from '../ui/Switch';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    type?: 'create' | 'edit' | 'delete' | 'info' | 'import';
    maxWidth?: string;
}

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea' | 'file' | 'switch' | 'date' | 'time';
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string | number; label: string }>;
    accept?: string;
    disabled?: boolean;
}

export type FormDataValue = string | number | boolean | 'S' | 'N' | File | null | undefined;

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: FormField[];
    initialData?: Record<string, FormDataValue>;
    onSubmit: (data: Record<string, FormDataValue>) => Promise<void>;
    submitText?: string;
    type?: 'create' | 'edit';
    validationSchema?: z.ZodTypeAny;
    children?: React.ReactNode;
    onFieldChange?: (name: string, value: FormDataValue) => void;
}

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    itemName?: string;
    onConfirm: () => Promise<void>;
    error: Error | { message: string } | null;
}

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    acceptedFormats: string[];
    onFileSelect: (file: File) => Promise<void>;
    templateUrl?: string;
}

const BaseModal = ({ isOpen, onClose, title, children, type = 'info', maxWidth = 'max-w-md' }: ModalProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const getTypeIcon = () => {
        switch (type) {
            case 'create':
                return <Plus className="w-6 h-6 text-[var(--green)]" />;
            case 'edit':
                return <Edit3 className="w-6 h-6 text-[var(--import)]" />;
            case 'delete':
                return <Trash2 className="w-6 h-6 text-[var(--red)]" />;
            case 'import':
                return <Upload className="w-6 h-6 text-[var(--import)]" />;
            default:
                return <FileText className="w-6 h-6 text-[var(--blue)]" />;
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'create':
                return 'border-[var(--green)]';
            case 'edit':
                return 'border-[var(--import)]';
            case 'delete':
                return 'border-[var(--red)]';
            case 'import':
                return 'border-[var(--import)]';
            default:
                return 'border-[var(--gray-200)]';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-[var(--gray-400)] rounded-xl border-2 ${getTypeColor()} shadow-2xl w-full ${maxWidth} transform transition-all duration-300 ${isAnimating
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-4'
                    }`}
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--gray-300)]">
                    <div className="flex items-center gap-3">
                        {getTypeIcon()}
                        <h2 className="text-xl font-semibold text-[var(--white)]">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--gray-100)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const FormModal = ({
    isOpen,
    onClose,
    title,
    fields,
    initialData = {},
    onSubmit,
    submitText = 'Guardar',
    type = 'create',
    validationSchema,
    children,
    onFieldChange,
}: FormModalProps & { children?: React.ReactNode }) => {
    const [formData, setFormData] = useState<Record<string, FormDataValue>>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData);
            setErrors({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleChange = (name: string, value: FormDataValue) => {
        const field = fields.find(f => f.name === name);

        let processedValue = value;

        // Para campos switch, convertir booleano a "S" o "N"
        if (field?.type === 'switch') {
            processedValue = value ? 'S' : 'N';
        }
        // Para campos numéricos, convertir a number solo si no está vacío
        else if (field?.type === 'number') {
            if (value === '' || value === null || value === undefined) {
                processedValue = ''; // Mantener vacío para mostrar placeholder
            } else {
                processedValue = Number(value); // Convertir a número (incluso 0)
            }
        }

        // Actualizar estado local
        setFormData(prev => ({ ...prev, [name]: processedValue }));

        // Validar solo este campo en tiempo real
        if (validationSchema && errors[name]) {
            try {
                // Acceder de forma segura al shape del schema de Zod
                if (validationSchema && typeof validationSchema === 'object' && 'shape' in validationSchema) {
                    const shape = (validationSchema as z.ZodObject<z.ZodRawShape>).shape;
                    if (shape && typeof shape === 'object' && name in shape) {
                        const fieldSchema = shape[name as keyof typeof shape];
                        if (fieldSchema && 'parse' in fieldSchema && typeof fieldSchema.parse === 'function') {
                            (fieldSchema as z.ZodTypeAny).parse(processedValue);
                            setErrors(prev => ({ ...prev, [name]: '' }));
                        }
                    }
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    setErrors(prev => ({
                        ...prev,
                        [name]: error.issues[0]?.message || 'Error de validación'
                    }));
                }
            }
        } else if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // ✅ Notificar al padre si lo pasó como prop
        if (onFieldChange) {
            onFieldChange(name, processedValue);
        }
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData(prev => ({ ...prev, [name]: file }));
    };

    const validateForm = () => {
        if (validationSchema) {
            try {
                validationSchema.parse(formData);
                setErrors({});
                return true;
            } catch (error) {
                console.error('Error completo de validación:', error);
                console.error('Datos del formulario:', formData);

                if (error instanceof z.ZodError) {
                    console.error('Issues específicos:', error.issues);
                    const newErrors: Record<string, string> = {};
                    error.issues.forEach(issue => {
                        console.error(`Campo ${String(issue.path[0])}: ${issue.message}`);
                        if (issue.path[0]) {
                            const fieldKey = String(issue.path[0]);
                            newErrors[fieldKey] = issue.message;
                        }

                    });
                    setErrors(newErrors);
                    return false;
                }
            }
        }

        // Fallback a validación básica si no hay schema
        const newErrors: Record<string, string> = {};
        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} es requerido`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            await onSubmit(formData);
            // Si llega aquí, cerrar modal
            onClose();
        } catch (error: unknown) {
            console.error('Error en el formulario:', error);

            // Manejar diferentes tipos de errores
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { status?: number; data?: { errors?: Array<{ field?: string; message?: string }> } } };
                if (apiError.response?.status === 400 && apiError.response.data?.errors) {
                    const backendErrors: Record<string, string> = {};
                    apiError.response.data.errors.forEach((err) => {
                        if (err.field && err.message) {
                            backendErrors[err.field] = err.message;
                        }
                    });
                    setErrors(backendErrors);
                }
            }

            // Si es un Error estándar, mostrar el mensaje
            if (error instanceof Error && error.message && error.message !== 'Procesando...') {
                setErrors({ general: error.message });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderField = (field: FormField) => {
        const hasError = errors[field.name];

        switch (field.type) {
            case 'select':
                const selectValue = formData[field.name];
                return (
                    <Select
                        options={field.options || []}
                        value={selectValue !== undefined && selectValue !== null ? String(selectValue) : ""}
                        onChange={(value) => handleChange(field.name, value)}
                        placeholder={
                            field.placeholder ||
                            `Seleccionar ${field.label.toLowerCase()}`
                        }
                        className={`w-full border border-[var(--gray-300)] rounded-[20px] ${hasError && "border-[var(--red)]"}`}
                    />
                );

            case 'textarea':
                const textareaValue = formData[field.name];
                return (
                    <textarea
                        value={textareaValue !== undefined && textareaValue !== null ? String(textareaValue) : ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className={`w-full px-4 py-3 bg-[var(--gray-300)] border rounded-lg text-[var(--white)] placeholder-[var(--gray-100)] focus:outline-none focus:border-[var(--green)] transition-colors resize-none ${hasError ? 'border-[var(--red)]' : 'border-[var(--gray-200)]'
                            }`}
                    />
                );

            case 'file':
                return (
                    <input
                        type="file"
                        accept={field.accept}
                        onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)}
                        className={`w-full px-4 py-3 bg-[var(--gray-300)] border rounded-lg text-[var(--white)] focus:outline-none focus:border-[var(--green)] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--green)] file:text-white hover:file:bg-[var(--green-win)] ${hasError ? 'border-[var(--red)]' : 'border-[var(--gray-200)]'
                            }`}
                    />
                );

            case 'switch':
                // Convertir "S" o "N" a booleano para el switch, o usar false por defecto
                const isChecked = formData[field.name] === 'S' || formData[field.name] === true;
                return (
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={isChecked}
                            onChange={(checked) => handleChange(field.name, checked)}
                        />
                        <span className="text-[var(--gray-100)] text-sm">
                            {isChecked ? 'Sí' : 'No'}
                        </span>
                    </div>
                );

            case 'date':
                const dateValue = formData[field.name];
                return (
                    <DateInput
                        value={dateValue !== undefined && dateValue !== null ? String(dateValue) : ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        error={errors[field.name]}
                    />
                );

            case 'time':
                const timeValue = formData[field.name];
                return (
                    <TimeInput
                        value={timeValue !== undefined && timeValue !== null ? String(timeValue) : ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        error={errors[field.name]}
                    />
                );

            default:
                const inputValue = formData[field.name];
                return (
                    <Input
                        type={field.type}
                        // ✅ CORRECCIÓN: Manejar correctamente el valor 0 y convertir a string
                        value={inputValue !== undefined && inputValue !== null ? String(inputValue) : ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        error={errors[field.name]}
                    />
                );
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            type={type}
            maxWidth="max-w-3xl"
        >
            {/* Mostrar children SIEMPRE, no solo cuando hay fields */}
            {children}

            {/* Solo mostrar grid de campos si hay fields */}
            {fields.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <label className="block text-sm font-light text-[var(--white)]">
                                {field.label}
                                {field.required && (
                                    <span className="text-[var(--red)] ml-1">*</span>
                                )}
                            </label>
                            {renderField(field)}
                            {errors[field.name] && (
                                <p className="text-[var(--red)] text-sm flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {errors.general && (
                <div className="p-3 bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg flex items-center justify-center w-full my-4">
                    <p className="text-[var(--red)] text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.general}
                    </p>
                </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                <Button onClick={onClose} className="">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center px-15 gap-2"
                    variant="success"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            {submitText}
                        </>
                    )}
                </Button>
            </div>
        </BaseModal>
    );
};

const DeleteModal = ({ isOpen, onClose, title, message, itemName, onConfirm, error }: DeleteModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error('Error al eliminar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={title} type="delete">
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-[var(--red)] flex-shrink-0" />
                    <div>
                        <p className="text-[var(--white)] font-medium">
                            {message}
                        </p>
                        {itemName && (
                            <p className="text-[var(--gray-100)] text-sm mt-1">
                                Elemento: <span className="font-medium">{itemName}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Mostrar error si existe */}
                {error && (
                    <div className="mb-4">
                        <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-[var(--red)] flex-shrink-0" />
                                <p className="text-[var(--red)] text-sm">
                                    {error.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-[var(--gray-100)] text-sm">
                    Esta acción no se puede deshacer.
                </p>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[var(--gray-300)] text-[var(--white)] rounded-lg hover:bg-[var(--gray-200)] transition-colors"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="px-6 py-2 bg-[var(--red)] text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Eliminando...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </>
                    )}
                </button>
            </div>
        </BaseModal>
    );
};

const ImportModal = ({ isOpen, onClose, title, description, acceptedFormats, onFileSelect, templateUrl }: ImportModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        try {
            await onFileSelect(selectedFile);
            onClose();
            setSelectedFile(null);
        } catch (error) {
            console.error('Error al importar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={title} type="import">
            <div className="space-y-4">
                <p className="text-[var(--gray-100)]">{description}</p>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-[var(--white)]">
                        Seleccionar archivo
                    </label>
                    <input
                        type="file"
                        accept={acceptedFormats.join(',')}
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] focus:outline-none focus:border-[var(--green)] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--import)] file:text-white hover:file:bg-indigo-600"
                    />
                    <p className="text-sm text-[var(--gray-100)]">
                        Formatos aceptados: {acceptedFormats.join(', ')}
                    </p>
                </div>

                {templateUrl && (
                    <div className="p-3 bg-[var(--import)]/10 border border-[var(--import)]/30 rounded-lg">
                        <p className="text-[var(--import)] text-sm font-medium mb-2">
                            ¿Necesitas un template?
                        </p>
                        <a
                            href={templateUrl}
                            download
                            className="text-[var(--import)] hover:text-indigo-400 text-sm underline"
                        >
                            Descargar plantilla de ejemplo
                        </a>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-300)]">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[var(--gray-300)] text-[var(--white)] rounded-lg hover:bg-[var(--gray-200)] transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || isLoading}
                    className="px-6 py-2 bg-[var(--import)] text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Importando...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            Importar
                        </>
                    )}
                </button>
            </div>
        </BaseModal>
    );
};

const useModals = () => {
    const [modals, setModals] = useState({
        create: false,
        edit: false,
        delete: false,
        import: false,
        info: false,
        createCancha: false,
        editCancha: false,
        deleteCancha: false,
    });

    const openModal = (type: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [type]: true }));
    };

    const closeModal = (type: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [type]: false }));
    };

    const closeAllModals = () => {
        setModals({ 
            create: false, 
            edit: false, 
            delete: false, 
            import: false, 
            info: false,
            createCancha: false,
            editCancha: false,
            deleteCancha: false,
        });
    };

    return {
        modals,
        openModal,
        closeModal,
        closeAllModals,
    };
};

export {
    BaseModal,
    FormModal,
    DeleteModal,
    ImportModal,
    useModals,
};

export type { FormField, FormModalProps, DeleteModalProps, ImportModalProps };