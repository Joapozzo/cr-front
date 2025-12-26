"use client";
import { useState, useEffect, useRef } from 'react';
import { FormModal } from '../modals/ModalAdmin';
import { Sancion, CrearSancionInput, EditarSancionInput } from '@/app/types/sancion';
import { Search, User, X } from 'lucide-react';
import { useJugadoresPorCategoria } from '@/app/hooks/useJugadoresPorCategoria';
import { useDebounce } from '@/app/hooks/useDebounce';
import { JugadorCategoria } from '@/app/types/jugador';
import { ImagenPublica } from '../common/ImagenPublica';

interface ModalFormSancionProps {
    sancion?: Sancion | null;
    categoriaId: number;
    onClose: () => void;
    onSubmit: (data: CrearSancionInput | EditarSancionInput) => Promise<void>;
    isLoading?: boolean;
}

export default function ModalFormSancion({
    sancion,
    categoriaId,
    onClose,
    onSubmit,
    isLoading = false
}: ModalFormSancionProps) {
    const esEdicion = !!sancion;

    // Estados para búsqueda de jugadores
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJugador, setSelectedJugador] = useState<JugadorCategoria | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Hook para buscar jugadores
    const { data: jugadoresData } = useJugadoresPorCategoria({
        id_categoria_edicion: categoriaId,
        query: debouncedSearch,
        limit: 10,
        enabled: debouncedSearch.length >= 2 && !esEdicion
    });

    const jugadores = jugadoresData?.data || [];

    // Si es edición, cargar el jugador seleccionado
    useEffect(() => {
        if (esEdicion && sancion?.jugador) {
            setSelectedJugador({
                id_jugador: sancion.jugador.id_jugador,
                nombre: sancion.jugador.usuario.nombre,
                apellido: sancion.jugador.usuario.apellido,
                img: sancion.jugador.usuario.img || '',
                dni: sancion.jugador.usuario.dni || null,
                posicion: null,
                equipo: {
                    id_equipo: 0,
                    nombre: '',
                    img: ''
                }
            });
        }
    }, [esEdicion, sancion]);

    const handleSelectJugador = (jugador: JugadorCategoria) => {
        setSelectedJugador(jugador);
        setSearchQuery('');
        setShowDropdown(false);
    };

    const handleClearJugador = () => {
        setSelectedJugador(null);
        setSearchQuery('');
    };

    // Campos del formulario (sin jugador ni partido, lo manejamos aparte)
    const fields = [
        {
            name: 'tipo_tarjeta',
            label: 'Tipo de Tarjeta',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'Roja Directa', label: 'Roja Directa' },
                { value: 'Doble Amarilla', label: 'Doble Amarilla' }
            ]
        },
        {
            name: 'minuto',
            label: 'Minuto',
            type: 'number' as const,
            placeholder: 'Ej: 45'
        },
        {
            name: 'fechas',
            label: 'Fechas de Sanción',
            type: 'number' as const,
            required: true
        },
        ...(esEdicion ? [{
            name: 'fechas_restantes',
            label: 'Fechas Restantes',
            type: 'number' as const
        }] : []),
        {
            name: 'art',
            label: 'Artículo',
            type: 'text' as const,
            placeholder: 'Ej: Art. 152'
        },
        {
            name: 'multa',
            label: '¿Tiene Multa?',
            type: 'select' as const,
            options: [
                { value: 'N', label: 'No' },
                { value: 'S', label: 'Sí' }
            ]
        },
        ...(esEdicion ? [{
            name: 'apelacion',
            label: '¿Tiene Apelación?',
            type: 'select' as const,
            options: [
                { value: 'N', label: 'No' },
                { value: 'S', label: 'Sí' }
            ]
        }] : []),
        {
            name: 'motivo',
            label: 'Motivo',
            type: 'text' as const,
            placeholder: 'Ej: Conducta violenta'
        },
        {
            name: 'descripcion',
            label: 'Descripción',
            type: 'textarea' as const,
            placeholder: 'Descripción detallada de la infracción...'
        },
        {
            name: 'observaciones',
            label: 'Observaciones',
            type: 'textarea' as const,
            placeholder: 'Observaciones adicionales...'
        }
    ];

    const initialData = esEdicion && sancion ? {
        tipo_tarjeta: sancion.tipo_tarjeta || '',
        minuto: sancion.minuto || '',
        fechas: sancion.fechas || 1,
        fechas_restantes: sancion.fechas_restantes ?? sancion.fechas ?? 1,
        art: sancion.art || '',
        multa: sancion.multa || 'N',
        apelacion: sancion.apelacion || 'N',
        motivo: sancion.motivo || '',
        descripcion: sancion.descripcion || '',
        observaciones: sancion.observaciones || ''
    } : {
        tipo_tarjeta: '',
        minuto: '',
        fechas: 1,
        art: '',
        multa: 'N',
        motivo: '',
        descripcion: '',
        observaciones: ''
    };

    const handleFormSubmit = async (formData: Record<string, any>) => {
        if (esEdicion) {
            // Para edición, solo enviamos los campos editables
            const dataEdicion: EditarSancionInput = {
                minuto: formData.minuto ? parseInt(formData.minuto) : undefined,
                descripcion: formData.descripcion || undefined,
                motivo: formData.motivo || undefined,
                fechas: parseInt(formData.fechas),
                fechas_restantes: formData.fechas_restantes !== undefined && formData.fechas_restantes !== ''
                    ? parseInt(formData.fechas_restantes)
                    : undefined,
                multa: formData.multa as 'S' | 'N',
                tipo_tarjeta: formData.tipo_tarjeta || undefined,
                art: formData.art || undefined,
                observaciones: formData.observaciones || undefined,
                apelacion: formData.apelacion as 'S' | 'N'
            };
            await onSubmit(dataEdicion);
        } else {
            // Para creación, validar que haya jugador seleccionado
            if (!selectedJugador) {
                throw new Error('Debes seleccionar un jugador');
            }

            const dataCreacion: CrearSancionInput = {
                id_categoria_edicion: categoriaId,
                id_jugador: selectedJugador.id_jugador,
                minuto: formData.minuto ? parseInt(formData.minuto) : undefined,
                descripcion: formData.descripcion || undefined,
                motivo: formData.motivo || undefined,
                fechas: parseInt(formData.fechas),
                multa: formData.multa as 'S' | 'N',
                tipo_tarjeta: formData.tipo_tarjeta || undefined,
                art: formData.art || undefined,
                observaciones: formData.observaciones || undefined
            };
            await onSubmit(dataCreacion);
        }
    };

    return (
        <FormModal
            isOpen={true}
            onClose={onClose}
            title={esEdicion ? 'Editar sanción' : 'Nueva sanción'}
            fields={fields}
            initialData={initialData}
            onSubmit={handleFormSubmit}
            submitText={esEdicion ? 'Guardar Cambios' : 'Crear Sanción'}
            type={esEdicion ? 'edit' : 'create'}
        >
            {/* Búsqueda de jugador (solo en creación) */}
            {!esEdicion && (
                <div className="mb-6 z-9999">
                    <label className="block text-sm font-light text-[var(--white)] mb-2">
                        Jugador <span className="text-[var(--red)]">*</span>
                    </label>

                    {selectedJugador ? (
                        // Jugador seleccionado
                        <div className="bg-[var(--gray-300)] rounded-lg p-4 border-2 border-[var(--green)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ImagenPublica src={selectedJugador.img} alt={`${selectedJugador.nombre} ${selectedJugador.apellido}`} width={40} height={40} />
                                <div>
                                    <p className="text-[var(--white)] font-medium">
                                        {selectedJugador.nombre} {selectedJugador.apellido}
                                    </p>
                                    <p className="text-xs text-[var(--gray-100)]">
                                        {selectedJugador.equipo.nombre}
                                        {selectedJugador.posicion && ` • ${selectedJugador.posicion.nombre}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClearJugador}
                                className="p-2 hover:bg-[var(--gray-200)] rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-[var(--gray-100)]" />
                            </button>
                        </div>
                    ) : (
                        // Búsqueda de jugador
                        <div className="relative" ref={dropdownRef}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-100)]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    placeholder="Buscar jugador por nombre..."
                                    className="w-full pl-10 pr-4 py-3 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] placeholder-[var(--gray-100)] focus:outline-none focus:border-[var(--green)] transition-colors"
                                />
                            </div>

                            {/* Dropdown de resultados */}
                            {showDropdown && searchQuery.length >= 2 && (
                                <div className="absolute z-[9999] w-full mt-2 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                    {jugadores.length > 0 ? (
                                        jugadores.map((jugador) => (
                                            <button
                                                key={jugador.id_jugador}
                                                onClick={() => handleSelectJugador(jugador)}
                                                className="w-full p-3 flex items-center gap-3 hover:bg-[var(--gray-200)] transition-colors text-left"
                                            >
                                                <ImagenPublica src={jugador.img} alt={`${jugador.nombre} ${jugador.apellido}`} width={40} height={40} />
                                                <div className="flex-1">
                                                    <p className="text-[var(--white)] font-medium">
                                                        {jugador.nombre} {jugador.apellido}
                                                    </p>
                                                    <p className="text-xs text-[var(--gray-100)]">
                                                        {jugador.equipo.nombre}
                                                        {jugador.posicion && ` • ${jugador.posicion.nombre}`}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-[var(--gray-100)]">
                                            No se encontraron jugadores
                                        </div>
                                    )}
                                </div>
                            )}

                            {searchQuery.length > 0 && searchQuery.length < 2 && (
                                <p className="text-xs text-[var(--gray-100)] mt-1">
                                    Escribe al menos 2 caracteres para buscar
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Información del jugador (en edición) */}
            {esEdicion && selectedJugador && (
                <div className="mb-6">
                    <label className="block text-sm font-light text-[var(--white)] mb-2">
                        Jugador Sancionado
                    </label>
                    <div className="bg-[var(--gray-300)] rounded-lg p-4 border border-[var(--gray-200)]">
                        <p className="text-[var(--white)] font-medium">
                            {selectedJugador.nombre} {selectedJugador.apellido}
                        </p>
                    </div>
                </div>
            )}
        </FormModal>
    );
}
