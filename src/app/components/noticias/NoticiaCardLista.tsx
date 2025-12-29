'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Noticia } from '@/app/types/noticia';
import { Newspaper, Eye, Clock } from 'lucide-react';
import { formatearFechaNoticia } from '@/app/utils/fechas';

interface NoticiaCardListaProps {
  noticia: Noticia;
}

export const NoticiaCardLista: React.FC<NoticiaCardListaProps> = ({ noticia }) => {
  const truncarTexto = (texto: string, limite: number = 120) => {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  };

  return (
    <Link
      href={`/noticias/${noticia.slug || noticia.id_noticia}`}
      className="block group"
    >
      <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden hover:border-[var(--green)] transition-all duration-300 h-full">
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
          {/* Imagen */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-[#262626] overflow-hidden flex-shrink-0">
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

            {/* Badge tipo noticia y destacada */}
            <div className="absolute top-2 left-2 flex gap-2">
              {noticia.tipoNoticia && (
                <span className="px-2 py-1 text-[10px] font-semibold rounded-md bg-[var(--green)]/90 text-white backdrop-blur-sm">
                  {noticia.tipoNoticia.nombre}
                </span>
              )}
              {noticia.destacada && (
                <span className="px-2 py-1 text-[10px] font-semibold rounded-md bg-yellow-500/90 text-black backdrop-blur-sm">
                  ⭐ Destacada
                </span>
              )}
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            {/* Título y descripción */}
            <div className="space-y-2">
              <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-[var(--green)] transition-colors">
                {noticia.titulo}
              </h3>

              {(noticia.contenido_preview || noticia.contenido) && (
                <p className="text-[#737373] text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                  {truncarTexto(noticia.contenido_preview || noticia.contenido, 150)}
                </p>
              )}
            </div>

            {/* Footer con metadata */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#262626]">
              <div className="flex items-center gap-3 text-[#737373] text-[10px] sm:text-xs">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatearFechaNoticia(noticia.fecha_creacion)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{noticia.visitas || 0}</span>
                </div>
              </div>

              {/* Botón "Leer más" */}
              <span className="text-[var(--green)] text-xs font-medium group-hover:underline">
                Leer más →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

