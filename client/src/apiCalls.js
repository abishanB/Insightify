import fetch from "node-fetch";
const clientID = process.env.REACT_APP_CLIENT_ID
const clientSecret = process.env.REACT_APP_CLIENT_SECRET

function checkResponse(response){
  if (!response.ok){
    return false
  }
  return response.json()
}

export async function getToken(){//client credentials flow
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method:'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientID+':'+clientSecret)
      },  
      body:'grant_type=client_credentials'
    });
  
    return checkResponse(await response)
  }
  
export async function getTokenWithRefreshToken(refreshToken, redirect_uri='http://localhost:3000'){//gets access token using previos refresh token
    console.log("fetching token with refresh token")
    var details = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: redirect_uri,
    };
  
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method:'POST',
    
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientID+':'+clientSecret)
      },  
      body: formBody
    });
    return checkResponse(await response)
  }
  
export async function getTokenWithAuthCode(code, redirect_uri='http://localhost:3000'){//gets access token using auth code
    //redirect_uri redirects to the current page, ex /tracks, /artists
    console.log("fetching token with auth code")
    var details = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
    };
  
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
 
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method:'POST',
    
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientID+':'+clientSecret)
      },  
      body: formBody
    });
    return checkResponse(await response)
  }
  
export async function getEndpointResult(access_token, endpoint, endpointType=null){//for calls with custom endpoint ie next calls
  if (endpointType!=null) {console.log("ENDPOINT CALL -",endpointType)}
  
  const response = await fetch(endpoint, {
    method:'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    } 
  });
 
  return checkResponse(await response)
}

export async function getPlaylistTopArtistsOverTime(access_token, playlistTracksJSON){//gets top artists from playlist
  const response = await fetch(`http://localhost:8080/api/playlist/top_artists`, {
    method:'POST',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    }, 
    body: playlistTracksJSON
  })

  return checkResponse(await response)
}
//originally in Wrapper.js, if client credentials is needed
/*onGetToken = () => {//clientCredentials
    var that = this;
    const promise = getToken();
    promise.then(function(token_promise) {
        that.setState({token:token_promise.access_token})
    })
  } */