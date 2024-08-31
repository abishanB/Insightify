import React from 'react';
import { useState, useEffect, useRef } from 'react';
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


export default function DisplayPlaylists({token, storedUserPlaylists, updateUserPlaylistsFunc }) {
  const [playlists, setPlaylists] = useState(storedUserPlaylists)
  const [error, setError] = useState(false)
  const firstUpdate = useRef(true);//check if component has initially rendered
  const maxPlaylists = 100;
  if (error){throw new Error("Can't fetch user playlists")}

  useEffect(() => {//on page load
    if (playlists.length!==0){return}

    let playlistPerCallLimit = 50;//number of playlists to get each call, max 50 
    let userPlaylistsEndpoint = `https://api.spotify.com/v1/me/playlists?limit=${playlistPerCallLimit}` //inital endpoint to get user playlists
    getPlaylists([], userPlaylistsEndpoint)//pass empty lst for inital set of playlists
    // eslint-disable-next-line
  }, []);

  useEffect(() => {//pass playlists to parent component to store to prevent unnessecary api calls
    if (firstUpdate.current) {//dont run this effect on inital render
      firstUpdate.current = false;
      return;}

    updateUserPlaylistsFunc(playlists)
    // eslint-disable-next-line
  }, [playlists]);

  function getPlaylists(setOfPlaylists, nextEndpoint){
    //if next endpoint doesnt exist set state and return func
    //else make a api call to the endpoint then call function again while adding to the list of tracks
    if (nextEndpoint === null || setOfPlaylists >= maxPlaylists) {//only return up to 100 playlists
      setPlaylists(removeDJPlaylist(setOfPlaylists))
      return
    }
    
    const promise = getUserPlaylists(token, nextEndpoint)
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
        <h1 className="page-title">Your Playlists ({playlists.length})</h1>
        <div className="playlistsContainer">
          {renderPlaylists(playlists)}
        </div>
      </div>
    </div>
  )
}
