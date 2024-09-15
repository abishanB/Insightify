import React from 'react';
import './styles/NavBar.css';
import { Link } from 'react-router-dom';
import apiCredentials from "../apiCredentials.json"

const clientID = apiCredentials.clientID
const REDIRECT_URI = "http://localhost:3000"

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"
const SCOPE = 'user-read-private user-read-email user-top-read playlist-read-private user-library-read'
let spotifyLogin = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
export default function NavigationBar(props) {
  return (
    <div>
        <ul id="nav">
          <li><div className='navBarItem'><Link to="..">Home</Link></div></li> {/*links to root home page */}
          <li><div className='navBarItem'><Link to="tracks">Tracks</Link></div></li>
          <li><div className='navBarItem'><Link to="artists">Artists</Link></div></li>
          <li><div className='navBarItem'><Link to="playlists">Playlists</Link></div></li>

          {props.isLoggedIn
            ?  <li><div className='navBarItem'><a href="/home" onClick={props.onLogout}>Logout</a></div></li>
            :  <li><div className='navBarItem'><a href={spotifyLogin}>Login</a></div></li>
          }
        </ul>
        <div className="gradient">
          
        </div>
    </div>
  
  )
}
