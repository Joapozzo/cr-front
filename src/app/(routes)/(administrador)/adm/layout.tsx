import Sidebar from "@/app/components/SideBar"; 

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[var(--black-950)] text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header opcional */}
                {/* <header className="shadow-sm border-b border-[var(--black-900)] px-6 py-4">
                    <h1 className="text-2xl font-semibold text-white">Panel de Administración</h1>
                </header> */}

                {/* Contenido principal */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}