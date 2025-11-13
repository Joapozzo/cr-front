import { Shield, User } from "lucide-react";

export const PlayerAvatar = ({ img, nombre }: { img: string | null; nombre: string }) => (
    <div className="w-10 h-10 rounded-lg bg-[var(--gray-400)] flex items-center justify-center flex-shrink-0 border border-[var(--gray-300)]">
        {img ? (
            <img src={img} alt={nombre} className="w-full h-full rounded-lg object-cover" />
        ) : (
            <User className="text-[var(--gray-100)]" size={20} />
        )}
    </div>
);

export const TeamAvatar = ({ img, nombre }: { img: string | null; nombre: string }) => (
    <div className="w-10 h-10 rounded-lg bg-[var(--gray-400)] flex items-center justify-center flex-shrink-0 border border-[var(--gray-300)]">
        {img ? (
            <img src={img} alt={nombre} className="w-8 h-8 rounded-full object-cover" />
        ) : (
            <Shield className="text-[var(--gray-100)]" size={20} />
        )}
    </div>
);