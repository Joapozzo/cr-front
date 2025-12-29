import React from 'react';
import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-[var(--black)] border-t border-[var(--black-900)] pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logos/isologo.png"
                                alt="Copa Relámpago"
                                width={40}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </Link>
                        <p className="text-[var(--gray-100)] text-sm leading-relaxed">
                            El torneo de fútbol 7 más emocionante de Córdoba. Organización profesional, estadísticas en tiempo real y la mejor comunidad.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[var(--white)] font-bold mb-6">Enlaces Rápidos</h3>
                        <ul className="space-y-3">
                            <li><Link href="#features" className="text-[var(--gray-100)] hover:text-[var(--green)] transition-colors text-sm">Características</Link></li>
                            <li><Link href="#about" className="text-[var(--gray-100)] hover:text-[var(--green)] transition-colors text-sm">Nosotros</Link></li>
                            <li><Link href="/login" className="text-[var(--gray-100)] hover:text-[var(--green)] transition-colors text-sm">Iniciar Sesión</Link></li>
                            <li><Link href="/registro" className="text-[var(--gray-100)] hover:text-[var(--green)] transition-colors text-sm">Registrarse</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-[var(--white)] font-bold mb-6">Seguinos</h3>
                        <div className="flex gap-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-[var(--black-900)] p-3 rounded-full text-[var(--gray-100)] hover:text-white hover:bg-[var(--green)] transition-all">
                                <FaInstagram size={20} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-[var(--black-900)] p-3 rounded-full text-[var(--gray-100)] hover:text-white hover:bg-[var(--blue-600)] transition-all">
                                <FaFacebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-[var(--white)] font-bold mb-6">Contacto</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-[var(--gray-100)] text-sm">
                                <MapPin size={18} className="text-[var(--green)] shrink-0 mt-1" />
                                <span>Complejo Elenia, Córdoba, Argentina</span>
                            </li>
                            <li className="flex items-center gap-3 text-[var(--gray-100)] text-sm">
                                <Mail size={18} className="text-[var(--green)] shrink-0" />
                                <span>contacto@coparelampago.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--black-900)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[var(--gray-200)] text-sm">
                        © {new Date().getFullYear()} Copa Relámpago. Todos los derechos reservados.
                    </p>
                    <p className="text-[var(--gray-200)] text-xs">
                        Diseñado y Desarrollado por amor al fútbol.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
