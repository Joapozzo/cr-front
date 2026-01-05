import React from 'react';

interface LoadingSkeletonProps {
    type: 'card' | 'list' | 'chart' | 'text';
    count?: number;
    className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 1, className = '' }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className={`bg-[var(--black-900)] rounded-xl border border-[#262626] p-4 animate-pulse ${className}`}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="h-10 w-10 rounded-full bg-[var(--black-800)]"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[var(--black-800)] rounded w-3/4"></div>
                                <div className="h-3 bg-[var(--black-800)] rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-20 bg-[var(--black-800)] rounded w-full"></div>
                    </div>
                );
            case 'chart':
                return (
                    <div className={`bg-[var(--black-900)] rounded-xl border border-[#262626] p-4 h-[300px] flex flex-col animate-pulse ${className}`}>
                        <div className="h-6 w-1/3 bg-[var(--black-800)] rounded mb-4"></div>
                        <div className="flex-1 flex items-end space-x-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex-1 bg-[var(--black-800)] rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                            ))}
                        </div>
                    </div>
                );
            case 'list':
                return (
                    <div className={`space-y-3 ${className}`}>
                        {[...Array(count)].map((_, i) => (
                            <div key={i} className="flex items-center p-3 rounded-lg bg-[var(--black-900)] border border-[#262626] animate-pulse">
                                <div className="h-10 w-10 rounded-full bg-[var(--black-800)] mr-3"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-[var(--black-800)] rounded w-1/3"></div>
                                    <div className="h-3 bg-[var(--black-800)] rounded w-1/4"></div>
                                </div>
                                <div className="h-6 w-16 bg-[var(--black-800)] rounded"></div>
                            </div>
                        ))}
                    </div>
                );
            case 'text':
                return (
                    <div className={`space-y-2 ${className}`}>
                        <div className="h-4 bg-[var(--black-800)] rounded w-3/4 animate-pulse"></div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {type === 'list' ? renderSkeleton() : [...Array(count)].map((_, i) => <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>)}
        </>
    );
};
