"use client";
import React from 'react';
import PlanilleroPartidosPanel from '@/app/components/PartidosPlanilleros';
import BackButton from '@/app/components/ui/BackButton';

const EjemploUsoPlanillero: React.FC = () => {
    return (
        <div className="min-h-screen p-4 max-w-4xl mx-auto">
            <div className='mb-4'>
                <BackButton/>
            </div>
            <PlanilleroPartidosPanel />
        </div>
    );
};

export default EjemploUsoPlanillero;