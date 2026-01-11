'use client';

import React from 'react';
import { TarjetaCredencial } from './TarjetaCredencial';
import { Credencial } from './types';

const MOCK_BASE: Omit<Credencial, 'id' | 'estado' | 'qrData'> = {
    jugador: {
        nombre: 'Lionel Andrés',
        apellido: 'Messi',
        dni: '23.456.789',
        fechaNacimiento: '1987-06-24',
        fotoUrl: 'https://images.unsplash.com/photo-1542352458-95855f866465?q=80&w=400&auto=format&fit=crop', // Placeholder image
    },
    equipo: {
        nombre: 'Inter Miami FC',
        categoria: 'Veteranos +35',
    },
    temporada: '2025',
    vencimiento: '2025-12-31',
};

const DEMO_DATA: Credencial[] = [
    {
        ...MOCK_BASE,
        id: 'UCFA-2025-001',
        estado: 'ACTIVA',
        qrData: 'https://ucfa.app/validate/UCFA-2025-001',
    },
    {
        ...MOCK_BASE,
        id: 'UCFA-2025-002',
        estado: 'VENCIDA',
        qrData: 'https://ucfa.app/validate/UCFA-2025-002',
        jugador: { ...MOCK_BASE.jugador, nombre: 'Diego', apellido: 'Maradona', fotoUrl: undefined }, // No photo
    },
    {
        ...MOCK_BASE,
        id: 'UCFA-2025-003',
        estado: 'REVOCADA',
        qrData: 'https://ucfa.app/validate/UCFA-2025-003',
        jugador: { ...MOCK_BASE.jugador, nombre: 'Mario', apellido: 'Kempes' },
    }
];

export const DemoCredenciales = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Credenciales Digitales UCFA</h1>
                <p className="text-gray-500">Sistema de identificación de jugadores - Temporada 2025</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
                {/* Caso 1: Activa */}
                <div className="space-y-4">
                    <h3 className="text-center font-mono text-sm text-gray-400 uppercase tracking-widest">Activa</h3>
                    <TarjetaCredencial credencial={DEMO_DATA[0]} />
                </div>

                {/* Caso 2: Vencida / Sin Foto */}
                <div className="space-y-4">
                    <h3 className="text-center font-mono text-sm text-gray-400 uppercase tracking-widest">Vencida (Sin Foto)</h3>
                    <TarjetaCredencial credencial={DEMO_DATA[1]} />
                </div>

                {/* Caso 3: Revocada */}
                <div className="space-y-4">
                    <h3 className="text-center font-mono text-sm text-gray-400 uppercase tracking-widest">Revocada</h3>
                    <TarjetaCredencial credencial={DEMO_DATA[2]} autoFlip={true} />
                </div>
            </div>

            <div className="mt-20 pt-10 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-400">Mobile Preview (Width constrained)</p>
                <div className="mt-8 mx-auto w-full max-w-[360px] border-[8px] border-gray-900 rounded-[3rem] p-4 bg-gray-100 shadow-2xl overflow-hidden relative h-[800px]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
                    <div className="h-full overflow-y-auto no-scrollbar py-12">
                        <TarjetaCredencial credencial={DEMO_DATA[0]} />
                        <div className="mt-8 px-4 text-center">
                            <p className="text-sm text-gray-500">Contenido adicional de la app...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
