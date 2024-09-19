import React, {useEffect, useState} from 'react'
import "./Home.css"
import { getEndpointResult } from '../apiCalls';
import LoadingIcon from '../components/LoadingIcon';

import { Link } from 'react-router-dom';

export default function Home({token , topTracksObj, updateTopTracksFunc, topArtistsObj, updateTopArtistsFunc}) {
  const [topTrackImg, setTopTrackImg] = useState(null)
  const [topArtistImg, setTopArtistImg] = useState(null)
  const [error, setError] = useState(false);

  useEffect(() => {//on component load, fetches top items if nessecary
    if (topTracksObj.short_term.items.length===0){//if any tracks havent been loaded 
      getTopItems(topTracksObj, "tracks")
    } 
    else if (topTracksObj.short_term.hasOwnProperty("topTrackArtistImg")){//the artists image for the top track has been loaded
      setTopTrackImg(topTracksObj.short_term.topTrackArtistImg)
    } else {//if tracks have been loaded but top track artist image hasnt been retrieved
      getArtistImg(topTracksObj.short_term.items[0].artists[0].href, topTracksObj)
    }
      
    if (topArtistsObj.short_term.items.length===0){
      getTopItems(topArtistsObj, "artists")
    } else {setTopArtistImg(topArtistsObj.short_term.items[0].images[0].url)}
  }, []);

  function getTopItems(topItems, type){
    const promise = getEndpointResult(token, topItems.short_term.next, `fetching more ${type} - short_term`);
    promise.then((moreItemsResult) => {
      if (moreItemsResult === false){
        setError(true);
        return;
      }
      let updatedItems = { ...topItems };//create copy of items
      updatedItems.short_term.items = moreItemsResult.items
      updatedItems.short_term.next = moreItemsResult.next

      if (type=='tracks'){
        getArtistImg(updatedItems.short_term.items[0].artists[0].href, updatedItems)
      }
      if (type=="artists"){
        setTopArtistImg(updatedItems.short_term.items[0].images[0].url)
        updateTopArtistsFunc(updatedItems)
      }
      
    }).catch(() => setError(true));
  }

  function getArtistImg(artistEndpoint, updatedTopTracks){
    //get top artist image to display for the top track which is not given by top_items endpoint
    //cannot use track image because image needs to be
    const promise = getEndpointResult(token, artistEndpoint, `fetching artist image URL`);
    promise.then((artistResult) => {
      if (artistResult === false){
        setError(true);
        return;
      }
      Object.defineProperty(updatedTopTracks.short_term, "topTrackArtistImg",{
        value: artistResult.images[0].url,
        writable:false
      })
      console.log(updatedTopTracks)
      setTopTrackImg(artistResult.images[0].url)
      updateTopTracksFunc(updatedTopTracks)
      
    }).catch(() => setError(true));
  }

  if (topTrackImg==null || topArtistImg==null) return <LoadingIcon/>
  return (
    <div className='page-card-container'>
      <Link to="tracks" style={{ textDecoration: 'none' }}>
        <div className="top-item-card">
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
        <div className="top-item-card">
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
    </div>
  )
} 


