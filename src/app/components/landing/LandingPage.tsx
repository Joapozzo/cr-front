import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import About from './About';
import CTASection from './CTASection';
import Footer from './Footer';

import FloatingWhatsApp from './FloatingWhatsApp';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-[var(--color-primary-500)] selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <About />
                <CTASection />
            </main>
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default LandingPage;
