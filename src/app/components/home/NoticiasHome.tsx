'use client';

import { Newspaper, ExternalLink, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BaseCard, CardHeader } from '../BaseCard';
import { Noticia } from '@/app/types/noticia';
import { NoticiaCardSkeleton2 } from '../skeletons/NoticiaCardSkeleton';
import { formatearFechaNoticia } from '@/app/utils/fechas';
import { useNoticiasHome } from '@/app/hooks/useNoticiasHome';

interface NoticiasHomeProps {
  noticias?: Noticia[];
  loading?: boolean;
  linkNoticiasCompleta?: string;
}


const NoticiaCard = ({ noticia }: { noticia: Noticia }) => {

  const truncarTexto = (texto: string, limite: number = 80) => {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  };

  return (
    <Link
      href={`/noticias/${noticia.slug || noticia.id_noticia}`}
      className="block group h-full"
    >
      <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#262626] hover:border-[var(--green)] transition-all duration-300 h-full flex flex-col">
        {/* Imagen */}
        <div className="relative h-44 bg-[#262626] overflow-hidden">
          {(noticia.img_portada || noticia.img) ? (
            <Image
              src={noticia.img_portada || noticia.img || ''}
              alt={noticia.titulo}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[#737373]">
              <Newspaper size={48} />
            </div>
          )}

          {/* Badge tipo noticia */}
          {noticia.tipoNoticia && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-[10px] font-semibold rounded-md bg-[var(--green)]/90 text-white backdrop-blur-sm">
                {noticia.tipoNoticia.nombre}
              </span>
            </div>
          )}

          {/* Badge destacada */}
          {noticia.destacada && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-[10px] font-semibold rounded-md bg-yellow-500/90 text-white backdrop-blur-sm">
                ⭐ Destacada
              </span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Título */}
          <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-[var(--green)] transition-colors">
            {noticia.titulo}
          </h3>

          {/* Descripción */}
          <p className="text-[#737373] text-sm mb-3 line-clamp-2 flex-1">
            {truncarTexto(noticia.contenido_preview || noticia.contenido)}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-[#525252] pt-2 border-t border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{formatearFechaNoticia(noticia.fecha_creacion)}</span>
              </div>

              {noticia.visitas > 0 && (
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{noticia.visitas}</span>
                </div>
              )}
            </div>

            <span className="text-[var(--green)] font-medium group-hover:underline">
              Leer más →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const NoticiasHome = ({
  noticias,
  loading = false,
  linkNoticiasCompleta = '/noticias'
}: NoticiasHomeProps) => {
  const {
    noticias: noticiasData,
    loading: isLoading,
    error,
    activeDot,
    scrollContainerRef,
    noticiasRefs,
    handleScroll,
    scrollToPage,
    totalPaginas,
  } = useNoticiasHome({ noticias, loading });

  // Manejar error
  if (error && !noticias) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Newspaper size={18} className="text-[var(--green)]" />}
          title="Noticias"
          subtitle="Error al cargar"
        />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-[#737373] text-sm text-center">{error.message}</p>
        </div>
      </BaseCard>
    );
  }

  // Casos vacíos
  if (!isLoading && (!noticiasData || noticiasData.length === 0)) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Newspaper size={18} className="text-[var(--green)]" />}
          title="Noticias"
        />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mb-4">
            <Newspaper size={32} className="text-[#737373]" />
          </div>
          <p className="text-[#737373] text-sm text-center">
            No hay noticias disponibles
          </p>
        </div>
      </BaseCard>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <BaseCard>
        <CardHeader
          icon={<Newspaper size={18} className="text-[var(--green)]" />}
          title="Noticias"
          subtitle="Cargando..."
        />
        <div className="px-4 py-4">
          <NoticiaCardSkeleton2 />
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard>
      <div className="rounded-t-2xl overflow-hidden">
        <CardHeader
          icon={<Newspaper size={18} className="text-[var(--green)]" />}
          title="Noticias"
          subtitle={`${noticiasData.length} ${noticiasData.length === 1 ? 'noticia' : 'noticias'}`}
        />
      </div>

      {/* Slider horizontal deslizable */}
      <div className="w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-x-auto scroll-smooth snap-mandatory hide-scrollbar px-2 py-4"
        >
          <div className="flex gap-2 px-2">
            {noticiasData.map((noticia, index) => (
              <div
                key={noticia.id_noticia}
                ref={(el) => {
                  noticiasRefs.current[index] = el;
                }}
                className="flex-shrink-0 w-[250px] sm:w-[380px]"
              >
                <NoticiaCard noticia={noticia} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores de página (dots) */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 pb-4">
          {Array.from({ length: totalPaginas }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToPage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === activeDot
                  ? 'w-8 bg-[var(--green)]'
                  : 'w-2 bg-[#525252] hover:bg-[#737373]'
                }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Link para ver todas las noticias */}
      <div className="border-t border-[#262626] p-4">
        <Link
          href={linkNoticiasCompleta}
          className="flex items-center justify-center gap-2 text-sm text-[var(--green)] hover:text-[var(--green)]/80 transition-colors font-medium"
        >
          Ver todas las noticias
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </BaseCard>
  );
};

// ============================================
// 🎨 MOCK DATA PARA TESTING
// ============================================

export const mockNoticias: Noticia[] = [
  {
    id_noticia: 1,
    titulo: 'Arranca la nueva temporada de la Copa Relámpago 2024',
    contenido: 'Con gran expectativa, comienza una nueva edición del torneo más emocionante de la región. Los equipos están listos para demostrar su mejor juego en la cancha.',
    contenido_preview: 'Comienza una nueva edición del torneo con equipos renovados y con grandes expectativas.',
    img_portada: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    fecha_creacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
    slug: 'arranca-nueva-temporada-2024',
    visitas: 245,
    destacada: true,
    publicada: true,
    tipoNoticia: {
      id_tipo_noticia: 1,
      nombre: 'Torneo'
    },
    categorias: []
  },
  {
    id_noticia: 2,
    titulo: 'Los Tigres FC se consagra campeón invicto',
    contenido: 'En una actuación histórica, Los Tigres FC logró ganar el torneo sin perder ningún partido, demostrando un nivel de juego excepcional durante toda la temporada.',
    contenido_preview: 'El equipo demostró un nivel excepcional y se lleva el título sin conocer la derrota.',
    img_portada: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
    fecha_creacion: new Date(Date.now() - 5 * 60 * 60 * 1000), // Hace 5 horas
    slug: 'tigres-fc-campeon-invicto',
    visitas: 512,
    destacada: false,
    publicada: true,
    tipoNoticia: {
      id_tipo_noticia: 2,
      nombre: 'Resultado'
    },
    categorias: []
  },
  {
    id_noticia: 3,
    titulo: 'Nueva sede para los próximos encuentros',
    contenido: 'La organización anunció que los próximos partidos se disputarán en el renovado Estadio Municipal, que cuenta con mejor iluminación y comodidades para los espectadores.',
    contenido_preview: 'Los partidos se mudarán al renovado Estadio Municipal con mejores instalaciones.',
    img_portada: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=800',
    fecha_creacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Hace 1 día
    slug: 'nueva-sede-estadio-municipal',
    visitas: 189,
    destacada: false,
    publicada: true,
    tipoNoticia: {
      id_tipo_noticia: 3,
      nombre: 'Comunicado'
    },
    categorias: []
  },
  {
    id_noticia: 4,
    titulo: 'Entrevista exclusiva con el goleador del torneo',
    contenido: 'Juan Pérez, máximo goleador con 15 tantos, nos cuenta sobre su experiencia en el torneo y sus objetivos para la próxima temporada.',
    contenido_preview: 'El máximo goleador comparte su experiencia y planes futuros en entrevista exclusiva.',
    img_portada: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    fecha_creacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 días
    slug: 'entrevista-juan-perez-goleador',
    visitas: 342,
    destacada: false,
    publicada: true,
    tipoNoticia: {
      id_tipo_noticia: 4,
      nombre: 'Entrevista'
    },
    categorias: []
  }
];

