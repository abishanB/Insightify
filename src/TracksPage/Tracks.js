import React, { useState, useEffect } from 'react';
import TimeRangeSelector from '../components/TimeRangeSelector.js';
import { getTopItems, getEndpointResult } from '../apiCalls.js';
import RenderTracks from './RenderTracks.js';
import LoadingIcon from '../components/LoadingIcon.js';
export default function Tracks(props){
  const [topTracks, setTopTracks] = useState({
    short_term: {},
    medium_term: {},
    long_term: {},
  });
  const [error, setError] = useState(false);
  const [currentTab, setCurrentTab] = useState("short_term")

  const onTabSwitch = (tabName) => setCurrentTab(tabName)

  useEffect(() => {//on component load
    if (props.topTracks === null) {//if tracks havent been loaded yet
      onGetTopTracks();
      return
    } 
    //if already loaded update state with tracks passed from parent component
    
    setTopTracks(props.topTracks);
    // eslint-disable-next-line
  }, []);

  function onGetTopTracks(){
    const trackPromises = [
      getTopItems(props.token, 'tracks', 'short_term'),
      getTopItems(props.token, 'tracks', 'medium_term'),
      getTopItems(props.token, 'tracks', 'long_term'),
    ];
    
    Promise.all(trackPromises).then((topTracksResults) => {
      if (topTracksResults[0]===false || topTracksResults[1]===false ||  topTracksResults[2]===false){
        setError(true)
        return
      }
      const updatedTopTracks = {
        short_term: {items: topTracksResults[0].items, next: topTracksResults[0].next},
        medium_term:  {items: topTracksResults[1].items, next: topTracksResults[1].next},
        long_term:  {items: topTracksResults[2].items, next: topTracksResults[2].next}
      };
      setTopTracks(updatedTopTracks);
      props.updateTopTracksFunc(updatedTopTracks); // Store data in parent component to avoid multiple fetches on rerender
    }).catch(() => setError(true));
  };

  function onGetMoreTracks(){
    const promise = getEndpointResult(props.token,topTracks[currentTab].next, "fetching more tracks")
    promise.then((moreTracksResult) => {
      let updatedTopTracks = {...topTracks}
      updatedTopTracks[currentTab].items = updatedTopTracks[currentTab].items.concat(moreTracksResult.items)
      updatedTopTracks[currentTab].next= moreTracksResult.next
      setTopTracks(updatedTopTracks)
      props.updateTopTracksFunc(updatedTopTracks)
    })
  }
 
  function moreTracksAvailableBtn(){
    if (topTracks[currentTab].next===null){
      return
    }
    return (<button class="more-btn" onClick={()=>onGetMoreTracks()}>View More</button>)
  }


  if (error) {throw new Error("Failed to fetch tracks");}
  if (topTracks[currentTab].items==null){
    return (
      <React.Fragment>
        <h1 className="page-title">Your Top Tracks</h1>
        <TimeRangeSelector tabSwitchHandler={onTabSwitch}/>
        <LoadingIcon />
      </React.Fragment>
    )
  }
  return (
    <div style={{display:'grid'}}>
      <h1 className="page-title">Your Top Tracks</h1>
      <TimeRangeSelector tabSwitchHandler={onTabSwitch}/>
      <RenderTracks tracks={topTracks[currentTab]}/>
      {moreTracksAvailableBtn()}
      <div style={{height:20}}></div>
    </div>
  );
};

