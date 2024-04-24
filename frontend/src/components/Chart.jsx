import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement } from 'chart.js';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SemesterSGPAChart = ({ semesters, sgpas }) => {
  const data = {
    labels: semesters,
    datasets: [
      {
        label: 'SGPA',
        data: sgpas,
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 2,
        tension: 0.4,
        pointStyle: 'crossRot',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        stepSize: 1
      },
    },
    interactions: {
      mode: 'x',
      intersect: false,
      axis: 'x'
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'SGPA for Each Semester',
      },
    }
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default SemesterSGPAChart;
