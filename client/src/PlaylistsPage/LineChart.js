import React, { useState, useEffect } from "react";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import "./styles/LineChart.css";
//import testData from "./output.json";
import { getPlaylistTopArtistsOverTime } from "../apiCalls";
Chart.register(CategoryScale);


function createDataSets(topArtistsOverTime) {
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
  let graphLabels = Object.keys(topArtistsOverTime[Object.keys(topArtistsOverTime)[0]]);

  let graphDataSets = [];
  Object.entries(topArtistsOverTime).forEach(([key, value]) => {
    graphDataSets.push({
      label: key,
      data: Object.values(value), // Y-axis data
      borderColor: colors[0], // Line color
      backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill under the line
      borderWidth: 2,
      tension: 0, // straight curves
    });
    colors.shift();
  });
  const data = {
    labels: graphLabels, // X-axis labels
    datasets: graphDataSets,
  };

  return data;
}

export default function LineChart({playlistTracks, token}) {
  const [topArtistsOverTime, setTopArtistsOverTime]= useState(null)
  console.log(playlistTracks)
  useEffect(() => {
    const promise = getPlaylistTopArtistsOverTime(token, JSON.stringify(playlistTracks));
    promise.then(function(response) {
      setTopArtistsOverTime(response)
    })
  // eslint-disable-next-line
  }, []);

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
        grid: {
          color: 'rgba(132, 132, 132, 0.3)', // X-axis gridline color
        },
        ticks: {
          color: "#F2F4F7", // Change X-axis font color
          maxRotation: 45,
          minRotation: 45,
        },
        title: {
          display: true,
        },
      },
      y: {
        grid: {
          color: 'rgba(132, 132, 132, 0.3)', // X-axis gridline color
        },
        ticks: {
          color: "#F2F4F7", // Change Y-axis font color
          min: 0
        },
        title: {
          display: true,
          color: "#F2F4F7", // Change Y-axis title color
        },
      },
    },
  };

  if (topArtistsOverTime === null) {return <div>Loading...</div>}
  return (
    <div id="line-chart-card" className="playlist-card">
      <div className="card-title">
        <span>Playlist Evolution</span>
      </div>

      <Line data={createDataSets(topArtistsOverTime)} options={options} />
    </div>
  );
}
