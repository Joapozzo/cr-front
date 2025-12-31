interface ConectorProps {
    altura: number;
}

const Conector = ({ altura }: ConectorProps) => {
    return (
        <>
            {/* Mobile: SVG más pequeño */}
            <svg width="30" height={altura} className="flex-shrink-0 md:hidden">
                <line x1="0" y1={altura / 4} x2="15" y2={altura / 4} stroke="var(--gray-300)" strokeWidth="1.5" />
                <line x1="0" y1={altura * 3 / 4} x2="15" y2={altura * 3 / 4} stroke="var(--gray-300)" strokeWidth="1.5" />
                <line x1="15" y1={altura / 4} x2="15" y2={altura * 3 / 4} stroke="var(--gray-300)" strokeWidth="1.5" />
                <line x1="15" y1={altura / 2} x2="30" y2={altura / 2} stroke="var(--gray-300)" strokeWidth="1.5" />
            </svg>
            {/* Desktop: SVG más grande */}
            <svg width="40" height={altura} className="flex-shrink-0 hidden md:block">
                <line x1="0" y1={altura / 4} x2="20" y2={altura / 4} stroke="var(--gray-300)" strokeWidth="2" />
                <line x1="0" y1={altura * 3 / 4} x2="20" y2={altura * 3 / 4} stroke="var(--gray-300)" strokeWidth="2" />
                <line x1="20" y1={altura / 4} x2="20" y2={altura * 3 / 4} stroke="var(--gray-300)" strokeWidth="2" />
                <line x1="20" y1={altura / 2} x2="40" y2={altura / 2} stroke="var(--gray-300)" strokeWidth="2" />
            </svg>
        </>
    );
};


export default Conector;