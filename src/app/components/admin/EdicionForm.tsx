'use client';

import { Input } from '@/app/components/ui/Input';
import Select, { SelectOption } from '@/app/components/ui/Select';
import { EdicionConfig } from '@/app/hooks/useEdicionConfig';
import { EdicionImagenUploader } from './EdicionImagenUploader';

interface EdicionFormProps {
    config: EdicionConfig;
    onInputChange: (field: keyof EdicionConfig, value: string | number) => void;
    imagenActual: string | null;
    imagenPreview: string | null;
    imagenFile: File | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    onRemoveImage: () => void;
    disabled?: boolean;
    MAX_FILE_SIZE_MB: number;
}

const temporadaOptions: SelectOption[] = [
    { value: 2030, label: '2030' },
    { value: 2029, label: '2029' },
    { value: 2028, label: '2028' },
    { value: 2027, label: '2027' },
    { value: 2026, label: '2026' },
    { value: 2025, label: '2025' },
    { value: 2024, label: '2024' },
    { value: 2023, label: '2023' },
    { value: 2022, label: '2022' },
];

const eventualOptions: SelectOption[] = [
    { value: -1, label: 'Sin límite' },
    { value: 1, label: '1 jugador' },
    { value: 2, label: '2 jugadores' },
    { value: 3, label: '3 jugadores' },
    { value: 4, label: '4 jugadores' },
    { value: 5, label: '5 jugadores' },
];

const apercibimientosOptions: SelectOption[] = [
    { value: 1, label: '1 apercibimiento' },
    { value: 2, label: '2 apercibimientos' },
    { value: 3, label: '3 apercibimientos' },
    { value: 4, label: '4 apercibimientos' },
    { value: 5, label: '5 apercibimientos' },
    { value: 6, label: '6 apercibimientos' },
];

const puntosOptions: SelectOption[] = [
    { value: 1, label: '1 punto' },
    { value: 2, label: '2 puntos' },
    { value: 3, label: '3 puntos' },
];

export const EdicionForm = ({
    config,
    onInputChange,
    imagenActual,
    imagenPreview,
    imagenFile,
    fileInputRef,
    onImageChange,
    onRemoveImage,
    disabled = false,
    MAX_FILE_SIZE_MB,
}: EdicionFormProps) => {
    return (
        <div className="rounded-lg w-[70%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <Input
                    label="NOMBRE"
                    value={config.nombre}
                    onChange={(e) => onInputChange("nombre", e.target.value)}
                    placeholder="Nombre de la edición"
                    className="text-[var(--white)] py-3"
                    disabled={disabled}
                />

                {/* Temporada */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm font-medium text-[var(--white)] mb-1">
                        TEMPORADA
                    </label>
                    <Select
                        options={temporadaOptions}
                        value={config.temporada}
                        onChange={(value) => onInputChange("temporada", value as number)}
                        placeholder="Seleccionar temporada"
                        disabled={disabled}
                    />
                </div>

                {/* Cantidad de eventuales */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm font-medium text-[var(--white)] mb-1">
                        CANTIDAD DE EVENTUALES
                    </label>
                    <Select
                        options={[
                            { value: 1, label: "1 jugadores" },
                            { value: 2, label: "2 jugadores" },
                            { value: 3, label: "3 jugadores" },
                            { value: 4, label: "4 jugadores" },
                            { value: 5, label: "5 jugadores" },
                        ]}
                        value={config.cantidad_eventuales}
                        onChange={(value) => onInputChange("cantidad_eventuales", value as number)}
                        placeholder="Seleccionar cantidad"
                        disabled={disabled}
                    />
                </div>

                {/* Partidos por eventual */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm font-medium text-[var(--white)] mb-1">
                        PARTIDOS POR EVENTUAL
                    </label>
                    <Select
                        options={eventualOptions}
                        value={config.partidos_eventuales}
                        onChange={(value) => onInputChange("partidos_eventuales", value as number)}
                        placeholder="Seleccionar límite"
                        disabled={disabled}
                    />
                </div>

                {/* Apercibimientos */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm font-medium text-[var(--white)] mb-1">
                        APERCIBIMIENTOS
                    </label>
                    <Select
                        options={apercibimientosOptions}
                        value={config.apercibimientos}
                        onChange={(value) => onInputChange("apercibimientos", value as number)}
                        placeholder="Seleccionar apercibimientos"
                        disabled={disabled}
                    />
                </div>

                {/* Puntos por apercibimientos */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm font-medium text-[var(--white)] mb-1">
                        PUNTOS POR APERCIBIMIENTOS
                    </label>
                    <Select
                        options={puntosOptions}
                        value={config.puntos_descuento}
                        onChange={(value) => onInputChange("puntos_descuento", value as number)}
                        placeholder="Seleccionar puntos"
                        disabled={disabled}
                    />
                </div>

                {/* Imagen Uploader */}
                <EdicionImagenUploader
                    imagenActual={imagenActual}
                    imagenPreview={imagenPreview}
                    imagenFile={imagenFile}
                    fileInputRef={fileInputRef}
                    onImageChange={onImageChange}
                    onRemoveImage={onRemoveImage}
                    disabled={disabled}
                    MAX_FILE_SIZE_MB={MAX_FILE_SIZE_MB}
                />
            </div>
        </div>
    );
};

