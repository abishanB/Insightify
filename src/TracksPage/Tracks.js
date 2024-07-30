import React, { Component } from 'react'
import TimeRange from '../components/TimeRange.js'
import {getTopItems} from '../apiCalls.js'

export default class Tracks extends Component {
  constructor(props) {
      super(props);
    
      this.state = { 
        top_tracks:{
          "short_term":[],
          "medium_term":[], 
          "long_term":[]
        }
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
      let topSongsCopy = that.state.top_tracks
      topSongsCopy[timeRange] = topItemsObj.items
      that.setState({top_tracks:topSongsCopy})
    })
  }

  render() {
    return (
    <div>
      <div> 
          <TimeRange topItems={this.state.top_tracks} showTopSongs={true}/> 
      </div>
    </div>
  )
  }
}

