'use client';

import React from 'react';
import { Button } from './ui/Button';
import { getWhatsAppLink } from '@/constants/contact';
import { useTenant } from '@/app/contexts/TenantContext';

const Hero: React.FC = () => {
    const tenant = useTenant();
    
    return (
        <div
            className="w-full flex justify-center bg-cover bg-top bg-no-repeat relative"
            style={{
                backgroundImage: `url(${tenant.branding.logo_principal.replace('.png', '-hero.jpg')})`
            }}
        >
            {/* Overlay gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[var(--black-950-rgba)] to-[rgba(13,13,13,0.45)]"></div>

            <div className="w-full max-w-screen-xl px-8 pt-32 pb-16 md:py-[100px] z-[2]">
                <div className="w-full md:w-[50%] flex flex-col gap-5">
                    <h2 className="font-bold text-xl sm:text-2xl md:text-4xl uppercase text-white">
                        ¡No TE pierdas la oportunidad de jugar en el{' '}
                        <span className="font-bold text-[var(--color-primary)]">mejor torneo</span>{' '}
                        de F7 de Córdoba!
                    </h2>
                    <p className="text-white text-sm md:text-base">
                        Contamos con un equipo de trabajo para brindarte esa experiencia que necesitas en un torneo de futbol.
                    </p>
                    <div className="flex gap-4">
                        <a href={getWhatsAppLink(undefined, tenant.nombre_empresa)} target="_blank" rel="noopener noreferrer">
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