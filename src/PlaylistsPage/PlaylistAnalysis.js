import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEndpointResult } from '../apiCalls';
import LoadingIcon from '../components/LoadingIcon';
import GenreChart from './GenreChart';
import "./PlaylistAnalysis.css";
import PlaylistSummary from './PlaylistSummaryCard';
import TopArtistsAlbums from './PlaylistTopArtistsAlbums'

function sortProperties(obj){//sorts artists, albums and genres from most occuring to least
	var sortable=[];

	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]);
	
		sortable.sort(function(a, b)
		{
			return b[1].totalOccurences-a[1].totalOccurences;
		});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function filterPlaylistTracks(playlistTracks){
  let filteredPlaylistTracks = []
  for (let trackObj of Object.values(playlistTracks)) {
    if (trackObj.track===null){continue;}//dont include tracks that cant be found
    if (trackObj.track.type!=="track"){continue;}//dont include podcasts etc
    if (trackObj.is_local){continue}//skip local songs
    filteredPlaylistTracks.push(trackObj)
  }
  return filteredPlaylistTracks
}

function calculateAveragePopularity(playlistTracks){
  let totalPopularity = 0
  for (let trackObj of Object.values(playlistTracks)) {
    totalPopularity += trackObj.track.popularity
  }
  return Math.round(totalPopularity/playlistTracks.length)
}

function getPlaylistArtists(playlistTracks){//collect how many times a artist appears in the playlist and returns it sorted
  let playlistArtists = {};
  for (let trackObj of Object.values(playlistTracks)) {
    trackObj.track.artists.forEach(artist => {//iterate each artist credited on a song
      if (artist.name in playlistArtists){//if artist has already appeared in list
        playlistArtists[artist.name].totalOccurences+=1
      } else {//if artist's first time appearing
        playlistArtists[artist.name] = {}
        Object.defineProperty(playlistArtists[artist.name], 'totalOccurences', {
          value: 1,
          writable: true,
        });
        Object.defineProperty(playlistArtists[artist.name], 'id', {
          value: artist.id,
          writable: true,
        });
        Object.defineProperty(playlistArtists[artist.name], 'href', {
          value: artist.external_urls.spotify,
          writable: true,
        });
        Object.defineProperty(playlistArtists[artist.name], 'imageURL', {
          value: null,
          writable: true,
        });
      }
    });
  }
  
  if (Object.keys(playlistArtists).length ===0){
    return "No Data"
  }
  return sortProperties(playlistArtists)
}

function getPlaylistAlbums(playlistTracks){//collect how many times a album appears in the playlist and returns it sorted - exclude singles with 1 songs
  let playlistAlbums = {};

  for (let trackObj of Object.values(playlistTracks)) {//iterate all tracks
    if(trackObj.track.album.total_tracks===1){continue}//skip albums with only 1 song(singles)

    if (trackObj.track.album.name in playlistAlbums){
      playlistAlbums[trackObj.track.album.name].totalOccurences +=1
    } else {
      playlistAlbums[trackObj.track.album.name] = {}
      Object.defineProperty(playlistAlbums[trackObj.track.album.name], 'totalOccurences', {
        value: 1,
        writable: true,
      });
      Object.defineProperty(playlistAlbums[trackObj.track.album.name], 'href', {
        value: trackObj.track.album.external_urls.spotify,
        writable: true,
      });
      Object.defineProperty(playlistAlbums[trackObj.track.album.name], 'imageURL', {
        value: trackObj.track.album.images[0].url,
        writable: true,
      })
    }
  }

  return sortProperties(playlistAlbums)
}

