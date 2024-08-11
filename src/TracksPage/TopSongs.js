import React from 'react';
import './Tracks.css';
import LoadingIcon from '../components/LoadingIcon';
export default function topSongs(props){  
  const tracksObj = props.tracks 

  if (tracksObj==null || tracksObj.length === 0){//temporary
    return (
      <div className='trackList'> {/* class keeps content from being bordered by tab-container */}
        <LoadingIcon/>
      </div> 
    )
  }
  const myLst =  Object.entries(tracksObj).map(([trackRank, track]) =>
    <table key= {trackRank} className='trackTable'>
      <colgroup>
        <col width="25px"/>{/* Track Rank*/}
        <col width="48px"/>{/* Track Image */}
        <col width="500px"/>{/* Title*/}
        <col width="450px"/>{/* Artist*/}
        <col width="500px"/>{/* Album*/} 
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
      {myLst}
      <div style={{height:25}}></div>
    </div>
  )
}
