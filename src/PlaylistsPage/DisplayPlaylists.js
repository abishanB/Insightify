import React from 'react';
import { useState, useEffect } from 'react';
import { getUserPlaylists } from '../apiCalls.js';
import LoadingIcon from '../components/LoadingIcon.js'
import './Playlists.css'; 
import { Link } from 'react-router-dom';

function removeDJPlaylist(playlistsObj){
  
  for (var i = playlistsObj.length - 1; i >= 0; i--) {//remove spotify generated playlists
    if (playlistsObj[i].name==="DJ") { 
      playlistsObj.splice(i, 1);
    }
  }
  return playlistsObj
}

export function playlistCoverURL(playlist){//check if playlist cover is given and render cover
 
  const noCoverURL='https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999'
  if (playlist.images===null){//if playlist cover is not provided
    return noCoverURL
  }
  return playlist.images[0].url
}

function renderPlaylists(playlists) {
  const playlistsLstHTML = Object.entries(playlists).map(([key, playlist]) =>
    <Link className="playlistBlock" key={key} to={`/playlists/${playlist.id}`}>
      <img src={playlistCoverURL(playlist)} class='playlistCover' alt="playlistImg" loading='lazy'/>
      <span className='playlistCaption'>{playlist.name}</span>
    </Link>
  )
  return playlistsLstHTML
}


export default function DisplayPlaylists(props) {
  const [playlists, setPlaylists] = useState([])
  const [error, setError] = useState(false)

  if (error){
    
    throw new Error("Can't fetch user playlists")
  }
  useEffect(() => {//on page load
    let limit = 50;//number of playlists to get, max 50 
    let userPlaylistsEndpoint = `https://api.spotify.com/v1/me/playlists?limit=${limit}` //inital endpoint to get user playlists
    getPlaylists([], userPlaylistsEndpoint)//pass empty lst for inital set of playlists
    // eslint-disable-next-line
  }, []);



  function getPlaylists(setOfPlaylists, nextEndpoint){
    //if next endpoint doesnt exist set state and return func
    //else make a api call to the endpoint then call function again while adding to the list of tracks
    if (nextEndpoint === null || setOfPlaylists >= 100) {//only return up to 100 playlists
      setPlaylists(removeDJPlaylist(setOfPlaylists))
      return
    }
    
    const promise = getUserPlaylists(props.token, nextEndpoint)
    promise.then(function(playlistsObj) {
      if (playlistsObj === false){
        setError(true)
        return
      }
      getPlaylists(setOfPlaylists.concat(playlistsObj.items), playlistsObj.next)
    });
  }


 
  if (playlists==null || playlists.length === 0){//loading effect if api call not finished
    return (<LoadingIcon />)
  }  

  return (
    <div>
      <div>
        <h1 className="page-title">Your Playlists ({playlists.length}) </h1>
        <div className="playlistsContainer">
          {renderPlaylists(playlists)}
        </div>
      </div>
    </div>
  )
}
