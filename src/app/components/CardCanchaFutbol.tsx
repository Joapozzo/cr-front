const CardCanchaFutbol = () => {
    return (
        <div>
            {/* SVG de las líneas del campo - invertido */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 250"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Líneas del campo en gris */}
                <g stroke="var(--gray-400)" strokeWidth="2" fill="none">
                    {/* Perímetro de media cancha */}
                    <rect x="10" y="10" width="300" height="230" />

                    {/* Línea central (ahora arriba) */}
                    <line x1="10" y1="125" x2="310" y2="125" />

                    {/* Medio círculo central */}
                    <path d="M 135 125 A 25 25 0 0 1 185 125" />
                    <circle cx="160" cy="125" r="2" fill="var(--gray-200)" />

                    {/* Área grande (ahora abajo) */}
                    <rect x="110" y="205" width="100" height="35" />

                    {/* Área chica (ahora abajo) */}
                    <rect x="135" y="222" width="50" height="18" />

                    {/* Semicírculo del área (ahora abajo) */}
                    <path d="M 135 205 A 12 12 0 0 1 185 205" />

                    {/* Punto de penal (ahora abajo) */}
                    <circle cx="160" cy="220" r="1.5" fill="var(--gray-200)" />

                    {/* Corners (ahora abajo) */}
                    <path d="M 10 235 A 5 5 0 0 1 15 240" />
                    <path d="M 305 240 A 5 5 0 0 1 310 235" />
                </g>
            </svg>
        </div>
    );
};
export default CardCanchaFutbol;