interface BaseCardTableSkeletonProps {
  columns?: number;
  rows?: number;
  hasAvatar?: boolean;
  className?: string;
}

/**
 * Skeleton genérico de tabla para usar dentro de BaseCard
 * Mantiene la estética de los componentes del home
 */
export const BaseCardTableSkeleton = ({ 
  columns = 4, 
  rows = 5,
  hasAvatar = false,
  className = "" 
}: BaseCardTableSkeletonProps) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        {/* Header Skeleton */}
        <thead>
          <tr className="border-b border-[#262626]">
            {Array.from({ length: columns }).map((_, index) => (
              <th 
                key={index} 
                className={`px-4 py-3 ${index === 0 ? 'text-left' : 'text-center'}`}
              >
                <div 
                  className={`h-3 bg-[#262626] rounded animate-pulse ${
                    index === 0 ? 'w-20' :
                    index === 1 ? 'w-16' :
                    index === 2 ? 'w-12' :
                    'w-14'
                  } ${index === 0 ? '' : 'mx-auto'}`}
                />
              </th>
            ))}
          </tr>
        </thead>

        {/* Body Skeleton */}
        <tbody className="divide-y divide-[#262626]">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`px-4 py-3 ${colIndex === 0 ? 'text-left' : 'text-center'}`}
                >
                  {/* Primera columna con avatar opcional */}
                  {colIndex === 0 && hasAvatar ? (
                    <div className="flex items-center gap-3">
                      {/* Avatar circular */}
                      <div className="w-8 h-8 rounded-full bg-[#262626] animate-pulse flex-shrink-0" />
                      {/* Texto */}
                      <div className="space-y-1.5">
                        <div className="h-3.5 bg-[#262626] rounded animate-pulse w-24" />
                        <div className="h-2.5 bg-[#262626] rounded animate-pulse w-16" />
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`h-3.5 bg-[#262626] rounded animate-pulse ${
                        colIndex === 0 ? 'w-20' :
                        colIndex === 1 ? 'w-16' :
                        colIndex === 2 ? 'w-12' :
                        'w-14'
                      } ${colIndex === 0 ? '' : 'mx-auto'}`}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

