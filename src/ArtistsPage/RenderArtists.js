import React from 'react';
import './Artists.css';
//render top artists in a list format with 2 coloums

function artistListingHTML(artist, artistRank){
  const imageSize = 80;
  return (
    <table key ={artistRank} className="artist-table-listing">
        <colgroup>
          <col />{/* Artist Rank*/}
          <col />{/*  Image */}
          <col />{/* Artist Name*/}
        </colgroup>

        <tbody>
          <tr className='track'>
            <td className="artist-rank">{artistRank}</td>
            <td className='artist-cover'>
              <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={artist.images[0].url}  height={imageSize} width={imageSize} alt="artistImg" loading='lazy'/>
              </a>
            </td>
            <td className="artist-name">{artist.name}</td>
          </tr>
        </tbody>
      </table>
  )
}

export default function RenderArtists({artists}){
  const artistListings = Object.entries(artists).map(([artistRank, artist]) => {//left column of artists, odd numbers
    return (artistListingHTML(artist, parseInt(artistRank)+1)) 
  })
  return (
    <div className='artist-list'>
      {artistListings}
    </div>
  )
}
