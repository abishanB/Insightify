import React, { Component } from 'react'
import TimeRange from '../components/TimeRange.js'
import {getTopItems} from '../apiCalls.js'
import { ErrorBoundary } from '../ErrorBoundary.js';


export default class Artists extends Component {
  constructor(props) {
    super(props); 
  
    this.state = {
      top_artists:{
        "short_term":[],
        "medium_term":[],
        "long_term":[]
      },
      error: false
    }
    //bind event handler
    this.onGetTopArtists = this.onGetTopArtists.bind(this)
  }

  componentDidMount(){//on page/component load
    if (this.state.top_artists["short_term"].length!==0){return}//do not call api repeadtly
    this.onGetTopArtists("short_term");this.onGetTopArtists("medium_term");this.onGetTopArtists("long_term")
  }
  
  onGetTopArtists = (timeRange) => {
    var that = this;
    const promise = getTopItems(this.props.token, "artists",timeRange)

    promise.then(function(topItemsObj) {
      if (topItemsObj === false){
        that.setState({error:true})
        return
      }

      let topAritstsCopy = that.state.top_artists
      topAritstsCopy[timeRange] = topItemsObj.items
      that.setState({top_artists:topAritstsCopy})
    })
  }

  render() {
    if (this.state.error){throw new Error("Can't fetch tracks")}
    return (
    <div>
      <h1 className="page-title">Your Top Artists</h1>
      <ErrorBoundary fallback="TimeRange.js">
        <TimeRange topItems={this.state.top_artists} showTopSongs={false}/> 
      </ErrorBoundary>
      
    </div>
    )
  }
}
