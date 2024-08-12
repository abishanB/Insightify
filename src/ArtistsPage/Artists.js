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
    
  }

  componentDidMount(){//on page/component load
    if (this.state.top_artists["short_term"].length!==0){return}//do not call api repeadtly
    if (this.props.topArtists === null){
      this.onGetTopArtists();
      return
    }

    this.setState({top_artists:this.props.topArtists})
  }
  
  onGetTopArtists = () => {
    var that = this;//cannot access this inside promise
    const artistPromises = []
    artistPromises.push(getTopItems(this.props.token, "artists","short_term"))
    artistPromises.push(getTopItems(this.props.token, "artists","medium_term"))
    artistPromises.push(getTopItems(this.props.token, "artists","long_term"))
    
    Promise.all(artistPromises).then((topArtistsResults) => {
      let updatedTopArtists= {
        "short_term":topArtistsResults[0].items,
        "medium_term":topArtistsResults[1].items, 
        "long_term":topArtistsResults[2].items
      }
      that.setState({
        top_artists:updatedTopArtists
      })
      that.props.updateTopArtistsFunc(updatedTopArtists)
    })
  }

  render() {
    if (this.state.error){throw new Error("Can't fetch tracks")}
    return (
    <React.Fragment>
      <h1 className="page-title">Your Top Artists</h1>
      <ErrorBoundary fallback="TimeRange.js">
        <TimeRange topItems={this.state.top_artists} showTopSongs={false}/> 
      </ErrorBoundary>
      
    </React.Fragment>
    )
  }
}
