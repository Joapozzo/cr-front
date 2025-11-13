'use client';

import React from 'react';

interface UserPageWrapperProps {
  children: React.ReactNode;
}

export const UserPageWrapper: React.FC<UserPageWrapperProps> = ({ children }) => {
  return (
    <div className="w-full flex justify-between items-start gap-4 pt-4 px-4 pb-30 md:gap-4 max-w-[1300px] mx-auto flex-col md:flex-row mx-auto">
      {children}
    </div>
  );
};

