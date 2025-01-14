import React from "react";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import "./styles/LineChart.css";
import testData from "./output.json";
Chart.register(CategoryScale);


function createDataSets() {
  const colors = [
    "rgba(75, 192, 192, 1)", // Aqua
    "#FF5733", // Vibrant Red
    "#33FF57", // Bright Green
    "#3357FF", // Vibrant Blue
    "#F39C12", // Orange
    "#8E44AD", // Purple
    "#1ABC9C", // Teal
    "#E74C3C", // Soft Red
    "#3498DB", // Soft Blue
    "#9B59B6", // Lavender
    "#2ECC71"  // Emerald Green
];
  let graphLabels = Object.keys(testData[Object.keys(testData)[0]]);

  let graphDataSets = [];
  Object.entries(testData).forEach(([key, value]) => {
    graphDataSets.push({
      label: key,
      data: Object.values(value), // Y-axis data
      borderColor: colors[0], // Line color
      backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill under the line
      borderWidth: 2,
      tension: 0.3, // Smooth curves
    });
    colors.shift();
  });
  const data = {
    labels: graphLabels, // X-axis labels
    datasets: graphDataSets,
  };

  return data;
}

export default function LineChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 24,
          color: "#b3b7bd",
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#F2F4F7", // Change X-axis font color
        },
        title: {
          display: true,
        },
      },
      y: {
        ticks: {
          color: "#F2F4F7", // Change Y-axis font color
        },
        title: {
          display: true,
          color: "#F2F4F7", // Change Y-axis title color
        },
      },
    },
  };
  return (
    <div id="line-chart-card" className="playlist-card">
      <div className="card-title">
        <span>Playlist Evolution</span>
      </div>

      <Line data={createDataSets()} options={options} />
    </div>
  );
}
