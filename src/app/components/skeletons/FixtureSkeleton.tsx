'use client';

export const FixtureSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 mt-4">
      {[...Array(1)].map((_, groupIndex) => (
        <div key={groupIndex} className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden">
          {/* Header skeleton */}
          <div className="px-4 py-3 border-b border-[#262626]">
            <div className="h-4 w-24 bg-[var(--black-800)] rounded animate-pulse mb-1" />
            <div className="h-3 w-32 bg-[var(--black-800)] rounded animate-pulse" />
          </div>

          {/* Partidos skeleton */}
          <div className="divide-y divide-[#262626]">
            {[...Array(5)].map((_, partidoIndex) => (
              <div key={partidoIndex} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  {/* Equipo local skeleton */}
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-6 h-6 rounded-full bg-[var(--black-800)] animate-pulse" />
                    <div className="h-3 w-20 bg-[var(--black-800)] rounded animate-pulse" />
                  </div>

                  {/* Centro skeleton */}
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="h-3 w-12 bg-[var(--black-800)] rounded animate-pulse" />
                  </div>

                  {/* Equipo visita skeleton */}
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <div className="h-3 w-20 bg-[var(--black-800)] rounded animate-pulse" />
                    <div className="w-6 h-6 rounded-full bg-[var(--black-800)] animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

