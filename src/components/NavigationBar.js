import React from 'react';
import './styles/NavBar.css';
import { Link } from 'react-router-dom';
import apiCredentials from "../apiCredentials.json"
import spotifyIcon from "./Spotify_Primary_Logo_RGB_White.png"
const clientID = apiCredentials.clientID
const APP_SCOPE = apiCredentials.scope
const REDIRECT_URI = "http://localhost:3000"

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"
let spotifyLogin = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${APP_SCOPE}`
 
export default function NavigationBar(props) {
  return (
    <div>
        <ul id ="nav">
          <li className='nav-bar-logo'><Link to="..">BreakdownMusic</Link></li> {/*links to root home page */}
          <li className='nav-bar-link'><Link to="tracks">Tracks</Link></li>
          <li className='nav-bar-link'><Link to="artists">Artists</Link></li>
          <li className='nav-bar-link'><Link to="playlists">Playlists</Link></li>

          {props.isLoggedIn
            ? 
                <li>
                  <a className='logout-btn' href="/home" onClick={props.onLogout}>
                  Logout
                  <img src={spotifyIcon} className="spotify-icon" alt="SpotifyIcon"></img>
                  </a>
                </li>
            :  <li>
                <a href={spotifyLogin}>
                  Login
                  <img src={spotifyIcon} className="spotify-logo" alt="SpotifyLogo"></img>
                </a>
              </li>
          }
        
        </ul>
    
        <div className="gradient"></div>
    </div>
  )
}
