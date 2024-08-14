import fetch from "node-fetch";
//old app
//const clientID = '9d10477046f3462db2028606fde3e774';
//const clientSecret = '8ccbf4afbda84ef29ced457991685524';

// const clientID = 'ca8aec9757ef4c1e9ea2f772f8a3d9b3'
// const clientSecret = 'a84859496c82429aa65587a2a488d29f'

const clientID = 'REMOVED'
const clientSecret = 'REMOVED'


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
  
export async function getTokenWithRefreshToken(refreshToken){//gets access token using previos refresh token
    console.log("fetching token with refresh token")
    const redirect_uri = 'http://localhost:3000';
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
  
export async function getTokenWithAuthCode(code){//gets access token using auth code
    console.log("fetching token with auth code")
    const redirect_uri = 'http://localhost:3000';
  
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
  
export async function getTopItems(access_token,type="tracks", time_range="medium_term", limit=50){
  console.log("Fetching top", type)
  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${limit}`, {
    method:'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    }
  });

  
  return checkResponse(await response)
} 

export async function getUserPlaylists(access_token, endpoint){
  const response = await fetch(endpoint, {
    method:'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    } 
  });
 
  return checkResponse(await response)

}


export async function getPlaylist(access_token, playlist_id){
  console.log("fetching playlist")
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
    method:'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    } 
  });
  
  return checkResponse(await response)
}

export async function getTracks(access_token, endpoint){//get tracks from playlist from endpoint provided by playlist
  console.log("fetching playlist tracks")
  const response = await fetch(endpoint, {
    method:'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    } 
  });
  return checkResponse(await response)
}

export async function getArtists(access_token, artistIDs){
  console.log("fetching artists")
  //artists ids must be one string seperated by %
  const response = await fetch(`https://api.spotify.com/v1/artists?ids=${artistIDs}`, {
    method:'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    } 
  });
  return checkResponse(await response)
}

export async function getEndpointResult(access_token, endpoint, endpointType=null){//for calls with custom endpoint, next calls
  if (endpointType!=null) {console.log("ENDPOINT CALL -",endpointType)}
  
  const response = await fetch(endpoint, {
    method:'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    } 
  });
 
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