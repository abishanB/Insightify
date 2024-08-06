import { Component } from "react";
import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {getTokenWithRefreshToken, getTokenWithAuthCode} from '../apiCalls.js'
import Home from '../HomePage/Home.js'
import Tracks from "../TracksPage/Tracks.js";
import Artists from "../ArtistsPage/Artists.js";
import PlaylistInfo from "../PlaylistsPage/PlaylistInfo.js";
import DisplayPlaylists from "../PlaylistsPage/DisplayPlaylists.js";
import NavigationBar from "./NavigationBar.js";
//todo
//create better file names and comments for each file

export default class Wrapper extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      token: "",
      refresh_token: "",
      auth_code:"",
      isLoggedIn:false
    }

    //bind event handler
    this.logout =this.logout.bind(this)
  }

  componentDidMount(){//when page loads and after page loads on login
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
    if (this.state.token ===""){//wait for token before rendering to avoid any issues - Temporary
      return(
        <div className="App">
          <NavigationBar isLoggedIn={this.state.isLoggedIn} onLogout={this.logout}/>
        </div>
      )
    }

    return (
    <div className="App">
      <NavigationBar isLoggedIn={this.state.isLoggedIn} onLogout={this.logout}/>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>} />
          <Route path='/home' element={<Home />} />
          <Route path='/tracks' element={<Tracks token={this.state.token}/>} />
          <Route path='/artists' element={<Artists token={this.state.token}/>}/>
          <Route path='/playlists' element={<DisplayPlaylists token={this.state.token}/>}/>
          <Route exact path="/playlists/:playlistID" element={<PlaylistInfo token={this.state.token}/>} />
        </Routes>
      </BrowserRouter>
    </div>
      )
    }
}
