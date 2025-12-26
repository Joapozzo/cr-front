"use client"
import UserLayout from "@/app/components/layouts/UserLayout";
import { useAuth } from "@/app/hooks/auth/useAuth";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    // 🔒 Proteger ruta: solo USER (jugador/capitán) puede acceder
    useAuth({ 
        requireAuth: true, 
        requireRole: 'USER' 
    });

    return (
        <UserLayout>
            {children}
        </UserLayout>
    )
}

export default Layout