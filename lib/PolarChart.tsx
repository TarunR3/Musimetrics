//@ts-nocheck
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    data: { [key: string]: number }
}

export default function ListeningClock({ data }: Props) {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Tracks by the Hour',
                data: Object.values(data),
                backgroundColor: "#006400",
                borderWidth: 1,
                borderColor: 'white',
                borderAlign: 'center', // align border on inner edge of segment
            },
        ],
    };

    const options = {
        scales: {
            r: {
                grid: {
                    color: "gray",
                },
                ticks: {
                    display: false, // hide the radial axis ticks
                },
                angleLines: {
                    color: "white",
                    display: false, // hide the vertical ticks
                },
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <PolarArea data={chartData} options={options} />
    );
}