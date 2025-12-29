'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { getWhatsAppLink } from '@/constants/contact';
import { Button } from '@/app/components/ui/Button';

import Image from 'next/image';

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop"
                    alt="Cancha de fútbol"
                    fill
                    className="object-cover"
                    priority
                />
            </motion.div>

            <div className="container mx-auto px-4 relative z-20 text-center flex flex-col items-center justify-end py-32 h-full md:justify-center md:pb-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-7xl font-extrabold text-[var(--white)] mb-6 tracking-tight">
                        Copa <span className="text-[var(--green)]">Relámpago</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-[var(--gray-100)] mb-8 max-w-2xl mx-auto font-light">
                        El mejor torneo de fútbol 7 de Córdoba. Pasión, competencia y profesionalismo en cada partido.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full md:w-auto">
                        <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                            <Button variant="footer" size="md" className="gap-2 font-bold shadow-lg shadow-green-900/20 rounded-full w-full md:w-auto md:px-8 md:py-4 md:text-lg">
                                Empezá a Jugar <ArrowRight size={20} />
                            </Button>
                        </a>
                        <a href="#features" className="w-full md:w-auto">
                            <Button variant="ghost" size="md" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/10 rounded-full w-full md:w-auto md:px-8 md:py-4 md:text-lg">
                                Conocer Más
                            </Button>
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
                            <div className="text-2xl md:text-4xl font-bold text-[var(--white)] mb-1">{stat.value}</div>
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
