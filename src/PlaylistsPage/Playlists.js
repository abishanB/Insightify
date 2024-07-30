import React, { Component } from 'react'
import { getUserPlaylists, getLikedSongs } from '../apiCalls'
import DisplayPlaylists from './DisplayPlaylists';

//displays user playlists for them to select
export default class Playlists extends Component {
  constructor(props) {
      super(props);
    
      this.state = { 
        playlists:[] 
      }
      //bind event handler
      this.onGetPlaylists = this.onGetPlaylists.bind(this)
      this.onGetLikedSongs = this.onGetLikedSongs.bind(this)
  }

  componentDidMount(){//on page/component load
    if (this.state.playlists.length!==0){return}//do not call api repeadtly
    this.onGetPlaylists();
    
  }

  onGetPlaylists(){
    var that = this;
    const promise = getUserPlaylists(this.props.token)
    promise.then(function(playlistsObj) {
        //console.log(playlistsObj.items)
        that.setState({playlists: playlistsObj.items})
    });
  }

    onGetLikedSongs(){
      var that = this;
      const promise = getLikedSongs(this.props.token)
      promise.then(function(likedSongsObj) {
          console.log(likedSongsObj)
      });
    }


  render() {
    return (
      <div>

      <div>
        <button onClick={()=>this.onGetPlaylists()}>PLAYLISTS</button>
        <button onClick={()=>this.onGetLikedSongs()}>LIKEDSONGS</button>
      </div>
        <DisplayPlaylists playlists={this.state.playlists}/>
      </div>
    )
  }
}


