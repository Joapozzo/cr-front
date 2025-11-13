import React from 'react';

const Hero: React.FC = () => {
    return (
        <div 
            className="w-full flex justify-center bg-cover bg-top bg-no-repeat relative"
            style={{
                backgroundImage: 'url(https://coparelampago.com/uploads/CR/img_hero.jpg)'
            }}
        >
            {/* Overlay gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[var(--black-950-rgba)] to-[rgba(13,13,13,0.45)]"></div>
            
            <div className="w-full max-w-screen-xl px-8 py-[170px] md:py-[100px] z-[2]">
                <div className="w-[60%] md:w-[60%] md:w-[50%] flex flex-col gap-5">
                    <h2 className="font-bold text-2xl md:text-2xl sm:text-3xl lg:text-3xl xl:text-4xl uppercase text-white">
                        ¡No TE pierdas la oportunidad de jugar en el{' '}
                        <span className="font-bold text-[var(--green)]">mejor torneo</span>{' '}
                        de F7 de Córdoba!
                    </h2>
                    <p className="text-white">
                        Contamos con un equipo de trabajo para brindarte esa experiencia que necesitas en un torneo de futbol.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Hero;