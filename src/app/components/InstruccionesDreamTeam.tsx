const InstruccionesDreamTeam = () => {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg p-6 border border-[var(--gray-300)]">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[var(--white)] mb-2">
                    ¡Armá el <span className="text-[var(--green)]">dreamteam</span> de la fecha!
                </h3>
                <div className="w-full h-px bg-[var(--gray-300)]"></div>
            </div>

            <div className="space-y-4">
                {[
                    "Selecciona el jugador que quieres agregar",
                    "Una vez abierto el modal, tendrás primero los jugadores destacados por los planilleros, y debajo, los jugadores que participaron en la última fecha",
                    "Elige a tu criterio el jugador en la posición adecuada",
                    "Puedes cambiar el jugador seleccionado haciendo click en el mismo",
                    "¡Listo! ahora puedes armar el dreamteam de la fecha"
                ].map((instruccion, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[var(--gray-100)] text-[var(--gray-500)] rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                        </span>
                        <p className="text-[var(--gray-100)] text-sm">{instruccion}</p>
                    </div>
                ))}

                <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm">
                        ⚠
                    </span>
                    <p className="text-yellow-200 text-sm">
                        El botón limpiar formación elimina por completo el dreamteam
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InstruccionesDreamTeam;