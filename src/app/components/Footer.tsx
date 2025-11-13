import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, User, Mail, Youtube } from "lucide-react";
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Input';

const Footer: React.FC = () => {
    return (
        <footer
            id="footer"
            className="py-8 z-[100] flex justify-center items-center bottom-0 w-full bg-[var(--gray-500)]"
        >
            {/* Mobile Footer - Simple */}
            <div className="flex md:hidden w-full justify-center items-center px-8">
                <div className="text-center">
                    <h3 className="text-white text-lg font-semibold mb-1">
                        Copa Relámpago
                    </h3>
                    <p className="text-[#65656B] text-sm">
                        Versión 1.0.0
                    </p>
                </div>
            </div>

            {/* Desktop Footer - Complete */}
            <div className="hidden md:block w-full max-w-[1440px] mx-auto px-8 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1.5fr] md:grid-cols-1 gap-12 lg:gap-16 md:gap-6 w-full">

                    {/* COLUMNA 1: Logo y Call-to-Action */}
                    <div className="flex flex-col items-start gap-5">
                        <img
                            src="/Logos/isologo.png"
                            alt="Logo CR"
                            className="w-[120px] md:w-30"
                        />
                        <h3 className="text-2xl md:text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
                            Queres ser parte del mejor torneo de futbol 7 de Cordoba?
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Button variant="more">
                                Quiero ser parte
                            </Button>
                            <Button variant="default">
                                Saber mas
                            </Button>
                        </div>
                    </div>

                    {/* COLUMNA 2: Enlaces y Redes Sociales */}
                    <div className="flex flex-col gap-8">

                        {/* Navegación */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-white text-xl font-semibold">Navega</h2>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/"
                                    className="text-[#65656B] hover:text-[#2AD174] transition-colors duration-200 text-base"
                                >
                                    Inicio
                                </Link>
                                <Link
                                    href="/categorias"
                                    className="text-[#65656B] hover:text-[#2AD174] transition-colors duration-200 text-base"
                                >
                                    Categorias
                                </Link>
                                <Link
                                    href="/noticias"
                                    className="text-[#65656B] hover:text-[#2AD174] transition-colors duration-200 text-base"
                                >
                                    Noticias
                                </Link>
                            </div>
                        </div>

                        {/* Redes Sociales */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-white text-xl font-semibold">Nuestras redes</h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 cursor-pointer transition-colors duration-200 text-[#65656B] hover:text-[#2AD174]">
                                    <Instagram className="w-5 h-5" />
                                    <span>coparelampago</span>
                                </div>
                                <div className="flex items-center gap-3 cursor-pointer transition-colors duration-200 text-[#65656B] hover:text-[#2AD174]">
                                    <Facebook className="w-5 h-5" />
                                    <span>coparelampago</span>
                                </div>
                                <div className="flex items-center gap-3 cursor-pointer transition-colors duration-200 text-[#65656B] hover:text-[#2AD174]">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>+54 9 3518 18-2129</span>
                                </div>
                                <div className="flex items-center gap-3 cursor-pointer transition-colors duration-200 text-[#65656B] hover:text-[#2AD174]">
                                    <Youtube className="w-5 h-5" />
                                    <span>coparelampago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 3: Formulario de Contacto */}
                    <div className="flex flex-col gap-4 lg:col-span-1 md:col-span-1">
                        <h2 className="text-white text-xl font-semibold">Contacto</h2>
                        <form className="flex flex-col gap-4 w-full max-w-[350px] lg:max-w-full">
                            <Input
                                placeholder="Escriba su nombre"
                                name="nombre"
                                id="nombre"
                                icon={<User className="w-4 h-4" />}
                            />
                            <Input
                                placeholder="Indique su email"
                                name="email"
                                id="email"
                                type="email"
                                icon={<Mail className="w-4 h-4" />}
                            />
                            <Textarea
                                placeholder="Escriba su mensaje"
                                name="mensaje"
                                id="mensaje"
                                rows={4}
                            />
                            <Button variant="footer" fullWidth>
                                Enviar
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;