'use client';

import { useState, useMemo } from 'react';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { FiltrosNoticias, OrdenNoticias } from '@/app/components/noticias/FiltrosNoticias';
import { NoticiaCardLista } from '@/app/components/noticias/NoticiaCardLista';
import { NoticiasListaSkeleton } from '@/app/components/skeletons/NoticiasListaSkeleton';
import { mockNoticias } from '@/app/components/home/NoticiasHome';


export default function NoticiasPage() {
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<OrdenNoticias>('fecha-desc');
  const [destacadas, setDestacadas] = useState(false);
  const [isLoading] = useState(false);

  // TODO: Usar hook real
  // const { data, isLoading } = useNoticiasPublicadas({
  //   busqueda,
  //   destacada: destacadas ? true : undefined,
  //   page: 1,
  //   limit: 20
  // });

  // Filtrar y ordenar noticias
  const noticiasFiltradas = useMemo(() => {
    let resultado = [...mockNoticias];

    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter(noticia =>
        noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        noticia.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
        noticia.contenido_preview?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por destacadas
    if (destacadas) {
      resultado = resultado.filter(noticia => noticia.destacada);
    }

    // Ordenar
    resultado.sort((a, b) => {
      switch (orden) {
        case 'fecha-desc':
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
        case 'fecha-asc':
          return new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime();
        case 'visitas-desc':
          return b.visitas - a.visitas;
        case 'visitas-asc':
          return a.visitas - b.visitas;
        default:
          return 0;
      }
    });

    return resultado;
  }, [busqueda, destacadas, orden]);

  return (
    <UserPageWrapper>
        <div className="space-y-6 w-full">
          {/* Título */}
          <div>
            <h1 className="text-white font-bold text-xl">Noticias</h1>
            <p className="text-[#737373] text-sm mt-1">
              Mantente informado con las últimas novedades
            </p>
          </div>

          {/* Filtros */}
          <FiltrosNoticias
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            orden={orden}
            onOrdenChange={setOrden}
            destacadas={destacadas}
            onDestacadasChange={setDestacadas}
            loading={isLoading}
          />

          {/* Contador de resultados */}
          {isLoading && (
            <div className="flex items-center justify-between w-full">
              <p className="text-[#737373] text-xs">
                {noticiasFiltradas.length} {noticiasFiltradas.length === 1 ? 'noticia' : 'noticias'}
                {busqueda && ` para "${busqueda}"`}
              </p>
            </div>
          )}

          {/* Lista de noticias */}
          {isLoading ? (
            <NoticiasListaSkeleton cantidad={3} />
          ) : noticiasFiltradas.length > 0 ? (
            <div className="space-y-4">
              {noticiasFiltradas.map((noticia) => (
                <NoticiaCardLista key={noticia.id_noticia} noticia={noticia} />
              ))}
            </div>
          ) : (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12 text-center">
              <p className="text-[#737373] text-sm">
                No se encontraron noticias
                {busqueda && ` que coincidan con "${busqueda}"`}
              </p>
            </div>
          )}
        </div>
    </UserPageWrapper>
  );
}

