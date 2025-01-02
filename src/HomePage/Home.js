import React, {useEffect, useState} from 'react'
import "./Home.css"
import { getEndpointResult } from '../apiCalls';
import LoadingIcon from '../components/LoadingIcon';
import { Link } from 'react-router-dom';
import spotifyLogo from "../components/Spotify_Primary_Logo_RGB_White.png"
import apiCredentials from "../apiCredentials.json"  
//Links to tracks, artists, and playlists page
//Displays top track's artist image and top artist image

function getSpotifyLoginURL(redirect_uri="http://localhost:3000"){//return spotify login url with correct redirectURI
  const clientID = apiCredentials.clientID
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "code"
  const SCOPE = 'user-read-private user-read-email user-top-read playlist-read-private user-library-read'
  return `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${redirect_uri}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&show_dialog=true`
}
//`${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRCT_URI2}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
export default function Home({token , topTracksObj, updateTopTracksFunc, topArtistsObj, updateTopArtistsFunc, isLoggedIn}) {
  const [topTrackImg, setTopTrackImg] = useState(null)
  const [topArtistImg, setTopArtistImg] = useState(null)
  const [error, setError] = useState(false);

  useEffect(() => {//on component load, fetches top items if nessecary
    if (isLoggedIn === false){
      setTopTrackImg(spotifyLogo)
      setTopArtistImg(spotifyLogo)
      return
    }

    if (topTracksObj.short_term.items.length===0){//if any tracks havent been loaded 
      getFirstSetTopItems(topTracksObj, "tracks")
    } 
    else {
      setTopTrackImg(topTracksObj.short_term.items[0].album.images[0].url)
    }
      
    if (topArtistsObj.short_term.items.length===0){//if top artists hasnt been loaded
      getFirstSetTopItems(topArtistsObj, "artists")
    } else {setTopArtistImg(topArtistsObj.short_term.items[0].images[0].url)}
    // eslint-disable-next-line
  }, []);

  function getFirstSetTopItems(topItems, type){
    //retrieves the first 50 topItems, tracks or artists, so that images can be displayed on home page
    //Items are passed to parent function so that they need not to be reloaded on tracks or artists page
    const promise = getEndpointResult(token, topItems.short_term.next, `fetching more ${type} - short_term`);
    promise.then((moreItemsResult) => {
      if (moreItemsResult === false){
        setError(true);
        return;
      }
      let updatedItems = { ...topItems };//create copy of items
      updatedItems.short_term.items = moreItemsResult.items
      updatedItems.short_term.next = moreItemsResult.next

      if (type==='tracks'){
        setTopTrackImg(updatedItems.short_term.items[0].album.images[0].url)
        updateTopTracksFunc(updatedItems)
      }
      if (type==="artists"){
        setTopArtistImg(updatedItems.short_term.items[0].images[0].url)
        updateTopArtistsFunc(updatedItems)
      }
      
    }).catch(() => setError(true));
  }

  if ((topTrackImg==null || topArtistImg==null) && isLoggedIn===true) return <LoadingIcon/>
  return (
    <React.Fragment>
    {!isLoggedIn 
    ?
    <a href={getSpotifyLoginURL("http://localhost:3000")}>
      <div className='login-btn'>
          <span>Login With Spoitfy</span>
      </div>
    </a>
    :<></>
    }
    <div className='page-card-container'>
      <Link to={isLoggedIn ? "tracks" : getSpotifyLoginURL("http://localhost:3000/tracks")} style={{ textDecoration: 'none' }}>
        <div className="home-cards">
          <div className="top-item-img">
            <img src={topTrackImg} alt="topTrackImg" loading='lazy'/>
          </div>
          <div className="view-top-items">
              <span>View Your Top Tracks</span>
          </div>
        </div>
      </Link>

      <Link to={isLoggedIn ? "artists" : getSpotifyLoginURL("http://localhost:3000/artists")} style={{ textDecoration: 'none' }}>
        <div className="home-cards">
          <div className="view-top-items">
              <span>View Your Top Artists</span>
          </div>
          <div className="top-item-img">
            <img src={topArtistImg} alt="topArtistImg" loading='lazy'/>
          </div>   
        </div>
      </Link>

      <Link to={isLoggedIn ? "playlists" : getSpotifyLoginURL("http://localhost:3000/playlists")} style={{ textDecoration: 'none' }}>
         <div className="home-cards">
            <div className="home-playlist-card">
              <div>
                <span>View Your Playlists</span>
                <span>Get an analysis for your playlists</span>
              </div>
            </div>
         </div>
      </Link>
    </div>
 
    </React.Fragment>
  )
} 
