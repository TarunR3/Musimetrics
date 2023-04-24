//@ts-nocheck
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    data: { [key: string]: number }
}

export default function PopularityBubble({ data }: Props) {
    const values = Object.values(data);

    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Tracks by Uniqueness',
                data: values,
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: 'green',
                borderWidth: 1,
                radius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        aspectRatio: 1,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'white',
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                enabled: false, // disable tooltips
            },
        },
    };

    return <Bubble data={chartData} options={options} />;
}
