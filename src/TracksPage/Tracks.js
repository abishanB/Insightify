import React, { useState, useEffect } from 'react';
import TimeRangeSelector from '../components/TimeRangeSelector.js';
import { getTopItems } from '../apiCalls.js';
import { ErrorBoundary } from '../ErrorBoundary.js';
import RenderTracks from './RenderTracks.js';

export default function Tracks(props){
  const [topTracks, setTopTracks] = useState({
    short_term: [],
    medium_term: [],
    long_term: [],
  });
  const [error, setError] = useState(false);

  useEffect(() => {//on component load
    if (props.topTracks === null) {//if tracks havent been loaded yet
      onGetTopTracks();
      return
    } 
    //if already loaded update state with tracks passed from parent component
    setTopTracks(props.topTracks);
    // eslint-disable-next-line
  }, []);

  const onGetTopTracks = () => {
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
        short_term: topTracksResults[0].items,
        medium_term: topTracksResults[1].items,
        long_term: topTracksResults[2].items,
      };
      setTopTracks(updatedTopTracks);
      props.updateTopTracksFunc(updatedTopTracks); // Store data in parent component to avoid multiple fetches on rerender
    })
      .catch(() => setError(true));
  };

  if (error) {throw new Error("Failed to fetch tracks");}

  return (
    <React.Fragment>
      <h1 className="page-title">Your Top Tracks</h1>
      <ErrorBoundary fallback="TimeRange.js">
        <TimeRangeSelector topItemsComponent={(timeRange) => <RenderTracks tracks={topTracks[timeRange]} />}/>
      </ErrorBoundary>
    </React.Fragment>
  );
};

