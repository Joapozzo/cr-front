// "use client";

// import React, { useState } from 'react';
// import { Newspaper, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react';
// import Image from 'next/image';
// import { useNoticias } from '../hooks/useNoticias';

// const CardNoticiasFeed: React.FC = () => {
//     const { data, isLoading } = useNoticias({ limit: 6 }); // Obtenemos 6 noticias
//     const noticias = data?.noticias || []; // Extraemos el array de noticias
//     const [expandido, setExpandido] = useState(false);
//     const [noticiaExpandida, setNoticiaExpandida] = useState<number | null>(null);

//     // Mostrar máximo 3 noticias inicialmente, todas si está expandido
//     const noticiasAMostrar = expandido ? noticias : noticias.slice(0, 3);

//     const formatearFecha = (fecha: Date) => {
//         const ahora = new Date();
//         const diferencia = ahora.getTime() - new Date(fecha).getTime();
//         const horas = Math.floor(diferencia / (1000 * 60 * 60));
//         const dias = Math.floor(horas / 24);

//         if (dias > 0) return `${dias}d`;
//         if (horas > 0) return `${horas}h`;
//         return 'ahora';
//     };

//     const truncarTexto = (texto: string, limite: number = 120) => {
//         return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
//     };

//     if (isLoading) {
//         return (
//             <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
//                 <div className="px-6 py-4 bg-[var(--black-800)]">
//                     <div className="h-5 bg-[var(--black-600)] rounded w-28 animate-pulse"></div>
//                 </div>
//                 <div className="p-6 space-y-4">
//                     {[1, 2, 3].map(i => (
//                         <div key={i} className="flex gap-3">
//                             <div className="w-16 h-16 bg-[var(--black-700)] rounded-lg animate-pulse"></div>
//                             <div className="flex-1 space-y-2">
//                                 <div className="h-4 bg-[var(--black-700)] rounded w-full animate-pulse"></div>
//                                 <div className="h-3 bg-[var(--black-700)] rounded w-3/4 animate-pulse"></div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     if (noticias.length === 0) {
//         return (
//             <div className="bg-[var(--black-900)] rounded-2xl p-6 text-center">
//                 <Newspaper className="mx-auto text-[var(--black-500)] mb-2" size={24} />
//                 <p className="text-[var(--black-400)] text-sm">No hay noticias disponibles</p>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
//                 <div className="flex items-center gap-2 text-sm">
//                     <Newspaper className="text-white" size={16} />
//                     <span className="text-white font-bold">Noticias</span>
//                     <span className="text-[var(--black-300)]">
//                         | {noticias.length} artículo{noticias.length !== 1 ? 's' : ''}
//                     </span>
//                 </div>

//                 {noticias.length > 3 && (
//                     <button
//                         onClick={() => setExpandido(!expandido)}
//                         className="flex items-center gap-1 text-[var(--black-400)] hover:text-white text-sm transition-colors"
//                     >
//                         {expandido ? 'Ver menos' : 'Ver más'}
//                         {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//                     </button>
//                 )}
//             </div>

//             {/* Feed de noticias */}
//             <div className="divide-y divide-[var(--black-700)]">
//                 {noticiasAMostrar.map((noticia, index) => {
//                     const esExpandida = noticiaExpandida === noticia.id_noticia;
//                     const esUltima = index === noticiasAMostrar.length - 1;

//                     return (
//                         <div
//                             key={noticia.id_noticia}
//                             className={`p-6 hover:bg-[var(--black-850)] transition-colors cursor-pointer ${
//                                 esUltima && !expandido ? 'rounded-b-2xl' : ''
//                             }`}
//                             onClick={() => setNoticiaExpandida(
//                                 esExpandida ? null : noticia.id_noticia
//                             )}
//                         >
//                             <div className="flex gap-4">
//                                 {/* Imagen */}
//                                 {noticia.img && (
//                                     <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--black-700)] flex-shrink-0">
//                                         <img
//                                             src={noticia.img}
//                                             alt={noticia.titulo}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                 )}

//                                 {/* Contenido */}
//                                 <div className="flex-1 min-w-0">
//                                     <h3 className="text-white font-medium mb-2 line-clamp-2 leading-tight">
//                                         {noticia.titulo}
//                                     </h3>

//                                     <p className="text-[var(--black-300)] text-sm mb-3 leading-relaxed">
//                                         {esExpandida ? noticia.contenido : truncarTexto(noticia.contenido)}
//                                     </p>

//                                     {/* Meta info */}
//                                     <div className="flex items-center gap-4 text-xs text-[var(--black-500)]">
//                                         <div className="flex items-center gap-1">
//                                             <Clock size={12} />
//                                             <span>{formatearFecha(noticia.fecha_creacion)}</span>
//                                         </div>

//                                         {noticia.autor && (
//                                             <span>
//                                                 por {noticia.autor.nombre} {noticia.autor.apellido}
//                                             </span>
//                                         )}
//                                     </div>

//                                     {/* Indicador de expansión */}
//                                     {noticia.contenido.length > 120 && (
//                                         <div className="mt-2">
//                                             <span className="text-blue-400 text-xs hover:text-blue-300">
//                                                 {esExpandida ? 'Ver menos' : 'Leer más'}
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Footer con expand */}
//             {noticias.length > 3 && !expandido && (
//                 <div className="px-6 py-3 bg-[var(--black-850)] border-t border-[var(--black-700)]">
//                     <button
//                         onClick={() => setExpandido(true)}
//                         className="w-full text-center text-[var(--black-400)] hover:text-white text-sm transition-colors"
//                     >
//                         Ver {noticias.length - 3} noticia{noticias.length - 3 !== 1 ? 's' : ''} más
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CardNoticiasFeed;