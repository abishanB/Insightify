import React from 'react';
import LoadingIcon from '../components/LoadingIcon.js'
import './Playlists.css'; 


export function playlistCoverURL(playlist){//check if playlist cover is given and render cover
 
  const noCoverURL='https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999'
  if (playlist.images===null){//if playlist cover is not provided
    return noCoverURL
  }
  return playlist.images[0].url
}

export default function DisplayPlaylists(props) {

  const playlistsArr = props.playlists
  if (playlistsArr==null || playlistsArr.length === 0){//loading effect if api call not finished
    return (
      <LoadingIcon />
    )
  }  

  for (var i = playlistsArr.length - 1; i >= 0; i--) {//remove spotify generated playlists
    if (playlistsArr[i].owner.id==="spotify") { 
      playlistsArr.splice(i, 1);
    }
} 

  //create html list of playlists
  const myLst = Object.entries(playlistsArr).map(([key, playlist]) =>
    <a class="playlistBlock" key={key} href={`/playlists/${playlist.id}`}>
      <img src={playlistCoverURL(playlist)} class='playlistCover' alt="playlistImg" loading='lazy'/>
      <span className='playlistCaption'>{playlist.name}</span>
    </a>

  )
  
  return (
      <div class="playlistsContainer">
      {myLst}
      </div>

  )
}
