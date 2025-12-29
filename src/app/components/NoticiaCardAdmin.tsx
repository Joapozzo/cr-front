import { UseMutationResult } from "@tanstack/react-query";
import { Noticia } from "../types/noticia";
import { Button } from "./ui/Button";
import Image from 'next/image';

interface CardNoticiaAdminProps {
    noticia: Noticia;
    handleEdit: (noticia: Noticia) => void;
    handleTogglePublish: (id: number) => void;
    handleDelete: (noticia: Noticia) => void;
    toggleMutation: UseMutationResult<Noticia, Error, number>;
}

const CardNoticiaAdmin = ({ noticia, handleEdit, handleTogglePublish, handleDelete, toggleMutation }: CardNoticiaAdminProps) => {

    const getBadgeClasses = (publicada?: boolean) => {
        return publicada
            ? 'px-2 py-1 text-xs rounded bg-[var(--green)]/20 text-[var(--green)]'
            : 'px-2 py-1 text-xs rounded bg-[var(--gray-300)] text-[var(--gray-100)]';
    };

    return (
        <div key={noticia.id_noticia} className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden hover:border-[var(--green)] transition-colors">
            {/* Imagen */}
            <div className="relative h-48 bg-[var(--gray-300)]">
                {(noticia.img_portada || noticia.img) ? (
                    <Image
                        src={noticia.img_portada || noticia.img || ''}
                        alt={noticia.titulo}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-[var(--gray-100)]">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                    {noticia.destacada && (
                        <span className="px-2 py-1 text-xs rounded bg-[var(--orange)]/20 text-[var(--orange)]">
                            Destacada
                        </span>
                    )}
                    <span className={getBadgeClasses(noticia.publicada)}>
                        {noticia.publicada ? 'Publicada' : 'Borrador'}
                    </span>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs rounded bg-[var(--blue)]/20 text-[var(--blue)]">
                        {noticia.tipoNoticia?.nombre || 'Sin tipo'}
                    </span>
                    <span className="text-xs text-[var(--gray-100)]">
                        {new Date(noticia.fecha_creacion).toLocaleDateString('es-AR')}
                    </span>
                </div>

                <h3 className="font-semibold text-lg text-[var(--white)] mb-2 line-clamp-2">
                    {noticia.titulo}
                </h3>

                <p className="text-sm text-[var(--gray-100)] mb-3 line-clamp-2">
                    {noticia.contenido_preview || noticia.contenido.substring(0, 100)}
                </p>

                <div className="flex items-center gap-2 text-xs text-[var(--gray-100)] mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{noticia.visitas || 0} visitas</span>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleEdit(noticia)}
                        className="flex-1"
                    >
                        Editar
                    </Button>
                    <Button
                        size="sm"
                        variant={noticia.publicada ? 'default' : 'success'}
                        onClick={() => handleTogglePublish(noticia.id_noticia)}
                        disabled={toggleMutation.isPending}
                    >
                        {noticia.publicada ? 'Ocultar' : 'Publicar'}
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(noticia)}
                    >
                        Eliminar
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CardNoticiaAdmin;