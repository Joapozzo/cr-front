import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CategoriesListSkeleton: React.FC = () => {
    return (
        <>
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="flex flex-col bg-[var(--black-900)] rounded-[20px] overflow-hidden mb-6"
                >
                    <div className="px-6 py-4 border-b border-[var(--black-800)]">
                        <Skeleton
                            height={18}
                            width="40%"
                            borderRadius={8}
                            baseColor="#3d3d3d"
                            highlightColor="#525252"
                        />
                    </div>
                    <div className="py-2 flex flex-col">
                        <div className="px-6 py-2">
                            <Skeleton height={18} width="50%" borderRadius={8} baseColor="#3d3d3d"
                                highlightColor="#525252" />
                        </div>
                        <div className="px-6 py-2">
                            <Skeleton height={18} width="50%" borderRadius={8} baseColor="#3d3d3d"
                                highlightColor="#525252" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default CategoriesListSkeleton;
