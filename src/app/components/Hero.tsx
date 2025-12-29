import React from 'react';
import { Button } from './ui/Button';
import { getWhatsAppLink } from '@/constants/contact';

const Hero: React.FC = () => {
    return (
        <div
            className="w-full flex justify-center bg-cover bg-top bg-no-repeat relative"
            style={{
                backgroundImage: 'url(/logos/hero.jpg)'
            }}
        >
            {/* Overlay gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[var(--black-950-rgba)] to-[rgba(13,13,13,0.45)]"></div>

            <div className="w-full max-w-screen-xl px-8 pt-32 pb-16 md:py-[100px] z-[2]">
                <div className="w-full md:w-[50%] flex flex-col gap-5">
                    <h2 className="font-bold text-xl sm:text-2xl md:text-4xl uppercase text-white">
                        ¡No TE pierdas la oportunidad de jugar en el{' '}
                        <span className="font-bold text-[var(--green)]">mejor torneo</span>{' '}
                        de F7 de Córdoba!
                    </h2>
                    <p className="text-white text-sm md:text-base">
                        Contamos con un equipo de trabajo para brindarte esa experiencia que necesitas en un torneo de futbol.
                    </p>
                    <div className="flex gap-4">
                        <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                            <Button variant="footer" size="lg">
                                Empezá a Jugar
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;