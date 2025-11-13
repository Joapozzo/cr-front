"use client"
import UserLayout from "@/app/components/layouts/UserLayout";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <UserLayout>
            {children}
        </UserLayout>
    )
}

export default Layout