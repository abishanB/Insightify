import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import "./styles/LineChart.css";
import { getPlaylistTopArtistsOverTime } from "../apiCalls";
Chart.register(CategoryScale);

const colors = [
  "rgba(75, 192, 192, 1)", // Aqua
  "#CD7F32", // Bronze
  "#8E44AD", // Purple
  "#FF69B4", // pink
  "#2ECC71", // Emerald Green
  "#3357FF", // Vibrant Blue
  "#FFC300", // Bright Yellow
  "#C70039",  // Deep Crimson
  "#fffac8", // Beige
  "#3498DB", // Soft Blue
];

function createDataSets(topArtistsOverTime) {
  let graphLabels = Object.keys(topArtistsOverTime[Object.keys(topArtistsOverTime)[0]]);
  let graphDataSets = [];

  //dont show all the lines initally cause itll be cluttered
  let initalLinesShowing = 3;
  Object.entries(topArtistsOverTime).forEach(([key, value]) => {
    var hideLineInitally;
    if (Object.keys(topArtistsOverTime).indexOf(key) >= initalLinesShowing) {
      hideLineInitally = true;
    } else { hideLineInitally = false; }

    graphDataSets.push({
      label: key, //artist name
      data: Object.values(value), // Y-axis data
      borderColor: colors[0], // Line color
      backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill under the line
      borderWidth: 2,
      tension: 0, // straight curves
      hidden: hideLineInitally,
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
  const chartRef = useRef(null);
  const [chartDatasets, setChartDatasets] = useState(null);
  const handleHideAllLines = () => {
    const chart = chartRef.current; // Access the chart instance
    if (chart) {
      // Update datasets to hide all
      const updatedDatasets = chart.data.datasets.map(dataset => ({
        ...dataset,
        hidden: true,
      }));

      // Update the state with the modified datasets
      setChartDatasets({ ...chart.data, datasets: updatedDatasets });

      // Apply changes to the chart instance
      chart.data.datasets = updatedDatasets;
      chart.update(); // Refresh the chart
    }
  };

  useEffect(() => {
    const promise = getPlaylistTopArtistsOverTime(token, JSON.stringify(playlistTracks));
    promise.then(function(response) {
      setChartDatasets(createDataSets(response));
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
          stepSize: 1, // Set interval to 1
        },
        suggestedMin: 5, // Ensures the axis includes at least 0
 
        title: {
          display: true,
          color: "#F2F4F7", // Change Y-axis title color
        },
      },
    },
  };

  if (chartDatasets === null) {return <div>Loading...</div>}
  return (
    <div id="line-chart-card" className="playlist-card">
      <div className="card-title">
        <span>Playlist Evolution</span>
      </div>
      
      <button className="deselect-all-btn" onClick={handleHideAllLines}>
        Deselect All
      </button>
      <Line data={chartDatasets} options={options} ref={chartRef} />
    </div>
  );
}
