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
    if (this.props.topTracks === null){
      this.onGetTopTracks();
      return
    }

    this.setState({top_tracks:this.props.topTracks})
  }

  onGetTopTracks = () =>{
    var that = this;//cannot access this inside promise
    const trackPromises = []
    trackPromises.push(getTopItems(this.props.token, "tracks","short_term"))
    trackPromises.push(getTopItems(this.props.token, "tracks","medium_term"))
    trackPromises.push(getTopItems(this.props.token, "tracks","long_term"))
    
    Promise.all(trackPromises).then((topTracksResults) => {
      let updatedTopTracks= {
        "short_term":topTracksResults[0].items,
        "medium_term":topTracksResults[1].items, 
        "long_term":topTracksResults[2].items
      }
      that.setState({
        top_tracks:updatedTopTracks
      })
      that.props.updateTopTracksFunc(updatedTopTracks)
    })
    
  }

  render() {
    if (this.state.error){throw new Error("Can't fetch tracks")}

    return (
    <React.Fragment>
      <h1 className="page-title">Your Top Tracks</h1>
      <ErrorBoundary fallback="TimeRange.js">
        <TimeRange topItems={this.state.top_tracks} showTopSongs={true}/>
      </ErrorBoundary > 
      
    </React.Fragment>
  )
  }
}

