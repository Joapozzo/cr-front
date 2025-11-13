import { CheckCircle, PenTool } from "lucide-react";

interface TabNavigationProps {
    activeTab: 'pendientes' | 'planillados';
    onTabChange: (tab: 'pendientes' | 'planillados') => void;
    pendientesCount?: number;
    planilladosCount?: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
    activeTab,
    onTabChange,
    pendientesCount = 0,
    planilladosCount = 0
}) => {
    return (
        <div className="flex items-center justify-center mb-6 w-full">
            <div className="bg-[#262626] p-2 rounded-lg flex gap-2 justify-center w-full">
                <button
                    onClick={() => onTabChange('pendientes')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'pendientes'
                        ? 'bg-[var(--gray-100)] text-[var(--black-900)]'
                        : 'text-[var(--black-200)] hover:text-white'
                        }`}
                >
                    <PenTool size={16} />
                    Pendientes
                    {pendientesCount > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'pendientes' ? 'bg-red-100 text-red-700' : 'bg-red-500 text-white'
                            }`}>
                            {pendientesCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => onTabChange('planillados')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'planillados'
                        ? 'bg-[var(--gray-100)] text-[var(--black-900)]'
                        : 'text-[var(--black-200)] hover:text-white'
                        }`}
                >
                    <CheckCircle size={16} />
                    Planillados
                    {planilladosCount > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'planillados' ? 'bg-[var(--green)]/40 text-green-800' : 'bg-[var(--green)]/40 text-white'
                            }`}>
                            {planilladosCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TabNavigation;