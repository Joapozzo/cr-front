'use client';

interface EdicionHeaderProps {
    nombreEdicion: string;
}

export const EdicionHeader = ({ nombreEdicion }: EdicionHeaderProps) => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-[var(--white)] mb-2">
                Configuración de la edición {nombreEdicion}
            </h1>
            <p className="text-[var(--gray-100)] text-sm">
                Configura los parámetros generales de la edición
            </p>
        </div>
    );
};

