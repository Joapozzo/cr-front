'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { getWhatsAppLink } from '@/constants/contact';

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop"
                    alt="Cancha de fútbol"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            <div className="container mx-auto px-4 relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--white)] mb-6 tracking-tight">
                        Copa <span className="text-[var(--green)]">Relámpago</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--gray-100)] mb-8 max-w-2xl mx-auto font-light">
                        El mejor torneo de fútbol 7 de Córdoba. Pasión, competencia y profesionalismo en cada partido.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[var(--green)] hover:bg-[var(--green-win)] text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-green-900/20"
                        >
                            Empezá a Jugar <ArrowRight size={20} />
                        </a>
                        <a
                            href="#features"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium text-lg transition-all border border-white/10"
                        >
                            Conocer Más
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                >
                    {[
                        { label: 'Equipos', value: '+50' },
                        { label: 'Jugadores', value: '+600' },
                        { label: 'Premios', value: '$1M+' },
                        { label: 'Ediciones', value: '15' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-[var(--white)] mb-1">{stat.value}</div>
                            <div className="text-sm text-[var(--gray-100)] uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50"
            >
                <ChevronDown size={32} />
            </motion.div>
        </section>
    );
};

export default Hero;
