import { BaseCard } from "../BaseCard";

const StatCaraCaraSkeleton: React.FC = () => {
    return (
        <BaseCard className="p-4">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="animate-pulse space-y-2 flex items-center flex-col flex-1">
                    <div className="h-4 bg-[#262626] rounded w-20" />
                    <div className="h-8 bg-[#262626] rounded w-12" />
                    <div className="h-3 bg-[#262626] rounded w-16" />
                </div>
                <div className="animate-pulse space-y-2 flex items-center flex-col flex-1">
                    <div className="h-4 bg-[#262626] rounded w-20" />
                    <div className="h-8 bg-[#262626] rounded w-12" />
                    <div className="h-3 bg-[#262626] rounded w-16" />
                </div>
                <div className="animate-pulse space-y-2 flex items-center flex-col flex-1">
                    <div className="h-4 bg-[#262626] rounded w-20" />
                    <div className="h-8 bg-[#262626] rounded w-12" />
                    <div className="h-3 bg-[#262626] rounded w-16" />
                </div>
            </div>
        </BaseCard>
    )
}

export default StatCaraCaraSkeleton;