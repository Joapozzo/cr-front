'use client';

import React, { useState } from 'react';
import { Button } from './ui//Button';
import { Input } from './ui/Input';
import { TiptapEditor } from './TipTapEditor';
import { ImageUploader } from './ImageUploader';
import SelectGeneral from './ui/SelectGeneral';
// import { useCategoriaStore } from '../stores/categoriaStore';
import { useCategoriasPorEdicionActivas } from '../hooks/useCategorias';
import { Loader2 } from 'lucide-react';

interface NoticiaFormProps {
    initialData?: {
        titulo?: string;
        contenido?: string;
        img_portada?: string;
        id_tipo_noticia?: number;
        destacada?: boolean;
        publicada?: boolean;
        categorias?: number[];
    };
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const NoticiaForm: React.FC<NoticiaFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState({
        titulo: initialData?.titulo || '',
        contenido: initialData?.contenido || '{"type":"doc","content":[{"type":"paragraph"}]}',
        img_portada: initialData?.img_portada || '',
        id_tipo_noticia: initialData?.id_tipo_noticia || 1,
        destacada: initialData?.destacada || false,
        publicada: initialData?.publicada || false,
        categorias: initialData?.categorias || []
    });
    const { data: categoriasData, isLoading: isLoadingCategorias } = useCategoriasPorEdicionActivas();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Tipos de noticia mock (en producción vienen del backend)
    const tiposNoticia = [
        { value: 1, label: 'Informativa' },
        { value: 2, label: 'Institucional' },
        { value: 3, label: 'Resultado' },
        { value: 4, label: 'Anuncio' },
        { value: 5, label: 'Entrevista' }
    ];

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.titulo || formData.titulo.length < 5) {
            newErrors.titulo = 'El título debe tener al menos 5 caracteres';
        }

        if (!formData.contenido || formData.contenido.length < 10) {
            newErrors.contenido = 'El contenido es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            onSubmit(formData);
        }
    };

    const toggleCategoria = (id: number) => {
        setFormData(prev => ({
            ...prev,
            categorias: prev.categorias.includes(id)
                ? prev.categorias.filter(c => c !== id)
                : [...prev.categorias, id]
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <Input
                label="Título de la noticia"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Gran victoria en el último partido"
                required
                error={errors.titulo}
            />

            {/* Imagen de portada */}
            <ImageUploader
                value={formData.img_portada}
                onChange={(url) => setFormData({ ...formData, img_portada: url })}
            />

            {/* Contenido */}
            <div>
                <label className="block text-sm font-medium text-[var(--white)] mb-2">
                    Contenido <span className="text-[var(--color-secondary)]">*</span>
                </label>
                <TiptapEditor
                    content={formData.contenido}
                    onChange={(content) => setFormData({ ...formData, contenido: content })}
                />
                {errors.contenido && (
                    <p className="mt-1 text-sm text-[var(--color-secondary)]">{errors.contenido}</p>
                )}
            </div>

            {/* Tipo de noticia */}
            <div>
                <label className="block text-sm font-medium text-[var(--white)] mb-2">
                    Tipo de noticia
                </label>
                <SelectGeneral
                    value={formData.id_tipo_noticia}
                    onChange={(value) => setFormData({ ...formData, id_tipo_noticia: typeof value === 'number' ? value : parseInt(value) })}
                    options={tiposNoticia}
                />
            </div>

            {/* Categorías */}
            <div>
                <label className="block text-sm font-medium text-[var(--white)] mb-2">
                    Categorías (opcional)
                </label>
                {isLoadingCategorias ? (
                    <div className="text-[var(--gray-100)] text-sm">Cargando categorías...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2">
                        {categoriasData?.map((cat) => (
                            <label
                                key={cat.id_categoria_edicion}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors text-xs border ${formData.categorias.includes(cat.id_categoria_edicion)
                                        ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]'
                                        : 'bg-[var(--gray-300)] border-[var(--gray-200)] text-[var(--gray-100)] hover:border-[var(--color-primary)]'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.categorias.includes(cat.id_categoria_edicion)}
                                    onChange={() => toggleCategoria(cat.id_categoria_edicion)}
                                    className="w-3 h-3 accent-[var(--color-primary)] rounded flex-shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-medium truncate">{cat.nombre}</span>
                                    <span className="text-[10px] text-[var(--gray-100)] truncate">
                                        {cat.edicion.nombre} {cat.edicion.temporada}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Opciones */}
            <div className="grid grid-cols-2 gap-3">
                {/* Destacada */}
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, destacada: !formData.destacada })}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${formData.destacada
                            ? 'bg-[var(--orange)]/20 border-[var(--orange)] text-[var(--orange)]'
                            : 'bg-[var(--gray-300)] border-[var(--gray-200)] text-[var(--gray-100)] hover:border-[var(--orange)]'
                        }`}
                >
                    <svg className="w-5 h-5" fill={formData.destacada ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold">Destacada</span>
                        <span className="text-xs opacity-75">Aparece en portada</span>
                    </div>
                </button>

                {/* Publicada */}
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, publicada: !formData.publicada })}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${formData.publicada
                            ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]'
                            : 'bg-[var(--gray-300)] border-[var(--gray-200)] text-[var(--gray-100)] hover:border-[var(--color-primary)]'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {formData.publicada ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                    </svg>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold">{formData.publicada ? 'Publicada' : 'Borrador'}</span>
                        <span className="text-xs opacity-75">{formData.publicada ? 'Visible al público' : 'Solo en admin'}</span>
                    </div>
                </button>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--gray-300)]">
                <Button
                    type="button"
                    variant="default"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="success"   
                    disabled={isLoading}
                >
                    {initialData ? 'Actualizar noticia' : 'Crear noticia'}
                    {isLoading && (
                        <>
                            {' '} <Loader2 className="w-4 h-4 animate-spin inline-block ml-1" />
                        </>
                    )}

                </Button>
            </div>
        </form>
    );
};