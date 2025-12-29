import { Shield, User } from "lucide-react";
import Image from 'next/image';

export const PlayerAvatar = ({ img, nombre }: { img: string | null; nombre: string }) => (
    <div className="w-10 h-10 rounded-lg bg-[var(--gray-400)] flex items-center justify-center flex-shrink-0 border border-[var(--gray-300)]">
        {img ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image src={img} alt={nombre} fill className="object-cover" />
            </div>
        ) : (
            <User className="text-[var(--gray-100)]" size={20} />
        )}
    </div>
);

export const TeamAvatar = ({ img, nombre }: { img: string | null; nombre: string }) => (
    <div className="w-10 h-10 rounded-lg bg-[var(--gray-400)] flex items-center justify-center flex-shrink-0 border border-[var(--gray-300)]">
        {img ? (
            <Image src={img} alt={nombre} width={32} height={32} className="rounded-full object-cover" />
        ) : (
            <Shield className="text-[var(--gray-100)]" size={20} />
        )}
    </div>
);