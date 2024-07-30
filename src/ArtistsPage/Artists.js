import React, { Component } from 'react'
import TimeRange from '../components/TimeRange.js'
import {getTopItems} from '../apiCalls.js'


export default class Artists extends Component {
  constructor(props) {
    super(props); 
  
    this.state = {
      top_artists:{
        "short_term":[],
        "medium_term":[],
        "long_term":[]
      }
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
      let topAritstsCopy = that.state.top_artists
      topAritstsCopy[timeRange] = topItemsObj.items
      that.setState({top_artists:topAritstsCopy})
    })
  }

  render() {
    return (
    <div>
      <div> 
          <TimeRange topItems={this.state.top_artists} showTopSongs={false}/> 
      </div>
    </div>
    )
  }
}
