import React from 'react';
import './styles/NavBar.css';
import { Link } from 'react-router-dom';
import apiCredentials from "../apiCredentials.json"
import spotifyLogo from "./Spotify_Primary_Logo_RGB_White.png"
const clientID = apiCredentials.clientID
const REDIRECT_URI = "http://localhost:3000"

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"
const SCOPE = 'user-read-private user-read-email user-top-read playlist-read-private user-library-read'
let spotifyLogin = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`



export default function NavigationBar(props) {
  return (
    <div className='nav-background'>
        <ul id ="nav">

          <li><div className='nav-bar-item'><Link to="..">Home</Link></div></li> {/*links to root home page */}
          <li><div className='nav-bar-item'><Link to="tracks">Tracks</Link></div></li>
          <li><div className='nav-bar-item'><Link to="artists">Artists</Link></div></li>
          <li><div className='nav-bar-item'><Link to="playlists">Playlists</Link></div></li>

          {props.isLoggedIn
            ?  <li>
                <div className='nav-bar-item'>
                  <a href="/home" onClick={props.onLogout}>Logout</a>
                  <img src={spotifyLogo} className="spotify-logo" alt="SpotifyLogo"></img>
                </div>
              </li>
            :  <li>
                <div className='nav-bar-item'>
                  <a href={spotifyLogin}>Login</a>
                  <img src={spotifyLogo} className="spotify-logo" alt="SpotifyLogo"></img>
                </div>
              </li>
          }
        </ul>
        <div className="gradient">
          
        </div>
    </div>
  
  )
}
