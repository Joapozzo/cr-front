'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
    content,
    onChange,
    placeholder = 'Escribe el contenido de la noticia...'
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(JSON.stringify(editor.getJSON()));
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-[var(--gray-200)] rounded-lg overflow-hidden bg-[var(--gray-300)]">
            {/* Toolbar */}
            <div className="bg-[var(--gray-400)] border-b border-[var(--gray-200)] p-2 flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive('bold')
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive('italic')
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive('strike')
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    <s>S</s>
                </button>

                <div className="w-px bg-[var(--gray-200)] mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive('heading', { level: 1 })
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive('heading', { level: 2 })
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive('heading', { level: 3 })
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    H3
                </button>

                <div className="w-px bg-[var(--gray-200)] mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive('bulletList')
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    • Lista
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive('orderedList')
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    1. Lista
                </button>

                <div className="w-px bg-[var(--gray-200)] mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive({ textAlign: 'left' })
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    ⬅
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive({ textAlign: 'center' })
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    ⬌
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`px-3 py-1.5 rounded transition-colors text-[var(--white)] ${
                        editor.isActive({ textAlign: 'right' })
                            ? 'bg-[var(--green)] hover:bg-[var(--green-win)]'
                            : 'bg-[var(--gray-300)] hover:bg-[var(--gray-200)]'
                    }`}
                >
                    ➡
                </button>
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none p-4 min-h-[400px] focus:outline-none text-[var(--white)]"
            />
        </div>
    );
};