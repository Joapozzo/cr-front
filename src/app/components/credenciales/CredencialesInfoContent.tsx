import React from 'react';

export const CredencialesInfoContent = () => {
    return (
        <div className="space-y-4 text-sm text-[var(--gray-100)]">
            <p className="flex gap-3">
                <span className="text-[var(--blue)] font-bold text-lg leading-none">•</span>
                <span>Presenta el código QR para validar tu credencial en los partidos.</span>
            </p>
            <p className="flex gap-3">
                <span className="text-[var(--blue)] font-bold text-lg leading-none">•</span>
                <span>La credencial debe estar activa para ser válida.</span>
            </p>
            <p className="flex gap-3">
                <span className="text-[var(--blue)] font-bold text-lg leading-none">•</span>
                <span>Si tu credencial está vencida o revocada, contacta a un administrador.</span>
            </p>
            <p className="flex gap-3">
                <span className="text-[var(--blue)] font-bold text-lg leading-none">•</span>
                <span>Puedes compartir tu credencial usando los botones de acción debajo de la tarjeta.</span>
            </p>
        </div>
    );
};
