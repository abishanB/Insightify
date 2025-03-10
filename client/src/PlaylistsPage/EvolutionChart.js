import React, { useState, useEffect, useRef } from "react";
import LoadingIcon from "../components/LoadingIcon";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import "./styles/EvolutionChart.css";

Chart.register(CategoryScale);

//line chart options

function createDataSets(topArtistsOverTime) {
  const colors = [
    "rgba(75, 192, 192, 1)", // Aqua
    "#CD7F32", // Bronze
    "#8E44AD", // Purple
    "#FF69B4", // pink
    "#2ECC71", // Emerald Green
    "#3357FF", // Vibrant Blue
    "#FFC300", // Bright Yellow
    "#C70039", // Deep Crimson
    "#fffac8", // Beige
    "#3498DB", // Soft Blue
    "#FF4500", // Orange Red  
    "#32CD32", // Lime Green  
    "#FFD700", // Gold  
    "#1E90FF", // Dodger Blue  
    "#FF6347", // Tomato  
    "#FF8C00", // Dark Orange  
    "#00CED1", // Dark Turquoise  
    "#DC143C", // Crimson  
    "#7FFF00", // Chartreuse  
    "#8B4513", // Saddle Brown  
  ];
  
  let graphLabels = Object.keys(
    topArtistsOverTime[Object.keys(topArtistsOverTime)[0]]
  );
  let graphDataSets = [];

  //dont show all the lines initally cause itll be cluttered
  let initalLinesShowing = 3;
  Object.entries(topArtistsOverTime).forEach(([key, value]) => {
    var hideLineInitally;
    if (Object.keys(topArtistsOverTime).indexOf(key) >= initalLinesShowing) {
      hideLineInitally = true;
    } else {
      hideLineInitally = false;
    }

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

export default function LineChart({playlistEvolutionDataset}) {
  const chartRef = useRef(null);
  const [chartDatasets, setChartDatasets] = useState({});

  const handleHideAllLines = () => {
    const chart = chartRef.current; // Access the chart instance
    if (chart) {
      // Update datasets to hide all
      const updatedDatasets = chart.data.datasets.map((dataset) => ({
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
    //function is called on load and every thime playlistTracks is updated
    if (playlistEvolutionDataset === null) {
      return;
    } //wait for tracks to be fetched from parent function
    
    if (Object.keys(playlistEvolutionDataset) === 0){//no data
      setChartDatasets(null)
      return
    } 
    if ((Object.keys(playlistEvolutionDataset[Object.keys(playlistEvolutionDataset)[0]])).length <= 1){//check if there is at least 2 time ranges to display data
      setChartDatasets(null)
      return
    }
  
    setChartDatasets(createDataSets(playlistEvolutionDataset));

    // eslint-disable-next-line
  }, [playlistEvolutionDataset]);


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: (context) => {
            const width = context.chart.width;
            return width < 600 ? 14 : 24; // Adjust based on width
          },
          color: "#b3b7bd",
          font: {
            size: (context) => {
              const width = context.chart.width;
              return width < 600 ? 8 : 12; // Adjust based on width
            },
          },
        },
      },
    },
    layout:{
      padding: 0,
      margin: 0
    },
    scales: {
      x: {
        grid: {
          color: "rgba(132, 132, 132, 0.3)", // X-axis gridline color
        },
        ticks: {
          display: (context) => {
            const width = context.chart.width;
            return width > 600 ? true : false; // Adjust based on width
          },
          font: {
            size: 12, // Set font size for Y axis ticks
          },
          color: "#F2F4F7", // Change X-axis font color
          maxRotation: 45,
          minRotation: 45,
        },
        title: {
          display: (context) => {
            const width = context.chart.width;
            return width > 600 ? true : false; // Adjust based on width
          },
        },
      },
      y: {
        grid: {
          color: "rgba(132, 132, 132, 0.3)", // X-axis gridline color
        },
        ticks: {
          font: {
            size: (context) => {
              const width = context.chart.width;
              return width < 600 ? 8 : 12; // Adjust based on width
            },
          },
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
  

  if (chartDatasets === null){//null indicates there is not enough data to create a line chart
    return (
      <div id="line-chart-card" className="playlist-card">
      <div className="card-title">
        <span>Playlist Evolution</span>
      </div>

      <button className="deselect-all-btn" onClick={handleHideAllLines}>
        Deselect All
      </button>
      <h2>Not Enough Data</h2>
    </div>
    )
  }

  if (Object.keys(chartDatasets).length === 0) { return <LoadingIcon />}

  return (
    <div id="line-chart-card" className="playlist-card">
      <div className="card-title">
        <span>Playlist Evolution</span>
      </div>

      <button className="deselect-all-btn" onClick={handleHideAllLines}>
        Deselect All
      </button>


      <div className="evolution-chart-container">
        <Line data={chartDatasets} options={options} ref={chartRef} />
      </div>
    </div>
  );
}
