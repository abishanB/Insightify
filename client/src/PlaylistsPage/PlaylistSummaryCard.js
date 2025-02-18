import React from 'react'
import LoadingIcon from "../components/LoadingIcon";
import "./styles/PlaylistSummary.css"
import spotifyIcon from "../Spotify_Primary_Logo_RGB_White.png"

function checkPlaylistCover(playlistCover){
  if (playlistCover === null){
    return "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"
  }
  return playlistCover
}

export default function PlaylistSummary(props) {
  const playlist = props.playlist
  // Use default values if props are null or undefined
  
  const totalArtists = props.topArtists?.length ?? "...";
  const topArtists = props.topArtists ?? [[["..."]]];
  const topGenres = props.topGenres ?? [[["..."]]];
  const averagePopularity = props.averagePopularity ?? "...";
  const noData = props.noData

  //in case playlist has no albums, only contains singles
  let topAlbums = props.topAlbums ?? [[["..."]]];
  if (topAlbums.length === 0){topAlbums = [[["..."]]]}

  if (playlist === null) {return <LoadingIcon />}
  return (
    <div id="summary-card" className="playlist-card">
      <div className='card-title'>
        <span>{playlist.name}</span>
      </div >
      
      <div className="by-owner">
        <a href={playlist.owner_url} target="_blank" rel="noopener noreferrer">
          {playlist.owner_name}
          <img src={spotifyIcon} alt="SpotifyIcon"></img>
        </a> 
      </div>
      
      <div className='summary-container'>
        <a href={playlist.href} target="_blank" rel="noopener noreferrer">
          <img src={checkPlaylistCover(playlist.image_url)} className='playlistCover' alt="playlistCover" width="100" height="100"></img>
        </a>
        
        <div className='details'>
          <span>Tracks: <span>{playlist.total_tracks}</span></span>
          <span>Artists: <span>{totalArtists}</span></span>
          <span>Followers: <span>{playlist.followers}</span></span>
          {noData
          ? <>
              <span>Top Artist: <span>N/A</span></span>
              <span>Top Album: <span>N/A</span></span>
              <span>Top Genre: <span>N/A</span></span>
              <span>Popularity Score: <span>N/A</span></span>
            </>
          : <>
              <span>Top Artist: <span>{topArtists[0][0]}</span></span>
              <span>Top Album: <span>{topAlbums[0][0]}</span></span>
              <span>Top Genre: <span>{topGenres[0][0]}</span></span>
              <span>Popularity Score: <span>{averagePopularity}</span></span>
            </>
          }
        </div>
      </div>
    </div>
  )
} 
 