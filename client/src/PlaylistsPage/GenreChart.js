import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import LoadingIcon from "../components/LoadingIcon";
import "./styles/GenreChart.css";

const NUMBER_OF_TOP_GENRES = 12;//number of genres to display

function calculateGenreComposition(data) {
  const totalGenreOccurrences = data.reduce(
    (sum, [_, details]) => sum + details.totalOccurences,
    0
  ); //total occureneces of each genre

  // Calculate percentages
  const topGenres = data.map(([genre, details]) => {
    const percentage = (details.totalOccurences / totalGenreOccurrences) * 100;
    return { name: genre, occurrences: details.totalOccurences, percentage: Math.round(percentage*10)/10 };
  });
  return topGenres.slice(0, NUMBER_OF_TOP_GENRES)
}

export default function GenreChart({ topGenres }) {
  const [genreReadyToRender, setGenreReadyToRender] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    //NESSAACERY WAIT
    if (topGenres === null) {
      return;
    }

    setGenreReadyToRender(true);
  }, [topGenres]);

  useEffect(() => {
    if (genreReadyToRender === false) {
      return;
    }

    const genreData = calculateGenreComposition(Object.values(topGenres));
    setChartData({
      labels: genreData.map((data) => data.name),
      datasets: [
        {
          label: "%",
          data: genreData.map((data) => data.percentage),
          backgroundColor: [
            "#F4A261", // Soft Orange
            "#2A9D8F", // Muted Teal
            "#A8DADC", // Light Aqua
            "#E9C46A", // Warm Yellow
            "#81B29A", // Soft Green
            "#F2CC8F", // Pale Peach
            "#B5838D", // Dusty Rose
            "#6D6875", // Muted Lavender
            "#E76F51", // Warm Coral
            "#C7A37D", // Neutral Sand
            "#FFA07A", // Soft Salmon
            "#457B9D", // Slate Blue
            "#264653", // Deep Teal
            "#8FBC8B", // Sage Green
            "#D4A5A5", // Soft Blush Pink
            "#BC80BD", // Muted Mauve
          ],
          borderColor: "#2F374C",
          borderWidth: 2,
        },
      ],
    });
    // eslint-disable-next-line
  }, [genreReadyToRender]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // This makes it horizontal
    layout: {
      padding: 0,
      margin: 0,
    },
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#F2F4F7", // X-axis labels color
          font: {
            size: (context) => {
              const width = context.chart.width;
              return width < 600 ? 8 : 12; // Adjust based on width
            },
          },
        },
        grid: {
          display: false, // Removes vertical grid lines
        },
      },
      y: {
        ticks: {
          color: "#F2F4F7", // Y-axis labels color
          font: {
            size: (context) => {
              const width = context.chart.width;
              return width < 600 ? 8 : 12; // Adjust based on width
            },
          },
        },
        grid: {
          display: false, // Removes vertical grid lines
        },
      },
    },
  };

  if (topGenres === null) {
    return <LoadingIcon />;
  }
  if (chartData === null) {
    return <div id="genre-chart-card" className="playlist-card"></div>;
  }
  return (
    <div id="genre-chart-card" className="playlist-card">
      <div className="card-title">
        <span>Top Genres</span>
      </div>

      <div className="bar-chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