function likedSongsToPlaylist(likedSongsObj){//convert likedSongs object to playlist Object by adding corresponding properties
  Object.defineProperty(likedSongsObj, "owner",{
    value : { "external_urls": {
      "spotify": "https://open.spotify.com/collection/tracks"
    }
  }})
  Object.defineProperty(likedSongsObj, "external_urls",{
    value : {"spotify": "https://open.spotify.com/collection/tracks"}
  })
  Object.defineProperty(likedSongsObj, "images",{
    value :[{url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png'}]
  })
  Object.defineProperty(likedSongsObj, "tracks",{
    value : {"total": likedSongsObj.total}
  })
  Object.defineProperty(likedSongsObj, "followers",{
    value : {"total": "N/A"}
  })
  return likedSongsObj
}

export default function PlaylistInfo(props) {
  const [playlist, setPlaylist]= useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [topArtistsInPlaylist, setTopArtistsInPlaylist] = useState([])//{index: [artist, {id , href, imageURL, totalOccurences}]}
  const [topGenresInPlaylists, setTopGenresInPlaylists] = useState([])
  const [topAlbumsInPlaylist, setTopAlbumsInPlaylist] = useState([])
  const [averagePopularity, setAveragePopularity] = useState()
  const [noData, setNoData] = useState(false)

  const [error, setError] = useState(false)

  const [readyToRender, setReadyToRender] = useState(false)

  const {playlistID} = useParams()//gets playlistID passed from router and in URL
  
  if (error){throw new Error("Can't fetch playlist", playlistID)}

  useEffect(() => {//on page load   
    if (playlist.length!==0){return}
    onGetPlaylist(playlistID)
    // eslint-disable-next-line
  }, []);

  useEffect(() => {//runs when playlist is recieved 
    if (playlist.length===0){return}
    if ( (playlistID !== "liked_songs" && playlist.tracks.total===0 ) || ( playlistID === "liked_songs" && playlist.total===0 )){
      //if playlist is empty or only contains local songs
      setNoData(true)
      setReadyToRender(true)
      return
    }
    if (playlistID === "liked_songs"){
      onGetPlaylistTracks(playlist.items, playlist.next)
    } else {
      onGetPlaylistTracks(playlist.tracks.items, playlist.tracks.next)
    }
    // eslint-disable-next-line
  }, [playlist]);

  useEffect(() => {//runs when all playlist tracks have been recieved
    if (playlistTracks.length===0){return}
    let getPlaylistArtistsResult = getPlaylistArtists(playlistTracks);
   
    if(getPlaylistArtistsResult === "No Data"){
      setNoData(true)
      setReadyToRender(true)
      return
    }
    //playlistArtists is updated in getGenres so artist image can also be retrieved
    getGenres(getPlaylistArtistsResult, props.token)
    setTopAlbumsInPlaylist(getPlaylistAlbums(playlistTracks))//set top albums 
    setAveragePopularity(calculateAveragePopularity(playlistTracks))//set average popularity
    // eslint-disable-next-line
  }, [playlistTracks]);

  useEffect(() => {//when playlist artists and ids are recieved to get genres
    if (topGenresInPlaylists.length===0){return}  
    setReadyToRender(true)
  }, [topGenresInPlaylists]);

  function getGenres(playlistArtists, access_token){//get genres of artists in playlists, as well as sets artist Image URL
    //included in parent function to access useState
    //makes a call to artist endpoint where artist genre can be found
    const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1); //to capitalize the first letter of genre names

    let playlistGenres = {} //{playlistGenre: number of occurences}
    let numOfArtists = playlistArtists.length
    let artistsSetsPerFifty = Math.ceil(numOfArtists/50)
    
    let playlistsArtistsCopy = playlistArtists;//update topAritsts with ImageURL property
    let promises = []
    for (let i = 0; i <artistsSetsPerFifty; i++) {//max number of artists per api call is 50, iterate through artists in sets of 50
      let artistsIDs = [];
      for (let artistIndex =50*i; artistIndex<(50*(i+1)); artistIndex++){ //put all ids in a list so it can be passed to api as a string
        if (artistIndex >= numOfArtists){break;}
        artistsIDs.push(playlistArtists[artistIndex][1].id)
      }
      
      promises.push(getEndpointResult(access_token, `https://api.spotify.com/v1/artists?ids=${artistsIDs.join(",")}`, "fetching artists"))
    }
    Promise.all(promises).then((artistPromiseResults) => {
      for (const [artistSetNum, artistSet] of Object.entries(artistPromiseResults)) {
        for (const [artistKey, artist] of Object.entries(artistSet.artists)) {
          let artistIndex = parseInt(artistKey) + (artistSetNum*50)//index of artist in original playlistsArtistsCopy list
          let artistOccurences = playlistArtists[artistIndex][1].totalOccurences
          
          if (artist.images.length===0){//check if artist image is not availabe
            //set artist image to blank
            playlistsArtistsCopy[artistIndex][1].imageURL= "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"
          } else {
            playlistsArtistsCopy[artistIndex][1].imageURL= artist.images[0].url
          }

          for (var genre of artist.genres){//iterate through each genre of artist 
            var genreCapitalized = capitalizeFirstLetter(genre)//capitalize first letter of genre name
            if (genreCapitalized in playlistGenres){
              playlistGenres[genreCapitalized].totalOccurences += artistOccurences //add artist genre based on how many times artist appeared in a playlist
            } else{
              playlistGenres[genreCapitalized] = {}
              
              Object.defineProperty(playlistGenres[genreCapitalized], 'totalOccurences', {
                value: 1,
                writable: true,
                enumerable:true
              });
            }
          }
        }
      }
      //when finished loop, update state
      setTopArtistsInPlaylist(playlistsArtistsCopy)
      setTopGenresInPlaylists(sortProperties(playlistGenres))
    })
  } 

  function onGetPlaylistTracks(playlistTracks, nextEndpoint){
    //Only 100 songs can be retrived at once
    //recursivly calls each endpoint to get sets of 100 songs
    //inital playlist endpoint returns 100 tracks and a next endpoint for the next 100
    //if next endpoint doesnt exist set state and return func
    //else make a api call to the endpoint then call function again while adding to the list of tracks
    if (nextEndpoint === null || playlistTracks.length >= 2200){//dont scan over 22 00 tracks
      setPlaylistTracks(filterPlaylistTracks(playlistTracks))
      return
    }

    const promise = getEndpointResult(props.token, nextEndpoint, "Fetching tracks")
    promise.then(function(tracksObject) {
      //setPlaylistTracks(playlistTracks.concat(tracksObject.items))
      onGetPlaylistTracks(playlistTracks.concat(tracksObject.items), tracksObject.next)
    })
  }

  function onGetPlaylist (playlistID){//get playlist object and update state
    var promise;
    if (playlistID === "liked_songs"){
      promise = getEndpointResult(props.token, `https://api.spotify.com/v1/me/tracks?limit=50`, "Fetching Liked Songs")//users liked songs endpoint
    } else {
      promise = getEndpointResult(props.token, `https://api.spotify.com/v1/playlists/${playlistID}`, "Fetching Playlist")
    }
    promise.then(function(playlistObj) {
      if (playlistObj === false){
        setError(true)
        return
      }
      //add properties to handle liked songs as a playlist
      if (playlistID === "liked_songs"){ playlistObj = likedSongsToPlaylist(playlistObj) }
      setPlaylist(playlistObj)
    })
  }

  if (!readyToRender){return <LoadingIcon />}
  if (noData){return (
    <div className='card-container'>
      <PlaylistSummary playlist={playlist} topArtists={topArtistsInPlaylist} topAlbums={topAlbumsInPlaylist} topGenres={topGenresInPlaylists} averagePopularity={averagePopularity} noData={noData}/>
      <div style={{height: 20}}></div>
    </div>
  )}
  return (
    <div className='card-container'>
      <PlaylistSummary playlist={playlist} topArtists={topArtistsInPlaylist} topAlbums={topAlbumsInPlaylist} topGenres={topGenresInPlaylists} averagePopularity={averagePopularity} noData={noData}/>
      <TopArtistsAlbums topArtists={topArtistsInPlaylist} topAlbums={topAlbumsInPlaylist}/>
      <GenreChart topGenres={topGenresInPlaylists}/>
      <div  style={{height: 20}}></div>
    </div>
  )
}
//<iframe src={`https://open.spotify.com/embed/playlist/${playlistID}?utm_source=generator`} width="20%" height="800" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>