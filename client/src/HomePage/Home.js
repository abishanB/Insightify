import React, {useEffect, useState} from 'react'
import "./Home.css"
import { getEndpointResult } from '../apiCalls';
import LoadingIcon from '../components/LoadingIcon';
import { Link } from 'react-router-dom';
import spotifyLogo from "../icon.png"
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI
//Links to tracks, artists, and playlists page
//Displays top track's artist image and top artist image
function getSpotifyLoginURL(redirect_uri){//return spotify login url with correct redirectURI
  const clientID = process.env.REACT_APP_CLIENT_ID
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "code"
  const SCOPE = 'user-read-private user-read-email user-top-read playlist-read-private user-library-read'
  return `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${redirect_uri}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&show_dialog=true`
}
//`${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRCT_URI2}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
export default function Home({token , topTracksObj, updateTopTracksFunc, topArtistsObj, updateTopArtistsFunc, isLoggedIn}) {
  const [topTrackImg, setTopTrackImg] = useState(null)
  const [topArtistImg, setTopArtistImg] = useState(null)
  var URI = REDIRECT_URI;

  useEffect(() => {//on component load, fetches top items if nessecary
    if (isLoggedIn === false){
      setTopArtistImg(spotifyLogo)
      setTopTrackImg(spotifyLogo)
      return
    }
    //top tracks / artists are empty
    if (topTracksObj.short_term.items === null || topArtistsObj.short_term.items === null){return}

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
        return;
      }
      let updatedItems = { ...topItems };//create copy of items
      if (moreItemsResult.total === 0){//if no top tracks/artists yet
        updatedItems.short_term.items = null;
      } else {
        updatedItems.short_term.items = moreItemsResult.items
        updatedItems.short_term.next = moreItemsResult.next
      }
      if (type==='tracks'){
        if (moreItemsResult.total === 0){
          setTopTrackImg(spotifyLogo)
        } else {setTopTrackImg(updatedItems.short_term.items[0].album.images[0].url)}
        updateTopTracksFunc(updatedItems)
      }
      if (type==="artists"){
        if (moreItemsResult.total === 0){
          setTopArtistImg(spotifyLogo)
        } else {setTopArtistImg(updatedItems.short_term.items[0].images[0].url)}
        updateTopArtistsFunc(updatedItems)
      }
      
    });
  }

  if (topTrackImg==null || topArtistImg==null) return <LoadingIcon/>
  return (
    <React.Fragment>
      <div className='page-card-container'>
      {!isLoggedIn 
      ?
      <div className='login-field'>
        <a href={getSpotifyLoginURL(URI)}>
          <div className='login-btn'>
              <span>Login With Spoitfy</span>
          </div>
        </a>
        <span className='login-confirm'>By loggin in, you agree to our <a href='/privacy'>privacy policy</a> and <a href='/end-user-agreement'>end user agreement</a></span>
      </div>
      :<></>
      }

      <Link to={isLoggedIn ? "tracks" : getSpotifyLoginURL(`${URI}/tracks`)} style={{ textDecoration: 'none' }}>
        <div className="home-cards">
          <div className="top-item-img">
            <img src={topTrackImg} alt="topTrackImg" loading='lazy'/>
          </div>
          <div className="view-top-items">
              <span>View Your Top Tracks</span>
          </div>
        </div>
      </Link>

      <Link to={isLoggedIn ? "artists" : getSpotifyLoginURL(`${URI}/artists`)} style={{ textDecoration: 'none' }}>
        <div className="home-cards">
          <div className="view-top-items">
              <span>View Your Top Artists</span>
          </div>
          <div className="top-item-img">
            <img src={topArtistImg} alt="topArtistImg" loading='lazy'/>
          </div>   
        </div>
      </Link>

      <Link to={isLoggedIn ? "playlists" : getSpotifyLoginURL(`${URI}/playlists`)} style={{ textDecoration: 'none' }}>
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
