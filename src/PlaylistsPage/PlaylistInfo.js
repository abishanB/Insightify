import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom' 
import { getPlaylist , getTracks, getArtists} from '../apiCalls'
import PlaylistSummary from './PlaylistSummary';
import TopArtistsAlbums from './TopArtistsAlbums';
import "./PlaylistAnalysis.css"
import LoadingIcon from '../components/LoadingIcon';
//show songs, top artists, albums and genre diversity
//followers
//popularity score  

function capitalizeFirstLetter(string) {//to capitalize the first letter of genre names
  return string.charAt(0).toUpperCase() + string.slice(1);
} 

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

function getPlaylistArtists(playlistTracks){//collect how many times a artist appears in the playlist and returns it sorted
  let playlistArtists = {};
  for (let trackObj of Object.values(playlistTracks)) {
    if (trackObj.is_local){continue}//skip local files
    trackObj.track.artists.forEach(artist => {//iterate each artist credited on a song
      if (artist.name in playlistArtists){
        playlistArtists[artist.name].totalOccurences+=1
      } else {
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
  return sortProperties(playlistArtists)
}


function getPlaylistAlbums(playlistTracks){//collect how many times a album appears in the playlist and returns it sorted - exclude singles with 1 songs
  let playlistAlbums = {};

  for (let trackObj of Object.values(playlistTracks)) {
    if (trackObj.is_local){continue}//skip local files
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
      });
    }
  }

  return sortProperties(playlistAlbums)
}

export default function PlaylistInfo(props) {
  const [playlist, setPlaylist]= useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [topArtistsInPlaylist, setTopArtistsInPlaylist] = useState([])//{index: [artist, {id , href, imageURL, totalOccurences}]}
  const [topGenresInPlaylists, setTopGenresInPlaylists] = useState([])
  const [topAlbumsInPlaylist, setTopAlbumsInPlaylist] = useState([])
  
  const [readyToRender, setReadyToRender] = useState(false)

  const {playlistID} =useParams()//gets playlistID passed from router and in URL
  
  useEffect(() => {//on page load
    if (playlist.length!==0){return}
    onGetPlaylist(playlistID)
  }, [playlist]);

  useEffect(() => {//runs when playlist is recieved 
    if (playlist.length===0){return}
    onGetPlaylistTracks(playlist.tracks.items, playlist.tracks.next)
  }, [playlist]);

  useEffect(() => {//runs when all playlist tracks have been recieved
    if (playlistTracks.length===0){return}
    setTopAlbumsInPlaylist(getPlaylistAlbums(playlistTracks))
    setTopArtistsInPlaylist(getPlaylistArtists(playlistTracks))
    
  }, [playlistTracks]);

  useEffect(() => {//when playlist artists and ids are recieved to get genres
    if (topArtistsInPlaylist.length===0){return}
    getGenres(topArtistsInPlaylist, props.token)   
    
  }, [topArtistsInPlaylist]);

  useEffect(() => {//when playlist artists and ids are recieved to get genres
    if (topGenresInPlaylists.length===0){return}
    setReadyToRender(true)
  }, [topGenresInPlaylists]);

  function getGenres(playlistArtists, access_token){//get genres of artists in playlists, as well as sets artist Image URL
    //included in parent function to access useState
    
    let playlistGenres = {} //{playlistGenre: number of occurences}
    let numOfArtists = playlistArtists.length
    let artistsSetsPerFifty = Math.ceil(numOfArtists/50)

    let topArtistsPlaylistCopy = topArtistsInPlaylist;//update topAritsts with ImageURL property
    
    for (let i = 0; i <artistsSetsPerFifty; i++) {//max number of artists per api call is 50, iterate through artists in sets of 50
      let artistsIDs = [];
      for (let artistIndex =50*i; artistIndex<(50*(i+1)); artistIndex++){
        if (artistIndex >= numOfArtists){break;}
        artistsIDs.push(playlistArtists[artistIndex][1].id)
      }
      
      const promise = getArtists(access_token, artistsIDs.join(","))
      promise.then(function(artistsObj) {
       
        for (const [key, artist] of Object.entries(artistsObj.artists)) {
          let artistIndex = parseInt(key) + (i*50)
          let artistOccurences = playlistArtists[artistIndex][1].totalOccurences


          if (artist.images.length===0){//check if artist image is not availabe
            //set artist image to blank
            topArtistsPlaylistCopy[artistIndex][1].imageURL= "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"
          } else {
            topArtistsPlaylistCopy[artistIndex][1].imageURL= artist.images[0].url
          }
          
          
          for (var genre of artist.genres){
            var genreCapitalized = capitalizeFirstLetter(genre)
            if (genreCapitalized in playlistGenres){
              playlistGenres[genreCapitalized].totalOccurences += artistOccurences
            } else{
              playlistGenres[genreCapitalized] = {}
              Object.defineProperty(playlistGenres[genreCapitalized], 'totalOccurences', {
                value: 1,
                writable: true,
              });
            }
        }}
        if (i+2===artistsSetsPerFifty ){//check if last iteration 
          setTopArtistsInPlaylist(topArtistsPlaylistCopy)
          setTopGenresInPlaylists(sortProperties(playlistGenres))
        }
      })
    }
  } 

  function onGetPlaylistTracks(playlistTracks, nextEndpoint){
    if (nextEndpoint === null){
      setPlaylistTracks(playlistTracks)
    }

    const promise = getTracks(props.token, nextEndpoint)
    promise.then(function(tracksObject) {
      //setPlaylistTracks(playlistTracks.concat(tracksObject.items))
      onGetPlaylistTracks(playlistTracks.concat(tracksObject.items), tracksObject.next)
    }).catch((err) => {})//promise throws syntax error for some reasons
  }

  function onGetPlaylist (playlist_id){//get playlist object and update state
    const promise = getPlaylist(props.token, playlist_id)
    promise.then(function(playlistObj) {
      setPlaylist(playlistObj)
    })
  }

  if (playlist.length===0){return null}

  if (!readyToRender){return <LoadingIcon />}

  return (
    <div className='card-container'>
      <PlaylistSummary playlist={playlist} topArtists={topArtistsInPlaylist} topAlbums={topAlbumsInPlaylist} topGenres={topGenresInPlaylists}/>
      <TopArtistsAlbums playlist={playlist} topArtists={topArtistsInPlaylist} topAlbums={topAlbumsInPlaylist} / >
      <div  style={{height: 20}}></div>
    </div>
  )
}
//<iframe src={`https://open.spotify.com/embed/playlist/${playlistID}?utm_source=generator`} width="20%" height="800" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>