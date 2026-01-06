'use client';

import React from 'react';
import { Trophy, Zap, BarChart2, MapPin, Users, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenant } from '@/app/contexts/TenantContext';

const features = [
    {
        icon: <Trophy className="w-8 h-8 text-[var(--yellow)]" />,
        title: 'Formato Profesional',
        description: 'Sistema de liguilla + playoffs para garantizar la máxima competitividad y emoción.'
    },
    {
        icon: <Zap className="w-8 h-8 text-[var(--color-primary)]" />,
        title: 'Gestión Digital',
        description: 'Todo el torneo en tu celular. Fixture, resultados y tablas actualizadas al instante.'
    },
    {
        icon: <BarChart2 className="w-8 h-8 text-[var(--blue-500)]" />,
        title: 'Estadísticas Completas',
        description: 'Seguimiento detallado de goleadores, asistencias y vallas invictas.'
    },
    {
        icon: <MapPin className="w-8 h-8 text-[var(--color-secondary)]" />,
        title: 'Complejo Premium',
        description: 'Jugamos en Complejo Elenia, las mejores canchas de sintético de Córdoba.'
    },
    {
        icon: <Users className="w-8 h-8 text-[var(--purple-500)]" />,
        title: 'Categorías para Todos',
        description: 'Torneos Libres, Sub-19 y Femenino. Hay un lugar para tu equipo.'
    },
    {
        icon: <Smartphone className="w-8 h-8 text-[var(--orange-500)]" />,
        title: 'Seguimiento en Vivo',
        description: 'Viví el minuto a minuto de cada partido desde nuestra plataforma web.'
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Features = () => {
    const tenant = useTenant();
    
    return (
        <section id="features" className="py-20 bg-[var(--black-950)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-5xl font-bold text-[var(--white)] mb-4">
                        Por qué elegir <span className="text-[var(--color-primary)]">{tenant.nombre_empresa}</span>
                    </h2>
                    <p className="text-[var(--gray-100)] max-w-2xl mx-auto text-base md:text-lg">
                        Llevamos la experiencia del fútbol amateur al siguiente nivel con tecnología y organización de primera.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="bg-[var(--black-900)] p-5 md:p-8 rounded-2xl border border-[var(--black-800)] hover:border-[var(--color-primary)]/30 transition-all hover:bg-[var(--black-800)] group"
                        >
                            <div className="mb-6 p-4 bg-[var(--black-800)] rounded-xl inline-block group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-[var(--white)] mb-3">{feature.title}</h3>
                            <p className="text-[var(--gray-100)] leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
