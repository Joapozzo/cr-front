import React from 'react';
import { ParticipacionCardSkeleton } from './ParticipacionCardSkeleton';

export const ParticipacionesTabSkeleton: React.FC = () => {
  return (
    <div className="py-4 space-y-6 sm:space-y-8">
      {[...Array(2)].map((_, i) => (
        <ParticipacionCardSkeleton key={i} />
      ))}
    </div>
  );
};

