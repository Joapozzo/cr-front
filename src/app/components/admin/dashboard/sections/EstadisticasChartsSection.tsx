import { BarChart, Activity, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import React from 'react';
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import { EstadisticasChart } from '@/app/types/admin.types';
import { ChartCard } from '@/app/components/admin/dashboard/base/ChartCard';

interface EstadisticasChartsSectionProps {
    data: EstadisticasChart | null;
    loading: boolean;
    error: Error | null;
}

const COLORS = ['#2ad174', '#00985f', '#3b82f6', '#eab308', '#ef4444', '#a855f7'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--black-900)] border border-[#262626] p-3 rounded-lg shadow-xl">
                <p className="text-white text-xs font-bold mb-1">{label}</p>
                <p className="text-[var(--color-primary)] text-sm">
                    {payload[0].value} {payload[0].name === 'cantidad' ? '' : payload[0].name}
                </p>
            </div>
        );
    }
    return null;
};

export const EstadisticasChartsSection: React.FC<EstadisticasChartsSectionProps> = ({ data, loading, error }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Partidos por Estado - Pie Chart */}
            <ChartCard
                title="Estado de partidos"
                icon={PieIcon}
                loading={loading}
                error={error}
            >
                <PieChart>
                    <Pie
                        data={data?.partidos_por_estado}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="cantidad"
                        nameKey="estado"
                    >
                        {data?.partidos_por_estado.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#737373' }} />
                </PieChart>
            </ChartCard>

            {/* Equipos por categoría - Horizontal Bar Chart */}
            <ChartCard
                title="Equipos por categoría"
                icon={BarChart}
                loading={loading}
                error={error}
            >
                <ReBarChart
                    layout="vertical"
                    data={data?.equipos_por_categoria}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#262626" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="categoria"
                        type="category"
                        width={100}
                        tick={{ fill: '#737373', fontSize: 10 }}
                        interval={0}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="cantidad"
                        fill="var(--color-primary)"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                        animationDuration={1500}
                    />
                </ReBarChart>
            </ChartCard>

            {/* Goles por jornada - Line Chart */}
            <ChartCard
                title="Goles por jornada"
                icon={TrendingUp}
                loading={loading}
                error={error}
            >
                <LineChart
                    data={data?.goles_por_jornada}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                    <XAxis dataKey="jornada" tick={{ fill: '#737373', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#737373', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="total_goles"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--color-primary)', r: 3 }}
                        activeDot={{ r: 5, fill: '#fff' }}
                    />
                </LineChart>
            </ChartCard>

            {/* Sanciones por tipo - Bar Chart */}
            <ChartCard
                title="Sanciones por tipo"
                icon={Activity}
                loading={loading}
                error={error}
            >
                <ReBarChart
                    data={data?.sanciones_por_tipo}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                    <XAxis dataKey="tipo_tarjeta" tick={{ fill: '#737373', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#737373', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="cantidad"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                    />
                </ReBarChart>
            </ChartCard>
        </div>
    );
};
