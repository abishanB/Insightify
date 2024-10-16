import React, {useEffect, useState} from 'react'
import "./Home.css"
import { getEndpointResult } from '../apiCalls';
import LoadingIcon from '../components/LoadingIcon';
import { Link } from 'react-router-dom';
//Links to tracks, artists, and playlists page
//Displays top track's artist image and top artist image

export default function Home({token , topTracksObj, updateTopTracksFunc, topArtistsObj, updateTopArtistsFunc}) {
  const [topTrackImg, setTopTrackImg] = useState(null)
  const [topArtistImg, setTopArtistImg] = useState(null)
  const [error, setError] = useState(false);

  useEffect(() => {//on component load, fetches top items if nessecary
    if (topTracksObj.short_term.items.length===0){//if any tracks havent been loaded 
      getFirstSetTopItems(topTracksObj, "tracks")
    } 
    else if (topTracksObj.short_term.hasOwnProperty("topTrackArtistImg")){//the artists image for the top track has been loaded
      setTopTrackImg(topTracksObj.short_term.topTrackArtistImg)
    } else {//if tracks have been loaded but top track's artist image hasnt been retrieved
      getTopTrackArtistImg(topTracksObj.short_term.items[0].artists[0].href, topTracksObj)
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
        getTopTrackArtistImg(updatedItems.short_term.items[0].artists[0].href, updatedItems)
      }
      if (type==="artists"){
        setTopArtistImg(updatedItems.short_term.items[0].images[0].url)
        updateTopArtistsFunc(updatedItems)
      }
      
    }).catch(() => setError(true));
  }

  function getTopTrackArtistImg(artistEndpoint, updatedTopTracks){
    //get top artist image to display for the top track which is not given by top_items endpoint
    //cannot use track image because image needs to be circle
    const promise = getEndpointResult(token, artistEndpoint, `fetching artist image URL`);
    promise.then((artistResult) => {
      if (artistResult === false){
        setError(true);
        return;
      }
      Object.defineProperty(updatedTopTracks.short_term, "topTrackArtistImg",{//define property for image
        value: artistResult.images[0].url,
        writable:false
      })
      setTopTrackImg(artistResult.images[0].url)
      updateTopTracksFunc(updatedTopTracks)
      
    }).catch(() => setError(true));
  }

  if (topTrackImg==null || topArtistImg==null) return <LoadingIcon/>
  return (
    <div className='page-card-container'>
      <Link to="tracks" style={{ textDecoration: 'none' }}>
        <div className="home-cards">
          <div className="top-item-img">
            <img src={topTrackImg} alt="topTrackImg" loading='lazy'/>
          </div>
          <div className="view-top-items">
            <div className="view-top-items-link">
                <span>View Your Top Tracks</span>
            </div>    
          </div>
        </div>
      </Link>

      <Link to="artists" style={{ textDecoration: 'none' }}>
        <div className="home-cards">
          <div className="view-top-items">
            <div className="view-top-items-link">
                <span>View Your Top Artists</span>
            </div>
          </div>
          <div className="top-item-img">
            <img src={topArtistImg} alt="topArtistImg" loading='lazy'/>
          </div>   
        </div>
      </Link>

      <Link to="playlists" style={{ textDecoration: 'none' }}>
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
  )
} 
