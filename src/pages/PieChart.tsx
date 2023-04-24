//@ts-nocheck
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: { [key: string]: number }
}

export default function DecadeDonut({ data }: Props) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Tracks by Decade',
        data: Object.values(data),
        backgroundColor: [
          '#FF6384', // salmon pink
          '#FFCE56', // mustard yellow
          '#36A2EB', // blue
          '#4BC0C0', // teal
          '#9966FF', // lavender
          '#FF9F40', // orange
          '#000080', // green
        ],
        borderWidth: 1,
        borderColor: 'white',
        borderAlign: 'center', // align border on inner edge of segment
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        align: 'center', // or 'center'
        labels: {
          color: 'white',
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}