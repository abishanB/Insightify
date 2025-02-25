import { Component } from "react";
import React from 'react';
import { Routes, Route} from 'react-router-dom';
import {getTokenWithRefreshToken, getTokenWithAuthCode} from './apiCalls.js'
import Home from './HomePage/Home.js'
import TopItems from "./components/TopItems.js";
import PlaylistAnalysis from "./PlaylistsPage/PlaylistAnalysis.js";
import DisplayPlaylists from "./PlaylistsPage/DisplayPlaylists.js";
import NavigationBar from "./components/NavigationBar.js";
import Footer from "./Footer/Footer.js"
import PrivacyPolicy from "./Footer/PrivacyPolicy.js";
import { ErrorBoundary } from './ErrorBoundary';

export default class App extends Component{
  constructor(props) {
    super(props);
    
    const topItemsLimit = 50;//limit 1-50 
    this.state = {
      isReadyToRender: false,
      token: "",
      refresh_token: "",
      auth_code:"",
      top_tracks: {//.next includes inital endpoint
        short_term: {items:[], next: `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=${topItemsLimit}`},
        medium_term: {items:[], next: `https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=${topItemsLimit}`},
        long_term: {items:[], next: `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=${topItemsLimit}`},
      },
      top_artists:{ 
        short_term: {items:[], next: `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=${topItemsLimit}`},
        medium_term: {items:[], next: `https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=${topItemsLimit}`},
        long_term: {items:[], next: `https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=${topItemsLimit}`},
      },
      userPlaylists: [],
      playlistData: {},
      isLoggedIn:false
    }
  }

  componentDidMount(){//when page loads and after page loads on login
    console.log("app.js mounted")
    const hash = window.location.href
    let code = window.localStorage.getItem("code")
    let refresh_token = window.localStorage.getItem("refresh_token")

    if (!(refresh_token==null || refresh_token==="undefined")) {
      //if refresh token already exists
      this.onGetRefreshToken(refresh_token)
      return
    }
    
    if (code==null || code==="undefined" || code==="access_denied") {
      code = hash.split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("code", code)
      window.addEventListener('code', this.storeAuthCode)
      console.log(code)
      if (code==null || code==="undefined"){
        this.setState({isReadyToRender:true})
        return
      }
      this.getTokenAuthFlow(code)//get token and auth code
      
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
    logoutClick.preventDefault();//prevents page reload
    console.log("LOGOUT")
    this.setState({
      token: "",
      refresh_token: "",
      auth_code:"",
      isLoggedIn:false
    })
    window.localStorage.clear()//clear code, refresh token
  }

  //updates top items and playlists when called from other pages
  updateTopTracks = (topTracksObj) => {this.setState({top_tracks:topTracksObj})}
  updateTopArtists = (topArtistsObj) => {this.setState({top_artists:topArtistsObj})}
  updateUserPlaylists =(userPlaylistsObj) => {this.setState({userPlaylists:userPlaylistsObj})}
  updatePlaylistData = (playlistDataObj) => {this.setState({playlistData:playlistDataObj})}

  onGetRefreshToken = (refresh_token) => {//call api function to get refresh token and update state
    var that = this;
    var currentURL = window.location.href
    if (currentURL.slice(-1) === '/'){
      //when url is localhost:3000/ the '/' must be dropped so the api accepts the redirectURI
      currentURL = currentURL.slice(0, -1)
    }
    const promise = getTokenWithRefreshToken(refresh_token,currentURL)
    promise.then(function(token_promise) {
      that.setState({
        token : token_promise.access_token,
        isReadyToRender:true,
        isLoggedIn: true,
      });

      if (token_promise.refresh_token !== undefined){
        this.setState({
          refresh_token:token_promise.refresh_token,
        })
       
        window.localStorage.setItem("refresh_token", token_promise.refresh_token)
      }
    })
  }

  getTokenAuthFlow= (code) => {//get auth code authorization flow
    var that = this;
    var currentURL = window.location.href.split("?")[0]//splits ?code= 
    if (currentURL.slice(-1) === '/'){
      //when url is localhost:3000/ the '/' must be dropped so the api accepts the redirectURI
      currentURL = currentURL.slice(0, -1)
    }
    const promise = getTokenWithAuthCode(code, currentURL)
    promise.then(function(token_promise) {
      that.setState({
        token : token_promise.access_token, 
        refresh_token:token_promise.refresh_token,
        isReadyToRender:true,
        isLoggedIn: true
      });
      window.localStorage.setItem("refresh_token", token_promise.refresh_token)
      console.log(token_promise.access_token)
    })
  }

  render() {
    if (!this.state.isReadyToRender){
      return(
        <React.Fragment>
          <div className="App">
            <NavigationBar isLoggedIn={this.state.isLoggedIn} onLogout={this.logout}/>
          </div>
          <Footer></Footer>
        </React.Fragment>
      )
    }
    if (this.state.token ===""){//wait for token before rendering to avoid any issues - \
      return(
        <React.Fragment>
          <div className="App">
            <NavigationBar isLoggedIn={this.state.isLoggedIn} onLogout={this.logout}/>
            <Routes>
              <Route path='privacy' element={<PrivacyPolicy />} />
              <Route index element = {<Home token={null} topTracksObj={null} updateTopTracksFunc={null} topArtistsObj={null} updateTopArtistsFunc={null} isLoggedIn={this.state.isLoggedIn}/>} />
              <Route path="*" element = {<Home token={null} topTracksObj={null} updateTopTracksFunc={null} topArtistsObj={null} updateTopArtistsFunc={null} isLoggedIn={this.state.isLoggedIn}/>} />
            </Routes>
          </div>
          <Footer></Footer>
        </React.Fragment>
      )
    }
    return (
    <React.Fragment>
    <div className="App">
      <NavigationBar isLoggedIn={this.state.isLoggedIn} onLogout={this.logout}/>
      <ErrorBoundary>
        <Routes>
          (<Route index element={<Home token={this.state.token} topTracksObj={this.state.top_tracks} updateTopTracksFunc={this.updateTopTracks}
                                topArtistsObj={this.state.top_artists} updateTopArtistsFunc={this.updateTopArtists} isLoggedIn={this.state.isLoggedIn}/>} />)
          
          <Route path='tracks' element={<TopItems token={this.state.token} key="tracks" type="tracks" storedTopItems={this.state.top_tracks} updateTopItemsFunc={this.updateTopTracks}/>} />
          <Route path='artists' element={<TopItems token={this.state.token} key="artists" type="artists" storedTopItems={this.state.top_artists} updateTopItemsFunc={this.updateTopArtists}/>}/>
          <Route path='playlists' element={<DisplayPlaylists token={this.state.token} storedUserPlaylists={this.state.userPlaylists} updateUserPlaylistsFunc={this.updateUserPlaylists}/>}/>
          <Route exact path="/playlists/:playlistID" element={<PlaylistAnalysis token={this.state.token} statePlaylistData={this.state.playlistData} updateStatePlaylistDataFunc={this.updatePlaylistData} />} />
          <Route path='privacy' element={<PrivacyPolicy />} />
        </Routes>
      </ErrorBoundary>
      
    </div>
    <Footer></Footer>
    </React.Fragment>
      )
    }
}