import Footer from "../Footer";
import BottomNavigationPlanillero from "../MenuButtonPlanillero";
import NavbarPlanillero from "../NavbarPlanillero";

export default function PlanilleroLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#101011]">
            <NavbarPlanillero />
            <main className="flex-1 w-full max-w-[1400px] mx-auto">
                {children}
            </main>
            <BottomNavigationPlanillero/>
            <Footer />
        </div>
    );
}