import React, { useState, useEffect, useRef } from 'react';
import TimeRangeSelector from './TimeRangeSelector.js';
import { getEndpointResult } from '../apiCalls.js';
import RenderTracks from '../TracksPage/RenderTracks.js';
import RenderArtists from '../ArtistsPage/RenderArtists.js';
import LoadingIcon from './LoadingIcon.js';


export default function TopItems({ type, token, storedTopItems, updateTopItemsFunc }) {
  const [items, setItems] = useState(storedTopItems); //{short_term: {items: [], next: endpoint}...}
  const [error, setError] = useState(false);
  const [currentTab, setCurrentTab] = useState("short_term");
  const firstUpdate = useRef(true);//check if component has initially rendered
  const maxTopItems = 250//number of top items that can be viewed
  const onTabSwitch = (tabName) => setCurrentTab(tabName);
  
  useEffect(() => {//component Load
    if (items[currentTab].items.length===0){//uf no previous data is passed from parent 
      onGetTopItems()
      return
    }
    setItems(storedTopItems)//if data is passed update items
     // eslint-disable-next-line
  }, []);
  
  useEffect(() => {//runs every time a tab is changed, if tab is empty load data
    if (firstUpdate.current) {//dont run this effect on inital render
      firstUpdate.current = false;
      return;
    }
    
    if (items[currentTab].items.length===0){
      onGetTopItems()
    }
     // eslint-disable-next-line
  }, [currentTab]);

 
  function onGetTopItems() { //calls next endpoint for next set of 50 items under current timeRange
    const promise = getEndpointResult(token, items[currentTab].next, `fetching more ${type} - ${currentTab}`);
    promise.then((moreItemsResult) => {
      if (moreItemsResult === false){
        setError(true);
        return;
      }
      let updatedItems = { ...items };//create copy of items
      updatedItems[currentTab].items = updatedItems[currentTab].items.concat(moreItemsResult.items);//add new items to current 
      updatedItems[currentTab].next = moreItemsResult.next;//set new next endpoint - if no more items .next returns null
      setItems(updatedItems);
      updateTopItemsFunc(updatedItems);//pass updatedItems to parent
    }).catch(() => setError(true));
  }

  function moreItemsAvailableBtn() {
    if (items[currentTab].next === null || items[currentTab].items.length >= maxTopItems) {//if there are no more tracks dont display button 
      return
    }
    console.log(items)
    return (<button className="more-btn" onClick={() => onGetTopItems()}>View More</button>);
  }

  if (error) { throw new Error(`Failed to fetch ${type} - ${currentTab}`); }
  if (items[currentTab].items.length === 0) {//if api is still loading topItems
    return (
      <div style={{ display: 'grid' }}>
        <h1 className="page-title">Your Top {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
        <TimeRangeSelector tabSwitchHandler={()=>{}} />
        <LoadingIcon />
      </div>
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
