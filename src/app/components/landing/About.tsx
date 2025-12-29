'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Image from 'next/image';

const About = () => {
    return (
        <section id="about" className="py-20 bg-[var(--black)] overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-[var(--green)]/20 rounded-3xl blur-xl"></div>
                            <Image
                                src="https://images.unsplash.com/photo-1517466787929-bc90951d64b8?q=80&w=1935&auto=format&fit=crop"
                                alt="Jugadores de Copa Relámpago"
                                width={800}
                                height={450}
                                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-video"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-[var(--black-900)] p-6 rounded-xl border border-[var(--black-800)] shadow-xl hidden md:block">
                                <p className="text-4xl font-bold text-[var(--green)] mb-1">2016</p>
                                <p className="text-sm text-[var(--gray-100)] uppercase tracking-wider">Año de inicio</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-2xl md:text-5xl font-bold text-[var(--white)] mb-6">
                            Más que un torneo, <br />
                            <span className="text-[var(--green)]">una comunidad</span>
                        </h2>
                        <p className="text-[var(--gray-100)] text-base md:text-lg mb-6 leading-relaxed">
                            Desde 2016, Copa Relámpago ha sido el punto de encuentro para los amantes del fútbol en Córdoba. Lo que empezó como un pequeño torneo de amigos, hoy es una de las ligas más competitivas y organizadas de la ciudad.
                        </p>
                        <p className="text-[var(--gray-100)] text-base md:text-lg mb-8 leading-relaxed">
                            Nuestra misión es brindar una experiencia profesional al jugador amateur. Canchas impecables, arbitraje de nivel, y una organización que está en cada detalle para que vos solo te preocupes por jugar.
                        </p>

                        <div className="border-l-4 border-[var(--green)] pl-6 py-2 bg-[var(--black-900)]/50 rounded-r-lg">
                            <p className="text-[var(--gray-100)] italic">
                                &quot;La organización es impecable y el ambiente es excelente. Es el mejor lugar para venir a jugar con amigos y competir en serio.&quot;
                            </p>
                            <p className="text-[var(--green)] font-bold mt-2 text-sm">— Martín G., Capitán de &quot;Los Pibes FC&quot;</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
