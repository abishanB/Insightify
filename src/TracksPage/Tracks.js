import React, { Component } from 'react'
import TimeRange from '../components/TimeRange.js'
import {getTopItems} from '../apiCalls.js'
import { ErrorBoundary } from '../ErrorBoundary.js';

export default class Tracks extends Component {
  constructor(props) {
      super(props);
    
      this.state = { 
        top_tracks:{
          "short_term":[],
          "medium_term":[], 
          "long_term":[]
        }, 
        error:false
      }
      //bind event handler
      this.onGetTopTracks = this.onGetTopTracks.bind(this)
  }

  componentDidMount(){//on page/component load
    if (this.state.top_tracks["short_term"].length!==0){return}//do not call api repeadtly
    this.onGetTopTracks("short_term");this.onGetTopTracks("medium_term");this.onGetTopTracks("long_term")
  }

  onGetTopTracks = (timeRange) =>{
    var that = this;
    const promise = getTopItems(this.props.token, "tracks",timeRange)
    
    promise.then(function(topItemsObj) {
      if (topItemsObj === false){
        that.setState({error:true})
        return
      }

      let topSongsCopy = that.state.top_tracks
      topSongsCopy[timeRange] = topItemsObj.items
      that.setState({top_tracks:topSongsCopy})
    })
  }

  render() {
    if (this.state.error){throw new Error("Can't fetch tracks")}

    return (
    <div>
      <h1 className="page-title">Your Top Tracks</h1>
      <ErrorBoundary fallback="TimeRange.js">
        <TimeRange topItems={this.state.top_tracks} showTopSongs={true}/>
      </ErrorBoundary > 
      
    </div>
  )
  }
}

