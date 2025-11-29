'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface TrendChartProps {
    data: { date: string; value: number }[];
    testName: string;
    unit: string;
}

export default function TrendChart({ data, testName, unit }: TrendChartProps) {
    if (!data || data.length === 0) return <p>No history available.</p>;

    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
            {
                label: `${testName} (${unit})`,
                data: data.map(d => d.value),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const options: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `${testName} History`,
            },
        },
        scales: {
            y: {
                beginAtZero: false,
            },
        },
    };

    return <Line options={options} data={chartData} />;
}
