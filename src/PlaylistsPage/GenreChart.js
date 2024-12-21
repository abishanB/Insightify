import React, { useState, useEffect} from 'react'
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
//import categorizeSpotifyGenres from "./categorizeGenres.js"

Chart.register(CategoryScale);

function calculateGenreComposition(data){
  const THRESHOLD_PERCENTAGE = 0.75;//exclude genres that dont take up at least this percentage
  const MAX_OTHER_PERCENTAGE = 15;
  const totalGenreOccurrences = data.reduce((sum, [_, details]) => sum + details.totalOccurences, 0);//total occureneces of each genre

  // Calculate percentages
  const processedData = data.map(([genre, details]) => {
    const percentage = (details.totalOccurences / totalGenreOccurrences) * 100;
    return { name: genre, occurrences: details.totalOccurences, percentage };
  });

  // Separate top genres and "Other"
  const topGenres = [];
  let otherOccurrences = 0;

  processedData.forEach((item) => {
    if (item.percentage >= THRESHOLD_PERCENTAGE) {
      topGenres.push(item);
    } else { otherOccurrences += item.occurrences; }
  });

  // Calculate "Other" contribution
  const otherPercentage = (otherOccurrences / totalGenreOccurrences) * 100;

  if (otherPercentage > MAX_OTHER_PERCENTAGE) {
    const excessPercentage = otherPercentage - MAX_OTHER_PERCENTAGE;

    // Redistribute excess percentage among top genres proportionally
    topGenres.forEach((genre) => {
      const additionalPercentage =
        (genre.percentage / topGenres.reduce((sum, g) => sum + g.percentage, 0)) *
        excessPercentage;
      genre.percentage += additionalPercentage;
    });

    // Cap "Other" at the max allowed percentage
    topGenres.push({
      name: "Other",
      occurrences: Math.round((MAX_OTHER_PERCENTAGE / 100) * totalGenreOccurrences),
      percentage: MAX_OTHER_PERCENTAGE,
    });
  } else {
    // Add "Other" directly if it doesn't exceed the limit
    topGenres.push({
      name: "Other",
      occurrences: otherOccurrences,
      percentage: otherPercentage,
    });
  }

  return topGenres
}

export default function GenreChart(props) {
  const [genreReadyToRender, setGenreReadyToRender] = useState(false)
  const [chartData, setChartData] = useState(null)
  const topGenres = props.topGenres 
  useEffect(() => {//NESSAACERY WAIT
    setGenreReadyToRender(true)
  }, []);

  useEffect(() => {
    if (genreReadyToRender===false){return}
    
    const genreData = calculateGenreComposition(Object.values(topGenres))
    setChartData({
      labels: genreData.map((data) => data.name), 
      datasets: [
        {  
          radius: 340,
          label: "",
          data: genreData.map((data) => data.occurrences),
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
          borderWidth: 2
        }
      ]
  })
  // eslint-disable-next-line
  }, [genreReadyToRender]);
 
  if (chartData===null){
    return <div id="genre-chart-card"className='playlist-card'></div>
  }
  return (
    <div id="genre-chart-card"className='playlist-card'>
      <h1 className="card-title">Genres</h1>
      <div>
      <Doughnut
        data={chartData}
        options={{
          layout: {
            autoPadding:false
          },
          plugins: {
            legend: {
              labels: {
                color: "#b3b7bd"
              }
            }
          }
        }}
      />
      </div>
    </div>
  )
}
