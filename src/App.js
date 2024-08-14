import { Component } from "react";
import React from 'react';
import { Routes, Route} from 'react-router-dom';
import {getTokenWithRefreshToken, getTokenWithAuthCode} from './apiCalls.js'
import Home from './HomePage/Home.js'
import TopItems from "./components/TopItems.js";
import PlaylistInfo from "./PlaylistsPage/PlaylistInfo.js";
import DisplayPlaylists from "./PlaylistsPage/DisplayPlaylists.js";
import NavigationBar from "./components/NavigationBar.js";
import { ErrorBoundary } from './ErrorBoundary';

export default class App extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      token: "",
      refresh_token: "",
      auth_code:"",
      top_tracks:null,
      top_artists:null,
      isLoggedIn:false
    }
  }

  componentDidMount(){//when page loads and after page loads on login
    console.log("app.js mounted")
    const hash = window.location.href
    let code = window.localStorage.getItem("code")
    let refresh_token = window.localStorage.getItem("refresh_token")

    if (refresh_token==null || refresh_token==="undefined") {
      
    } else {//if refresh token already exists
      this.onGetRefreshToken(refresh_token)
    } 
    
    if (code==null || code==="undefined") {
      code = hash.split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("code", code)
      window.addEventListener('code', this.storeAuthCode)
      if (code==null || code==="undefined"){
        return
      }
      this.onGetAuthCode(code)//get token and auth code
        
      this.setState({
        auth_code:code
      })
      window.addEventListener('refresh_token', this.storeRefreshToken)
      window.addEventListener('code', this.storeAuthCode)
    }    
  }

  componentWillUnmount(){
    window.removeEventListener('code', this.storeAuthCode)
    window.removeEventListener('refresh_token', this.storeRefreshToken)
  } 
  
  logout = (logoutClick) => {
    logoutClick.preventDefault();
    console.log("LOGUTOUT")
    this.setState({
      token: "",
      refresh_token: "",
      auth_code:"",
      isLoggedIn:false
    })
    window.localStorage.clear()
  }

  updateTopTracks = (topTracksObj) => {this.setState({top_tracks:topTracksObj})}
  updateTopArtists = (topArtistsObj) => {this.setState({top_artists:topArtistsObj})}


  onGetRefreshToken = (refresh_token) => {//call api function to get refresh token and update state
    var that = this;
    const promise = getTokenWithRefreshToken(refresh_token)
    promise.then(function(token_promise) {
      that.setState({
        token : token_promise.access_token,
        isLoggedIn: true,
      });

      if (token_promise.refresh_token !== undefined){
        this.setState({refresh_token:token_promise.refresh_token})
        window.localStorage.setItem("refresh_token", token_promise.refresh_token)
      }
    })
  }

  onGetAuthCode= (code) => {//authorization flow, get auth code
    var that = this;
    const promise = getTokenWithAuthCode(code)
    promise.then(function(token_promise) {
      that.setState({
        token : token_promise.access_token, 
        refresh_token:token_promise.refresh_token,
        isLoggedIn: true
      });
      window.localStorage.setItem("refresh_token", token_promise.refresh_token)
    })
  }

  render() {
    if (this.state.token ===""){//wait for token before rendering to avoid any issues - \
      return(
        <div className="App">
          <NavigationBar isLoggedIn={this.state.isLoggedIn} onLogout={this.logout}/>
        </div>
      )
    }
    return (
    <div className="App">
      
      <NavigationBar isLoggedIn={this.state.isLoggedIn} onLogout={this.logout}/>
        <Routes>
          <Route index element={<Home/>} />
          <Route path='home' element={<Home />} />
          <Route path='tracks' element={<ErrorBoundary fallback="TopItems.js - Tracks"><TopItems token={this.state.token} key={1} type="tracks" storedTopItems={this.state.top_tracks} updateTopItemsFunc={this.updateTopTracks}/></ErrorBoundary >} />
          <Route path='artists' element={<ErrorBoundary fallback="TopItems.js - Artists"><TopItems token={this.state.token} key={2} type="artists" storedTopItems={this.state.top_artists} updateTopItemsFunc={this.updateTopArtists}/></ErrorBoundary >}/>
          <Route path='playlists' element={<ErrorBoundary fallback="DisplayPlaylists.js"><DisplayPlaylists token={this.state.token}/></ErrorBoundary>}/>
          <Route exact path="/playlists/:playlistID" element={<ErrorBoundary fallback="PlaylistInfo.js"><PlaylistInfo token={this.state.token}/></ErrorBoundary>} />
        </Routes>
    </div>
      )
    }
}
