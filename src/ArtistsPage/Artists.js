import React, { useState, useEffect } from 'react';
import TimeRangeSelector from '../components/TimeRangeSelector.js';
import { getTopItems, getEndpointResult } from '../apiCalls.js';
import RenderArtists from "./RenderArtists.js";
import LoadingIcon from '../components/LoadingIcon.js';
export default function Artists(props) {
  const [topArtists, setTopArtists] = useState({
    short_term: {},
    medium_term: {},
    long_term: {},
  });
  const [error, setError] = useState(false);
  const [currentTab, setCurrentTab] = useState("short_term")

  const onTabSwitch = (tabName) => setCurrentTab(tabName)

  useEffect(function() {//on component load
    if (props.topArtists === null) {//if artists havent been loaded yet
      onGetTopArtists();
      return
    } 
    //if already loaded update state with tracks passed from parent component
    setTopArtists(props.topArtists);
    // eslint-disable-next-line
  }, []);

  function onGetTopArtists() {
    const artistPromises = [
      getTopItems(props.token, 'artists', 'short_term'),
      getTopItems(props.token, 'artists', 'medium_term'),
      getTopItems(props.token, 'artists', 'long_term'),
    ];

    Promise.all(artistPromises).then(function(topArtistsResults) {
      if (topArtistsResults[0]===false || topArtistsResults[1]===false ||  topArtistsResults[2]===false){
        setError(true)
        return
      }
      const updatedTopArtists = {
        short_term: {items: topArtistsResults[0].items, next: topArtistsResults[0].next},
        medium_term:  {items: topArtistsResults[1].items, next: topArtistsResults[1].next},
        long_term:  {items: topArtistsResults[2].items, next: topArtistsResults[2].next}
      };
      setTopArtists(updatedTopArtists);
      props.updateTopArtistsFunc(updatedTopArtists); // Store data in parent component to avoid multiple fetches on rerender
    }).catch(function() {setError(true);});
  }

  function onGetMoreArtists(){
    const promise = getEndpointResult(props.token,topArtists[currentTab].next, "fetching more artists")
    promise.then((moreArtistsResult) => {
      
      let updatedTopArtists = {...topArtists}
      updatedTopArtists[currentTab].items = updatedTopArtists[currentTab].items.concat(moreArtistsResult.items)
      updatedTopArtists[currentTab].next= moreArtistsResult.next
      setTopArtists(updatedTopArtists)
      props.updateTopArtistsFunc(updatedTopArtists)
    })
  }

  function moreArtistsAvailableBtn(){
    if (topArtists[currentTab].next===null){
      return
    }
    return (<button class="more-btn" onClick={()=>onGetMoreArtists()}>View More</button>)
  }

  if (topArtists[currentTab].items==null){
    return (
      <React.Fragment>
        <h1 className="page-title">Your Top Artists</h1>
        <TimeRangeSelector tabSwitchHandler={onTabSwitch}/>
        <LoadingIcon />
      </React.Fragment>
    )
  }

  if (error) {throw new Error("Failed to fetch artists");}
  return (
    <div style={{display:'grid'}}>
      <h1 className="page-title">Your Top Artists</h1>
      <TimeRangeSelector tabSwitchHandler={onTabSwitch}/>
      <RenderArtists artists={topArtists[currentTab]}/>
      {moreArtistsAvailableBtn()}
      <div style={{height:20}}></div>
    </div>
  );
}

