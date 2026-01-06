'use client';

import { useState } from 'react';
import BaseModal from '../modals/ModalPlanillero';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';

interface QRModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrData: string;
    monto: number;
    equipo: string;
}

export default function QRModal({ isOpen, onClose, qrData, monto, equipo }: QRModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(qrData);
        setCopied(true);
        toast.success('Código QR copiado al portapapeles');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Pagar con MercadoPago"
        >
            <div className="space-y-6">
                {/* Información del pago */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <div className="text-center">
                        <p className="text-sm text-[var(--gray-100)] mb-1">Equipo</p>
                        <p className="text-lg font-semibold text-white mb-4">{equipo}</p>
                        <p className="text-sm text-[var(--gray-100)] mb-1">Monto a Pagar</p>
                        <p className="text-2xl font-bold text-[var(--color-primary)]">${monto.toLocaleString('es-AR')}</p>
                    </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                    {qrData ? (
                        <div className="text-center space-y-4">
                            <div className="bg-white p-4 rounded-lg inline-block">
                                <QRCode
                                    value={qrData}
                                    size={256}
                                    level="H"
                                />
                            </div>
                            <p className="text-xs text-[var(--gray-100)]">
                                Escanea el código con la app de MercadoPago
                            </p>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 mx-auto px-4 py-2 bg-[var(--color-primary)] hover:bg-green-300 text-white rounded-lg transition-colors text-sm"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copiado
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copiar Código
                                    </>
                                )}
                            </button>
                        </div>
                    ) : null}
                </div>

                {/* Instrucciones */}
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-sm text-blue-400 mb-2 font-medium">Instrucciones:</p>
                    <ol className="text-xs text-blue-300 space-y-1 list-decimal list-inside">
                        <li>Abre la app de MercadoPago en tu celular</li>
                        <li>Selecciona &ldquo;Pagar&rdquo; y luego &ldquo;Pagar con QR&rdquo;</li>
                        <li>Escanea el código QR mostrado arriba</li>
                        <li>Confirma el pago en la app</li>
                        <li>El pago se procesará automáticamente</li>
                    </ol>
                </div>

                <Button
                    variant="footer"
                    onClick={onClose}
                    fullWidth
                >
                    Cerrar
                </Button>
            </div>
        </BaseModal>
    );
}

