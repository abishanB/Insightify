import React, { useState, useEffect } from 'react';
import TimeRangeSelector from '../components/TimeRangeSelector.js';
import { getTopItems } from '../apiCalls.js';
import { ErrorBoundary } from '../ErrorBoundary.js';
import RenderArtists from "./RenderArtists.js";

export default function Artists(props) {
  const [topArtists, setTopArtists] = useState({
    short_term: [],
    medium_term: [],
    long_term: [],
  });
  const [error, setError] = useState(false);
  const [currentTab, setCurrentTab] = useState("short_term")

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
        short_term: topArtistsResults[0].items,
        medium_term: topArtistsResults[1].items,
        long_term: topArtistsResults[2].items,
      };
      setTopArtists(updatedTopArtists);
      props.updateTopArtistsFunc(updatedTopArtists); // Store data in parent component to avoid multiple fetches on rerender
    })
    .catch(function() {
      setError(true);
    });
  }

  const onTabSwitch = (tabName) => setCurrentTab(tabName)

  if (error) {throw new Error("Failed to fetch artists");}
  return (
    <React.Fragment>
      <h1 className="page-title">Your Top Artists</h1>
      <TimeRangeSelector tabSwitchHandler={onTabSwitch}/>
      <RenderArtists artists={topArtists[currentTab]}/>
    
    </React.Fragment>
  );
}

