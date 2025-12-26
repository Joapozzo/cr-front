'use client';

import BottomNavigation from "../MenuButton";
import Navbar from "../Navbar";
import { useValidateUserState } from '@/app/hooks/auth/useValidateUserState';
import { useAuth } from '@/app/hooks/auth/useAuth';
import { useEquiposUsuario } from '@/app/hooks/useEquiposUsuario';
import { useJugadorUsuario } from '@/app/hooks/useJugadorUsuario';
import { EdicionCategoriaProvider } from '@/app/contexts/EdicionCategoriaContext';


export default function UserLayout({ children }: { children: React.ReactNode }) {
    // 🔒 Requerir autenticación para acceder a estas rutas
    // Nota: La protección por rol se hace en el layout padre (routes)/(planillero)/layout.tsx
    useAuth({ requireAuth: true });
    
    // ✅ Validar estado del usuario y redirigir si es necesario
    useValidateUserState();

    // 📦 Cargar jugador del usuario y setearlo en el playerStore
    useJugadorUsuario();

    // 📦 Cargar equipos del usuario y setearlos en el playerStore
    useEquiposUsuario();

    return (
        <EdicionCategoriaProvider>
            <div className="flex flex-col min-h-screen w-full mb-20">
                <Navbar />
                <main className="flex-1 w-full mx-auto">
                    {children}
                </main>
                <BottomNavigation/>
                {/* <Footer /> */}
            </div>
        </EdicionCategoriaProvider>
    );
}