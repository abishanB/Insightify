import React from 'react'
import "./styles/PlaylistTopArtistsAlbums.css"
function renderArtists(aritsts){
  const myLst =  Object.entries(aritsts).map(([artistIndex, artist]) => 
    <div key={artistIndex}className="playlist-top-items-listing">
      <table >
        <colgroup>
          <col width="32px"/> {/* rank */}
          <col width="55px"/>  {/* image */}
          <col width="340px"/>  {/* name */}
          <col width="200px"/>  {/* # of songs */}
        </colgroup>
  
        <tbody>
          <tr>
            <td className='playlist-top-items-rank'>{parseInt(artistIndex)+1}</td> 
            <td className="playlist-top-items-image">
              <a  href={artist[1].href} target="_blank" rel="noopener noreferrer">
                <img src={artist[1].imageURL} className='playlist-artist-cover' alt="artistImg" loading='eager'/>
              </a>
            </td>
            <td >{artist[0]}</td>
            <td className='item-occurences'>{artist[1].totalOccurences} Songs</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
  return myLst
}

function renderAlbums(albums){
  const myLst =  Object.entries(albums).map(([albumIndex, album]) => 
    <div key={albumIndex} className="playlist-top-items-listing">
      <table >
        <colgroup>
          <col width="32px"/>{/* rank */}
          <col width="55px"/>{/* image */}
          <col width="405px"/> {/* name */} 
          <col width="135px"/>  {/* # of songs */}
        </colgroup>
  
        <tbody>
          <tr>
            <td className='playlist-top-items-rank'>{parseInt(albumIndex)+1}</td> 
            <td className="playlist-top-items-image">
              <a href={album[1].href} target="_blank" rel="noopener noreferrer">
                <img src={album[1].imageURL} alt="artistImg" loading='eager'/>
              </a>
            </td>
            <td>{album[0]}</td>
            <td className='item-occurences'>{album[1].totalOccurences} Songs</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
  return myLst
}

export default function TopArtistsAlbums(props) {
  const topArtists = props.topArtists //{index: [artist, {id , href, imageURL, totalOccurences}]}
  const topAlbums = props.topAlbums

  const numOfTopItems = 20;//max amount of top artists and albums to display
  const slicedTopArtists = Object.fromEntries(Object.entries(topArtists).slice(0,numOfTopItems))
  const slicedTopAlbums = Object.fromEntries(Object.entries(topAlbums).slice(0,numOfTopItems))

  return (
    <div id="top-artists-albums-card" className="playlist-card">
      <div className='top-artists-albums-container'>
        <div>
          <h2 className="top-items-title">Top Artists</h2>
          <div className="top-items-list">{renderArtists(slicedTopArtists)}</div>
        </div>

        <div>
          <h2 className="top-items-title">Top Albums</h2>
          <div className="top-items-list"> {renderAlbums(slicedTopAlbums)}</div>
        </div>
      </div>
    </div>
  )
}
