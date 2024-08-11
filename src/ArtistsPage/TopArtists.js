import React from 'react';
import LoadingIcon from '../components/LoadingIcon';
import './Artists.css';
const imageSize = 80;
export default function topArtists(props){
  const artistsObj = props.artists
  if (artistsObj==null ||artistsObj.length===0){//temporary
    return (
    <div className='trackList'> {/* class keeps content from being bordered by tab-container */}
      <LoadingIcon/> 
    </div> 
  )  
  }
  const myLst = Object.keys(artistsObj).map(function(artistRank) {
    if ((parseInt(artistRank)+1) % 2===0){return null}
  
    return (
      <table key ={artistRank} className='artistTable'>
        {/*<button onClick={console.log(artistKeys)}>{artistRank}</button>*/}
        <colgroup>
          <col width="35px"/>{/* Artist Rank*/}
          <col width="95px"/>{/*  Image */}
          <col width="370px"/>{/* Artist*/}
          <col width="35px"/>{/* Artist Rank*/}
          <col width="95px"/>{/*  Image */} 
          <col width="370px"/>{/* Artist*/}
        </colgroup>

        <tbody>
          <tr className='track'>
            <td className="artistRank">{parseInt(artistRank)+1}</td>
            <td>
              <a href={artistsObj[artistRank].external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={artistsObj[artistRank].images[2].url} className='artistCover' height={imageSize} width={imageSize} alt="artistImg" loading='lazy'/>
              </a>
            </td>
            <td  className="artistName">{artistsObj[artistRank].name}</td>
            
            <td className="artistRank">{parseInt(artistRank)+2}</td>
            <td>
              <a href={artistsObj[parseInt(artistRank)+1].external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={artistsObj[parseInt(artistRank)+1].images[2].url} className='artistCover' height={imageSize} width={imageSize} alt="artistImg" loading='lazy'/>
              </a>
            </td>
            <td className="artistName"> {artistsObj[parseInt(artistRank)+1].name}</td>
          </tr>
        </tbody>
      </table>
  )})

    return (
        <div className='artistList'>
          {myLst}
          <div style={{height:20}}></div>
        </div>
      )
}
