"use client"
import PlanilleroLayout from "@/app/components/layouts/PlanilleroLayout";
import { useAuth } from "@/app/hooks/auth/useAuth";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    // 🔒 Proteger ruta: solo PLANILLERO puede acceder
    useAuth({ 
        requireAuth: true, 
        requireRole: 'PLANILLERO' 
    });

    return (
        <>
            <PlanilleroLayout>
                {children}
            </PlanilleroLayout>
        </>
    )
}

export default Layout