import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { getEndpointResult } from '../apiCalls.js';
import LoadingIcon from '../components/LoadingIcon.js'
import './styles/DisplayPlaylists.css'; 
import { Link } from 'react-router-dom';

function removeSpotifyPlaylists(playlistsObj){//removes spotify dj & spotify playlists which return as null
  for (var i = playlistsObj.length - 1; i >= 0; i--) {//remove spotify generated playlists, ie
    if (playlistsObj[i] == null){//if playlist is null, playlists created by spotify return
      playlistsObj.splice(i, 1)
      continue
    }
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

function renderPlaylists(playlists) {//jsx for playlist buttons
  const playlistsLstHTML = Object.entries(playlists).map(([key, playlist]) =>
    <Link className="playlist-item" key={key} to={`/playlists/${playlist.id}`}>
      <img src={playlistCoverURL(playlist)} className='playlist-cover' alt="playlistImg" loading='lazy'/>
      <span className='playlist-name'>{playlist.name}</span>
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
    let likedSongsPlaylist = {
      id: 'liked_songs',
      name: "Liked Songs",
      images: [{url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png'}]
    }
    getPlaylists([likedSongsPlaylist], userPlaylistsEndpoint)//pass empty lst for inital set of playlists
    // eslint-disable-next-line
  }, []);

  useEffect(() => {//pass playlists to parent component to store to prevent unnessecary api calls
    if (firstUpdate.current) {//dont run this effect on inital render
      firstUpdate.current = false;
      return;}
    updateUserPlaylistsFunc(playlists)
    // eslint-disable-next-line
  }, [playlists]);

  function getPlaylists(playlistsArr, nextEndpoint){
    //if next endpoint doesnt exist set state and return func
    //else make a api call to the endpoint then call function again while adding to the list of tracks
    if (nextEndpoint === null || playlistsArr >= maxPlaylists) {//only return up to 100 playlists
      setPlaylists(removeSpotifyPlaylists(playlistsArr))
      return
    }
    
    const promise = getEndpointResult(token, nextEndpoint, "fetching user playlists")
    promise.then(function(playlistsObj) {
      if (playlistsObj === false){
        setError(true)
        return
      }
      getPlaylists(playlistsArr.concat(playlistsObj.items), playlistsObj.next)
    });
  }
 
  if (playlists==null || playlists.length === 0){//loading effect if api call not finished
    return (<LoadingIcon />)
  }  

  return (
    <React.Fragment>
      <h1 className="page-title">Your Playlists ({playlists.length})</h1>
      <div className="playlist-container">
        {renderPlaylists(playlists)}
      </div>
      <div  style={{height: 20}}></div>
    </React.Fragment>
  )
}
