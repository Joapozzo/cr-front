import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { getWhatsAppLink } from '@/constants/contact';

const CTASection = () => {
    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-[var(--black)]">
            <div className="absolute inset-0 bg-[var(--green)]/10"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-[var(--white)] mb-6">
                    ¿Listo para demostrar tu nivel?
                </h2>
                <p className="text-xl text-[var(--gray-100)] mb-10 max-w-2xl mx-auto">
                    Sumate a la experiencia Copa Relámpago. Cupos limitados para el próximo torneo.
                </p>

                <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[var(--green)] hover:bg-[var(--green-win)] text-white font-bold text-xl px-10 py-5 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-[var(--green)]/20"
                >
                    <FaWhatsapp size={24} />
                    Inscribir mi Equipo
                </a>
            </div>
        </section>
    );
};

export default CTASection;
