import Image from 'next/image';

interface InfoSectionProps {
  infoTitle?: string;
  infoDescription?: string;
}

export const InfoSection = ({
  infoTitle,
  infoDescription,
}: InfoSectionProps) => {
  return (
    <div
      className="hidden lg:flex relative w-1/2 flex-col items-center justify-center px-24 bg-cover bg-center"
      style={{ backgroundImage: "url('/imagen_log.jpg')" }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/80 z-0" />

      {/* Logo arriba */}
      <div className="absolute top-12 left-12 z-10">
        <Image
          src="/logos/logotipo.png"
          alt="Copa Relámpago"
          width={275}
          height={60}
        />
      </div>

      {/* Badge y título al medio, alineados a la izquierda */}
      <div className="z-10 flex flex-col gap-4 items-start justify-center w-full pl-12">
        {/* Badge */}
        <span className="text-xs font-bold px-3 py-1 bg-[var(--green)] text-[var(--black)] uppercase">
          {infoTitle || 'novedades'}
        </span>

        {/* Título */}
        <h2 className="text-3xl font-normal max-w-md">
          {infoDescription || '¡Conocé la versión beta del nuevo sistema de CR!'}
        </h2>
      </div>
    </div>
  );
};

