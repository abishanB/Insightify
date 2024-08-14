import React from 'react';
import './Tracks.css';

//display top tracks in list format
export default function RenderTracks({tracks}){  
  const tracksLst =  Object.entries(tracks).map(([trackRank, track]) =>
    <table key= {trackRank} className='trackTable'>
      <colgroup>
        <col width="25px"/>{/* Track Rank*/}
        <col width="48px"/>{/* Track Image */}
        <col width="520px"/>{/* Title*/}
        <col width="350px"/>{/* Artist*/}
        <col width="520px"/>{/* Album*/} 
      </colgroup>

      <tbody>
        <tr key={trackRank} className='track'>
          <td className="trackRank">{parseInt(trackRank)+1}</td>
          <td>
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img src={track.album.images[0].url} className='trackCover' height="42" width="42" alt="albumImg" loading='lazy'/>
            </a>
          </td>
          <td> {track.name}</td>
          <td>{track.artists[0].name} </td>
          <td>{track.album.name}</td>
        </tr>
      </tbody>
    </table>
  )
  return (
    <div className='trackList'>
      {tracksLst}
    </div>
  )
}
