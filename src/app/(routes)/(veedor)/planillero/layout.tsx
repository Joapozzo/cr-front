"use client"
import PlanilleroLayout from "@/app/components/layouts/PlanilleroLayout";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <PlanilleroLayout>
                {children}
            </PlanilleroLayout>
        </>
    )
}

export default Layout