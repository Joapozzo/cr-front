import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

// Importación dinámica de DOMPurify para evitar problemas en SSR
let DOMPurify: any = null;
if (typeof window !== 'undefined') {
    DOMPurify = require('dompurify');
}

/**
 * Convierte JSON de Tiptap a HTML sanitizado
 * @param jsonContent - Contenido en formato JSON de Tiptap (string o objeto)
 * @returns HTML sanitizado y seguro para renderizar
 */
export const tiptapJsonToHtml = (jsonContent: string | object): string => {
    try {
        // Si es string, parsearlo a objeto
        const json = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
        
        // Validar que tenga la estructura de Tiptap
        if (!json || typeof json !== 'object' || json.type !== 'doc') {
            throw new Error('No es un documento válido de Tiptap');
        }
        
        // Generar HTML desde el JSON usando las mismas extensiones que el editor
        const html = generateHTML(json, [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ]);

        // Sanitizar el HTML para prevenir XSS
        // En el navegador, DOMPurify funciona directamente
        if (typeof window !== 'undefined' && DOMPurify) {
            return DOMPurify.sanitize(html, {
                ALLOWED_TAGS: [
                    'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'div', 'span'
                ],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel'],
                ALLOW_DATA_ATTR: false,
            });
        }

        // En SSR, retornar HTML sin sanitizar (se sanitizará en el cliente con useEffect)
        return html;
    } catch (error) {
        console.error('Error al convertir Tiptap JSON a HTML:', error);
        return '<p>Error al cargar el contenido</p>';
    }
};

/**
 * Sanitiza HTML directamente (útil para contenido que ya viene en HTML)
 * @param html - HTML a sanitizar
 * @returns HTML sanitizado
 */
export const sanitizeHtml = (html: string): string => {
    if (typeof window === 'undefined' || !DOMPurify) {
        return html; // En SSR, retornar sin sanitizar (se sanitizará en el cliente)
    }

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
    });
};

