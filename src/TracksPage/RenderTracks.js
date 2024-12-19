import React from 'react';
import './Tracks.css';

//display top tracks in list format
export default function RenderTracks({tracks}){  
  const tracksLst =  Object.entries(tracks).map(([trackRank, track]) =>
    <table key= {trackRank} className='track-table'>
      <colgroup>
        <col width="38px"/>{/* Track Rank*/}
        <col width="48px"/>{/* Track Image */}
        <col width="420px"/>{/* Title*/}
        <col width="340px"/>{/* Artist*/} 
        <col width="275px"/>{/* Album*/} 
      </colgroup>

      <tbody>
        <tr key={trackRank} className='track'>
          <td className="track-rank">{parseInt(trackRank)+1}</td>
          <td>
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img src={track.album.images[0].url} className='track-cover' height="42" width="42" alt="albumImg" loading='lazy'/>
            </a>
          </td>
          <td className='track-name'> {track.name}</td>
          <td className='track-artist-name'>{track.artists[0].name} </td>
          <td className='track-album'>{track.album.name}</td>
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
