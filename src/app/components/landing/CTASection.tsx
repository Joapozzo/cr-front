import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useWhatsApp } from '@/app/hooks/useWhatsApp';
import { Button } from '@/app/components/ui/Button';

const CTASection = () => {
    const { getWhatsAppLink } = useWhatsApp();
    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-[var(--black)]">
            <div className="absolute inset-0 bg-[var(--green)]/10"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-2xl md:text-5xl font-bold text-[var(--white)] mb-6">
                    ¿Listo para demostrar tu nivel?
                </h2>
                <p className="text-base md:text-xl text-[var(--gray-100)] mb-10 max-w-2xl mx-auto">
                    Sumate a la experiencia Copa Relámpago. Cupos limitados para el próximo torneo.
                </p>

                <div className="flex justify-center">
                    <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                        <Button variant="footer" size="md" className="gap-2 font-bold shadow-lg shadow-green-900/20 rounded-full px-8">
                            <FaWhatsapp size={20} />
                            Inscribir mi Equipo
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
