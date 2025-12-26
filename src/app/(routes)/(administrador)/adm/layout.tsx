'use client';

import Sidebar from "@/app/components/SideBar";
import { useAuth } from "@/app/hooks/auth/useAuth";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useAuth({ 
        requireAuth: true, 
        requireRole: 'ADMIN' 
    });

    return (
        <div className="flex h-screen bg-[var(--black-950)] text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Contenido principal */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}