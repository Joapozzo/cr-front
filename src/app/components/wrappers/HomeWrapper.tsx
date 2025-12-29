import React from 'react';

interface HomeWrapperProps {
  children: React.ReactNode;
  variant?: 'default' | 'planilla';
}

export const HomeWrapper: React.FC<HomeWrapperProps> = ({ children }) => {

  return (
    <div className={`w-full flex justify-between items-start gap-4 p-6
    md:gap-4
     max-w-[1300px] mx-auto flex-col md:flex-row`}>
      {children}
    </div>
  );
};
