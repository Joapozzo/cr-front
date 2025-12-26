'use client';

import CajeroSideBar from "@/app/components/CajeroSideBar";
import Breadcrumb from "@/app/components/ui/Breadcrumb";
import { useAuth } from "@/app/hooks/auth/useAuth";

export default function CajeroLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 🔒 Proteger ruta: ADMIN y CAJERO pueden acceder
    useAuth({ 
        requireAuth: true, 
        requireRole: ['ADMIN', 'CAJERO'] 
    });

    return (
        <div className="flex h-screen bg-[var(--black-950)] text-white">
            {/* Sidebar */}
            <CajeroSideBar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Contenido principal */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {/* Breadcrumb */}
                    <Breadcrumb basePath="/cajero/dashboard" baseLabel="Dashboard" />
                    
                    {/* Children */}
                    {children}
                </main>
            </div>
        </div>
    );
}

