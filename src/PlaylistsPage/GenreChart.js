import React, { useState, useEffect} from 'react'
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

//Chart.register(CategoryScale);

function calculateGenreComposition(playlistGenres){
  let genreData = [];  
  const numOfTopGenres = 11;//number of genre categories not including other to display, the rest will be grouped as 'other'
  const topMostGenres = playlistGenres.slice(0,numOfTopGenres)
  const bottomMostGenres= playlistGenres.slice(numOfTopGenres, playlistGenres.length)

  for (const genre of topMostGenres) {
    genreData.push({ 
      name: genre[0], 
      occurences: genre[1].totalOccurences 
    })
  }

  let otherGenresOccurences = 0;
  for (const genre of bottomMostGenres){
    if (genre[1].totalOccurences<3){continue}
    otherGenresOccurences += genre[1].totalOccurences
  }
  genreData.push({
    name: "other",
    occurences: otherGenresOccurences
  })
  
  return genreData 
}

export default function GenreChart(props) {
  const [genreReadyToRender, setGenreReadyToRender] = useState(false)
  const [chartData, setChartData] = useState(null)
  const topGenres = props.topGenres 
  useEffect(() => {//NESSAACERY WAIT
    setTimeout(function() {
      setGenreReadyToRender(true)
    }, 200);
  }, []);

  useEffect(() => {
    if (genreReadyToRender===false){return}
    
    const genreData = calculateGenreComposition(Object.values(topGenres))
    setChartData({
      labels: genreData.map((data) => data.name), 
      datasets: [
        {  
          radius: 340,
          label: "Genre Count",
          data: genreData.map((data) => data.occurences),
          backgroundColor: [
            "#EAC435",
            "#4B84E7",
            "#ED5C5A",
            "#64B6AC",
            "#B07BAC",
            "#D23F0F",
            "#047650",
            "#A40E4C",
            "#66CED6",
            "#6564DB",
            "#D3D8AC",
            "#C48431",
          ],
          borderColor: "black",
          borderWidth: 2
        }
      ]
  })
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
            padding: {
              bottom: 450
          }
          },
          plugins: {
          }
        }}
      />
      </div>
    </div>
  )
}
