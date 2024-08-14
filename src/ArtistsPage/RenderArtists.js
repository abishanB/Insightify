import React from 'react';
import LoadingIcon from '../components/LoadingIcon';
import './Artists.css';
//render top artists in a list format


function artistListing(artist, artistRank){
  const imageSize = 80;
  return (
    <table key ={artistRank} className='artistTable'>
        <colgroup>
          <col width="35px"/>{/* Artist Rank*/}
          <col width="95px"/>{/*  Image */}
          <col width="370px"/>{/* Artist*/}
         
        </colgroup>

        <tbody>
          <tr className='track'>
            <td className="artistRank">{artistRank}</td>
            <td>
              <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={artist.images[2].url} className='artistCover' height={imageSize} width={imageSize} alt="artistImg" loading='lazy'/>
              </a>
            </td>
            <td  className="artistName">{artist.name}</td>
            
          </tr>
        </tbody>
      </table>
  )
}

export default function RenderArtists(props){
  const artistsObj = props.artists.items
  
  const leftArtistCol = Object.entries(artistsObj).map(([artistRank, artist]) => {//left column of artists, odd numbers
    if ((parseInt(artistRank)+1) % 2===0){return null}
    return (artistListing(artist, parseInt(artistRank)+1)) 
  })

  const rightArtistCol = Object.entries(artistsObj).map(([artistRank, artist]) => {//right column of artists, even numbers
    if ((parseInt(artistRank)+1) % 2===1){return null}
    return (artistListing(artist, parseInt(artistRank)+1)) 
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
