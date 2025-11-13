'use client';

export const NoticiasListaSkeleton: React.FC<{ cantidad?: number }> = ({ cantidad = 6 }) => {
  return (
    <div className="space-y-4">
      {[...Array(cantidad)].map((_, index) => (
        <div
          key={index}
          className="bg-[var(--black-900)] border border-[#262626] rounded-xl overflow-hidden w-full"
        >
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
            {/* Imagen skeleton */}
            <div className="w-full sm:w-48 h-48 sm:h-auto bg-[var(--black-800)] animate-pulse" />

            {/* Contenido skeleton */}
            <div className="flex-1 p-4 space-y-3">
              {/* Título */}
              <div className="space-y-2">
                <div className="h-5 bg-[var(--black-800)] rounded animate-pulse w-3/4" />
                <div className="h-5 bg-[var(--black-800)] rounded animate-pulse w-1/2" />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <div className="h-3 bg-[var(--black-800)] rounded animate-pulse w-full" />
                <div className="h-3 bg-[var(--black-800)] rounded animate-pulse w-full" />
                <div className="h-3 bg-[var(--black-800)] rounded animate-pulse w-3/4" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-16 bg-[var(--black-800)] rounded animate-pulse" />
                  <div className="h-3 w-12 bg-[var(--black-800)] rounded animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-[var(--black-800)] rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

