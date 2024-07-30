import React from 'react'
import { playlistCoverURL } from './DisplayPlaylists'
export default function PlaylistSummary(props) {
  const playlist = props.playlist
  const topArtists = props.topArtists
  const topAlbums = props.topAlbums
  const topGenres = props.topGenres 


  return (
    <div id="summary-card" className="playlist-card">
      <h1 className="card-title">{playlist.name}</h1>
      
      <h2 className="by-owner"> 
        <a href={playlist.owner.external_urls.spotify} target="_blank" rel="noopener noreferrer">{playlist.owner.display_name}</a> 
      </h2>
  
      <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
        <img src={playlistCoverURL(playlist)} alt="playlistCover" width="100" height="100"></img>
      </a>

      <div className='more-info'>
        <span>Tracks: <span>{playlist.tracks.total}</span></span>
        <span>Artists: <span>{topArtists.length}</span></span>
        <span>Followers: <span>{playlist.followers.total}</span></span>
        <span>Top Artist: <span>{topArtists[0][0]}</span></span>
        <span>Top Album: <span>{topAlbums[0][0]}</span></span>
        <span>Top Genre: <span>{topGenres[0][0]}</span></span>
        
        {/* <button onClick={()=> console.log(topAlbums)}>EE</button> */}
      </div>
    </div>
  )
} 
 