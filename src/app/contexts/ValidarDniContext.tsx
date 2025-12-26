'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ValidarDniContextType {
  step: 'scan' | 'processing' | 'form';
  setStep: (step: 'scan' | 'processing' | 'form') => void;
}

const ValidarDniContext = createContext<ValidarDniContextType | undefined>(undefined);

export const ValidarDniProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState<'scan' | 'processing' | 'form'>('scan');

  return (
    <ValidarDniContext.Provider value={{ step, setStep }}>
      {children}
    </ValidarDniContext.Provider>
  );
};

export const useValidarDniContext = () => {
  const context = useContext(ValidarDniContext);
  if (!context) {
    throw new Error('useValidarDniContext must be used within ValidarDniProvider');
  }
  return context;
};

