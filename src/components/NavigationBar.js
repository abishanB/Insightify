import React from 'react';
import './styles/NavBar.css';

//old app
//const clientID = '9d10477046f3462db2028606fde3e774';
//const clientID = 'ca8aec9757ef4c1e9ea2f772f8a3d9b3'
const clientID = 'REMOVED'
const REDIRECT_URI = "http://localhost:3000"
//const REDIRECT_URI = "https://xgr3v7zh-3000.use.devtunnels.ms/"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"
const SCOPE = 'user-read-private user-read-email user-top-read playlist-read-private user-library-read'
let spotifyLogin = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
export default function NavigationBar(props) {
  return (
    <div>
        <ul id="nav">
          <li><div class='navBarItem'><a href="/home">Home</a></div></li>
          <li><div class='navBarItem'><a href="/tracks">Tracks</a></div></li>
          <li><div class='navBarItem'><a href="/artists">Artists</a></div></li>
          <li><div class='navBarItem'><a href="/playlists">Playlists</a></div></li>

          {props.isLoggedIn
            ?  <li><div class='navBarItem'><a href="/home" onClick={props.onLogout}>Logout</a></div></li>
            :  <li><div class='navBarItem'><a href={spotifyLogin}>Login</a></div></li>
          }


        </ul>
        <div className="gradient">
          
        </div>
    </div>
  
  )
}
