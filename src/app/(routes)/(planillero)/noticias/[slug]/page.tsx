'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNoticiaPorSlug } from '@/app/hooks/useNoticias';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { Clock, Eye, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { formatearFechaNoticia } from '@/app/utils/fechas';
import { NoticiaCardSkeleton2 } from '@/app/components/skeletons/NoticiaCardSkeleton';
import { tiptapJsonToHtml, sanitizeHtml } from '@/app/utils/tiptapToHtml';

interface NoticiaPageProps {
    params: Promise<{ slug: string }>;
}

export default function NoticiaPage({ params }: NoticiaPageProps) {
    const { slug } = use(params);
    const router = useRouter();
    const { data: noticia, isLoading, error } = useNoticiaPorSlug(slug);

    // Convertir contenido JSON de Tiptap a HTML sanitizado
    const [contenidoHtml, setContenidoHtml] = useState<string>('');

    useEffect(() => {
        if (!noticia?.contenido) {
            setContenidoHtml('');
            return;
        }

        try {
            // Intentar parsear como JSON (formato Tiptap)
            const parsed = typeof noticia.contenido === 'string'
                ? JSON.parse(noticia.contenido)
                : noticia.contenido;

            // Si es un objeto con estructura de Tiptap, convertir a HTML
            if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
                const html = tiptapJsonToHtml(parsed);
                // Re-sanitizar en el cliente para asegurar seguridad
                setContenidoHtml(sanitizeHtml(html));
            } else {
                // Si ya es HTML, solo sanitizar
                setContenidoHtml(sanitizeHtml(noticia.contenido));
            }
        } catch {
            // Si no es JSON válido, asumir que es HTML y sanitizar
            setContenidoHtml(sanitizeHtml(noticia.contenido));
        }
    }, [noticia?.contenido]);

    if (isLoading) {
        return (
            <UserPageWrapper>
                <div className="w-full space-y-6">
                    <NoticiaCardSkeleton2 />
                </div>
            </UserPageWrapper>
        );
    }

    if (error || !noticia) {
        return (
            <UserPageWrapper>
                <div className="w-full space-y-6">
                    <div className="bg-[var(--black-900)] border border-red-500/20 rounded-xl p-12 text-center">
                        <p className="text-red-400 text-sm">
                            {error?.message || 'Noticia no encontrada'}
                        </p>
                        <button
                            onClick={() => router.back()}
                            className="mt-4 inline-flex items-center gap-2 text-[var(--green)] hover:text-[var(--green)]/80 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Volver
                        </button>
                    </div>
                </div>
            </UserPageWrapper>
        );
    }

    return (
        <UserPageWrapper>
            <div className="w-full space-y-6">
                {/* Botón volver */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-[#737373] hover:text-white transition-colors text-sm"
                >
                    <ArrowLeft size={16} />
                    Volver
                </button>

                {/* Contenedor de la noticia */}
                <article className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
                    {/* Imagen de portada */}
                    {noticia.img_portada && (
                        <div className="relative h-64 sm:h-96 bg-[#262626] overflow-hidden">
                            <Image
                                src={noticia.img_portada}
                                alt={noticia.titulo}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Contenido */}
                    <div className="p-6 sm:p-8">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-4">
                            {noticia.tipoNoticia && (
                                <span className="px-3 py-1 text-xs font-semibold rounded-md bg-[var(--green)]/90 text-white">
                                    {noticia.tipoNoticia.nombre}
                                </span>
                            )}
                            {noticia.destacada && (
                                <span className="px-3 py-1 text-xs font-semibold rounded-md bg-yellow-500/90 text-white">
                                    ⭐ Destacada
                                </span>
                            )}
                        </div>

                        {/* Título */}
                        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-4">
                            {noticia.titulo}
                        </h1>

                        {/* Meta información */}
                        <div className="flex items-center gap-4 text-sm text-[#737373] mb-6 pb-6 border-b border-[#262626]">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{formatearFechaNoticia(noticia.fecha_creacion)}</span>
                            </div>
                            {noticia.visitas > 0 && (
                                <div className="flex items-center gap-1">
                                    <Eye size={14} />
                                    <span>{noticia.visitas} visitas</span>
                                </div>
                            )}
                        </div>

                        {/* Contenido */}
                        <div
                            className="prose prose-invert max-w-none text-white prose-headings:text-white prose-p:text-[#e5e5e5] prose-strong:text-white prose-a:text-[var(--green)] prose-a:hover:text-[var(--green)]/80"
                            dangerouslySetInnerHTML={{ __html: contenidoHtml }}
                        />
                    </div>
                </article>
            </div>
        </UserPageWrapper>
    );
}
