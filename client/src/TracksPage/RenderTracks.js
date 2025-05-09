import React from 'react';
import './Tracks.css';

//display top tracks in list format
export default function RenderTracks({tracks}){  
  const tracksLst =  Object.entries(tracks).map(([trackRank, track]) =>
    <table key= {trackRank} className='track-table'>
      <colgroup>
        <col width="38px"/>{/* Track Rank*/}
        <col width="48px"/>{/* Track Image */}
        <col width="600px"/>{/* Title*/}
        <col width="340px"/>{/* Artist*/} 
        <col width="300px"/>{/* Album*/} 
      </colgroup>

      <tbody>
        <tr key={trackRank} className='track'>
          <td className="track-rank">{parseInt(trackRank)+1}</td>
          <td className='track-cover'>
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img src={track.album.images[0].url} height="42" width="42" alt="albumImg" loading='lazy'/>
            </a>
          </td>
          <td className='track-name'>
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            {track.name}
            </a>
          </td>
          <td className='track-artist-name'>
            <a href={track.artists[0].external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {track.artists[0].name}
            </a>
          </td>
          <td className='track-album'>
            <a href={track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {track.album.name}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  )
  return (
    <div className='track-table-container'>
      {tracksLst}
    </div>
  )
}
