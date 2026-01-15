import Link from 'next/link';
import { MdMarkEmailRead } from 'react-icons/md';
import { FaAngleRight } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmailVerificationViewProps {
    email: string;
    isPendingVerificacion: boolean;
    isPendingReenvio: boolean;
    onVerificar: () => void;
    onReenviar: () => void;
}

export const EmailVerificationView = ({
    email,
    isPendingVerificacion,
    isPendingReenvio,
    onVerificar,
    onReenviar,
}: EmailVerificationViewProps) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Icono y mensaje */}
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <MdMarkEmailRead size={32} className="text-[var(--color-primary)]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        Verifica tu email
                    </h3>
                    <p className="text-sm text-[var(--gray-200)]">
                        Por favor, revisa tu bandeja de entrada/spam y haz clic en el enlace de verificación.
                    </p>
                    <p className="text-sm text-[var(--gray-200)]">
                        Hemos enviado un email de verificación a:
                    </p>
                    <p className="text-sm font-medium text-[var(--color-primary)] mt-1">
                        {email}
                    </p>
                </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-[var(--gray-400)] rounded-lg p-4">
                <p className="text-xs text-[var(--gray-200)] leading-relaxed">
                    Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.
                    Una vez verificado, presiona el botón de abajo para continuar.
                </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3">
                <Button
                    onClick={onVerificar}
                    disabled={isPendingVerificacion}
                    className="flex items-center justify-center gap-2 w-full"
                >
                    {isPendingVerificacion ? (
                        <>
                            Verificando <Loader2 className="animate-spin w-4 h-4" />
                        </>
                    ) : (
                        <>
                            Ya verifiqué mi email <FaAngleRight />
                        </>
                    )}
                </Button>

                <Button
                    onClick={onReenviar}
                    disabled={isPendingReenvio}
                    variant="secondary"
                    className="flex items-center justify-center gap-2 w-full"
                >
                    {isPendingReenvio ? (
                        <>
                            Reenviando <Loader2 className="animate-spin w-4 h-4" />
                        </>
                    ) : (
                        'Reenviar email de verificación'
                    )}
                </Button>
            </div>

            {/* Link a login */}
            <div className="flex justify-center pt-2">
                <Link
                    href="/login"
                    className="text-sm text-[var(--gray-200)] hover:text-[var(--color-primary)] transition-colors"
                >
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
};

