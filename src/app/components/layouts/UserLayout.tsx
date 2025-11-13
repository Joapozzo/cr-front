'use client';

// import Footer from "../Footer";
import BottomNavigation from "../MenuButton";
import Navbar from "../Navbar";


export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <main className="flex-1 w-full mx-auto">
                {children}
            </main>
            <BottomNavigation/>
            {/* <Footer /> */}
        </div>
    );
}