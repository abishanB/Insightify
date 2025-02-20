import React, {useState, useRef, useEffect} from 'react';
import './styles/NavBar.css';
import { Link } from 'react-router-dom';
import spotifyIcon from "../Spotify_Primary_Logo_RGB_White.png"
import InsightifyIcon from "../icon.png"
import dropdownArrow from "./dropdown.png"
 
export default function NavigationBar(props) {
  const clientID = process.env.REACT_APP_CLIENT_ID
  const APP_SCOPE = process.env.REACT_APP_SCOPE
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "code"
  var href = window.location.href
  var REDIRECT_URI;
  if (href.includes("localhost")){REDIRECT_URI = "http://localhost:3000"}
  if (href.includes("10.0.0.7")){REDIRECT_URI = "http://10.0.0.7:3000"}
  const spotifyLogin = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${APP_SCOPE}&show_dialog=true`

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a reference to the dropdown container
  
  const toggleDropdown = () => {setIsDropdownOpen(!isDropdownOpen);};

  useEffect(() => {
    //if dropdown is open and elsewhere is clicked close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
        <ul id ="nav">
          <li className='nav-bar-logo'> 
              <Link to=".."> {/*links to root home page */}
              Insightify
              <img src={InsightifyIcon} className="icon" alt="icon"></img>
            </Link>
          </li> 
          <li className='nav-bar-link'><Link to="tracks">Tracks</Link></li>
          <li className='nav-bar-link'><Link to="artists">Artists</Link></li>
          <li className='nav-bar-link'><Link to="playlists">Playlists</Link></li>

          {props.isLoggedIn
            ? 
            <li>
              <div ref={dropdownRef}>
                <button className="dropdown-btn" onClick={toggleDropdown}>
                  Account
                  <img className="dropdown-arrow" src={dropdownArrow} alt="dropdownArrow"></img>
                </button>
                
                {isDropdownOpen && (
                  <div className='dropdown-menu'>
                    <button className='dropdown-btn' onClick={props.onLogout}>Logout</button>
                  </div>
                )}
              </div>
            </li>
            :  
            <li>
              <a href={spotifyLogin}>
                Login
                <img src={spotifyIcon} className="spotify-icon" alt="SpotifyIcon"></img>
              </a>
            </li>
          }
        </ul>
        <div className="gradient"></div>
    </div>
  )
}
