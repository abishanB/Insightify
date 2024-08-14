import React, { useState, useEffect } from 'react';
import TimeRangeSelector from './TimeRangeSelector.js';
import { getTopItems, getEndpointResult } from '../apiCalls.js';
import RenderTracks from '../TracksPage/RenderTracks.js';
import RenderArtists from '../ArtistsPage/RenderArtists.js';
import LoadingIcon from './LoadingIcon.js';

export default function TopItems({ type, token, storedTopItems, updateTopItemsFunc }) {
  const [items, setItems] = useState({//top items 
    short_term: {},
    medium_term: {},
    long_term: {},
  });
  const [error, setError] = useState(false);
  const [currentTab, setCurrentTab] = useState("short_term");
  
  const onTabSwitch = (tabName) => setCurrentTab(tabName);
  
  useEffect(() => {//run on component load
    if (storedTopItems === null) { // if items haven't been loaded yet
      onGetTopItems();
      return;
    }
    // if already loaded, update state with items passed from parent component
    setItems(storedTopItems);
    // eslint-disable-next-line
  }, []);

  function onGetTopItems() {//initailly get first 50 results
    const itemPromises = [
      getTopItems(token, type, 'short_term'),
      getTopItems(token, type, 'medium_term'),
      getTopItems(token, type, 'long_term'),
    ];

    Promise.all(itemPromises).then((results) => {
      if (results[0] === false || results[1] === false || results[2] === false) {
        setError(true);
        return;
      }
      
      const updatedItems = {
        short_term: { items: results[0].items, next: results[0].next },
        medium_term: { items: results[1].items, next: results[1].next },
        long_term: { items: results[2].items, next: results[2].next },
      };
      setItems(updatedItems);
      updateTopItemsFunc(updatedItems); // Store data in parent component to avoid multiple fetches on rerender
    }).catch(() => setError(true));
  }

  function onGetMoreItems() { //calls next endpoint for next set of 50 items under current timeRange
    const promise = getEndpointResult(token, items[currentTab].next, `fetching more ${type}`);
    promise.then((moreItemsResult) => {
      if (moreItemsResult === false){
        setError(true);
        return;
      }
      console.log(moreItemsResult)
      let updatedItems = { ...items };//create copy of items
      updatedItems[currentTab].items = updatedItems[currentTab].items.concat(moreItemsResult.items);
      updatedItems[currentTab].next = moreItemsResult.next;
      setItems(updatedItems);
      updateTopItemsFunc(updatedItems);
    }).catch(() => setError(true));
  }

  function moreItemsAvailableBtn() {
    if (items[currentTab].next === null) {//if there are no more tracks dont display button 
      return
    }
    return (<button className="more-btn" onClick={() => onGetMoreItems()}>View More</button>);
  }

  if (error) { throw new Error(`Failed to fetch ${type}`); }
  if (items[currentTab].items == null) {//if api hasnt retrived items yet
    return (
      <React.Fragment>
        <h1 className="page-title">Your Top {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
        <TimeRangeSelector tabSwitchHandler={onTabSwitch} />
        <LoadingIcon />
      </React.Fragment>
    );
  }
  
  return (
    <div style={{ display: 'grid' }}>
      <h1 className="page-title">Your Top {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      <TimeRangeSelector tabSwitchHandler={onTabSwitch} />
      {type === 'tracks' ? (
        <RenderTracks tracks={items[currentTab].items} />
      ) : (
        <RenderArtists artists={items[currentTab].items} />
      )}
      {moreItemsAvailableBtn()}
      <div style={{ height: 20 }}></div>
    </div>
  );
}
