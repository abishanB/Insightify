import React from 'react';
import './Artists.css';
//render top artists in a list format with 2 coloums

function artistListingHTML(artist, artistRank){
  const imageSize = 80;
  return (
    <table key ={artistRank} className='artistTable'>
        <colgroup>
          <col width="58px"/>{/* Artist Rank*/}
          <col width="95px"/>{/*  Image */}
          <col width="340px"/>{/* Artist*/}
         
        </colgroup>

        <tbody>
          <tr className='track'>
            <td className="artistRank">{artistRank}</td>
            <td>
              <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={artist.images[0].url} className='artistCover' height={imageSize} width={imageSize} alt="artistImg" loading='lazy'/>
              </a>
            </td>
            <td className="artistName">{artist.name}</td>
          </tr>
        </tbody>
      </table>
  )
}

export default function RenderArtists({artists}){
  const leftArtistCol = Object.entries(artists).map(([artistRank, artist]) => {//left column of artists, odd numbers
    if ((parseInt(artistRank)+1) % 2===0){return null}
    return (artistListingHTML(artist, parseInt(artistRank)+1)) 
  })

  const rightArtistCol = Object.entries(artists).map(([artistRank, artist]) => {//right column of artists, even numbers
    if ((parseInt(artistRank)+1) % 2===1){return null}
    return (artistListingHTML(artist, parseInt(artistRank)+1)) 
  })

  return (
    <div className='artistList'>
      <div>
        {leftArtistCol}
      </div>
      <div>
        {rightArtistCol}
      </div>
    </div>
  )
}
