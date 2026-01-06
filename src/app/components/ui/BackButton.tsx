'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[var(--color-primary)] hover:opacity-70 transition-opacity mt-4"
        >
            <ArrowLeft size={20} />
            <span>Volver</span>
        </button>
    );
}