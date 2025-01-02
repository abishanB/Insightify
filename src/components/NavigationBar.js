import React from 'react';
import './styles/NavBar.css';
import { Link } from 'react-router-dom';
import spotifyIcon from "../Spotify_Primary_Logo_RGB_White.png"
 
export default function NavigationBar(props) {
  const clientID = process.env.REACT_APP_CLIENT_ID
  const APP_SCOPE = process.env.REACT_APP_SCOPE
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "code"
  var href = window.location.href
  if (href.includes("localhost")){var REDIRECT_URI = "http://localhost:3000"}
  if (href.includes("10.0.0.7")){var REDIRECT_URI = "http://10.0.0.7:3000"}
  const spotifyLogin = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${APP_SCOPE}&show_dialog=true`

  return (
    <div>
        <ul id ="nav">
          <li className='nav-bar-logo'><Link to="..">Insightify</Link></li> {/*links to root home page */}
          <li className='nav-bar-link'><Link to="tracks">Tracks</Link></li>
          <li className='nav-bar-link'><Link to="artists">Artists</Link></li>
          <li className='nav-bar-link'><Link to="playlists">Playlists</Link></li>

          {props.isLoggedIn
            ? 
            <li>
              <a href="/home" onClick={props.onLogout}>
              Logout
              <img src={spotifyIcon} className="spotify-icon" alt="SpotifyIcon"></img>
              </a>
            </li>
            :  
            <li>
              <a href={spotifyLogin}>
                Login
                <img src={spotifyIcon} className="spotify-icon" alt="SpotifyLogo"></img>
              </a>
            </li>
          }
        </ul>
        <div className="gradient"></div>
    </div>
  )
}
