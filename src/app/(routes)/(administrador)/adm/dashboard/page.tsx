import { PageHeader } from '@/app/components/ui/PageHeader';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Vista general del sistema y estadísticas principales"
            />
        </div>
    );
}