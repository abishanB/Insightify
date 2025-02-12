import React from 'react'
import { playlistCoverURL } from './DisplayPlaylists'
import LoadingIcon from "../components/LoadingIcon";
import "./styles/PlaylistSummary.css"
import spotifyIcon from "../Spotify_Primary_Logo_RGB_White.png"

export default function PlaylistSummary(props) {
  const playlist = props.playlist
  // Use default values if props are null or undefined
  const totalArtists = props.topArtists?.length ?? "...";
  const topArtists = props.topArtists ?? [[["..."]]];
  const topAlbums = props.topAlbums ?? [[["..."]]];
  const topGenres = props.topGenres ?? [[["..."]]];
  const averagePopularity = props.averagePopularity ?? "...";

  const noData = props.noData

  if (playlist === null) {return <LoadingIcon />}
  return (
    <div id="summary-card" className="playlist-card">
      <div className='card-title'>
        <span>{playlist.name}</span>
      </div >
      
      <div className="by-owner">
        <a href={playlist.owner.external_urls.spotify} target="_blank" rel="noopener noreferrer">
          {playlist.owner.display_name}
          <img src={spotifyIcon} alt="SpotifyIcon"></img>
        </a> 
      </div>
      
      <div className='summary-container'>
        <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
          <img src={playlistCoverURL(playlist)} className='playlistCover' alt="playlistCover" width="100" height="100"></img>
        </a>
        
        <div className='details'>
          <span>Tracks: <span>{playlist.tracks.total}</span></span>
          <span>Artists: <span>{totalArtists}</span></span>
          <span>Followers: <span>{playlist.followers.total}</span></span>
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
 