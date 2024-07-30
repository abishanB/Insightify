import React from 'react'

function renderArtists(aritsts){
  const myLst =  Object.entries(aritsts).map(([artistIndex, artist]) => 
    <div key={artistIndex}className="playlist-artist-listing">
      <table >
        <colgroup>
          <col width="35px"/>
          <col width="60px"/>
          <col width="275px"/>
          <col width="120px"/>
        </colgroup>
  
        <tbody>
          <tr>
            <td>{parseInt(artistIndex)+1}</td> 
            <td>
              <a href={artist[1].href} target="_blank" rel="noopener noreferrer">
                <img src={artist[1].imageURL} class='artistCover' alt="artistImg" loading='eager'/>
              </a>
            </td>
            <td>{artist[0]}</td>
            <td className='item-occurences'>{artist[1].totalOccurences} Songs</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
  return myLst
}

export default function TopArtistsAlbums(props) {
  const playlist = props.playlist // may not be needed
  const topArtists = props.topArtists //{index: [artist, {id , href, imageURL, totalOccurences}]}
  const topAlbums = props.topAlbums

  const numOfTopItems = 20;//max amount of top artists and albums to display
  const slicedTopArtists = Object.fromEntries(Object.entries(topArtists).slice(0,numOfTopItems))
  const slicedTopAlbums = Object.fromEntries(Object.entries(topAlbums).slice(0,numOfTopItems))

  return (
    <div id="top-artists-albums-card" className="playlist-card">
      <h1 className="card-title">Top Artists</h1>
      
      <div className="top-artists">
        {renderArtists(slicedTopArtists)}
      </div>
    </div>
  )
}
