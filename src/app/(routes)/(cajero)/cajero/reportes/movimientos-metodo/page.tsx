import { PageHeader } from '@/app/components/ui/PageHeader';

export default function MovimientosMetodoPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Movimientos por Método de Pago"
                description="Ver movimientos por efectivo, transferencia o Mercado Pago"
            />
        </div>
    );
}

