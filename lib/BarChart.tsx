//@ts-nocheck
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    data: { [key: string]: number }
}

export default function LengthBar({ data }: Props) {
    const values = Object.values(data);
    const largestIndex = values.indexOf(Math.max(...values));
    const backgroundColors = values.map((_, index) =>
        index === largestIndex ? '#006400' : 'white'
    );

    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Tracks by Length',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: 'black',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        aspectRatio: 1,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'white'
                },
                display: true
            },
            y: {
                grid: {
                    display: false
                },
                display: false
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'white',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}
