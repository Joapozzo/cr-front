import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ChevronDown } from 'lucide-react';

interface SelectSkeletonProps {
    className?: string;
    bgColor?: string;
    showImages?: boolean;
}

const SelectSkeleton: React.FC<SelectSkeletonProps> = ({
    className = "",
    bgColor = "bg-[var(--gray-400)]",
    showImages = false
}) => {
    return (
        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333">
            <div className={`relative w-full ${className}`}>
                {/* Header skeleton */}
                <div className={`
                    flex items-center justify-between 
                    ${bgColor} text-white 
                    rounded-[20px] px-6 py-4 
                    opacity-50
                `}>
                    <div className="flex items-center gap-2">
                        {showImages && (
                            <Skeleton circle width={20} height={20} />
                        )}
                        <Skeleton width={120} height={16} borderRadius={6} />
                    </div>

                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default SelectSkeleton;