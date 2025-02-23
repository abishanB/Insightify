import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylist, getPlaylistTracks, getArtists, getPlaylistTopArtistsOverTime } from "../apiCalls";
import GenreChart from "./GenreChart";
import "./styles/PlaylistAnalysis.css";
import PlaylistSummary from "./PlaylistSummaryCard";
import TopArtistsAlbums from "./PlaylistTopArtistsAlbums";
import LineChart from "./EvolutionChart";

function sortProperties(obj) {
  //sorts artists, albums and genres from most occuring to least
  var sortedArr = [];

  for (var key in obj)
    if (obj.hasOwnProperty(key)) sortedArr.push([key, obj[key]]);

  sortedArr.sort(function (a, b) {
    return b[1].totalOccurences - a[1].totalOccurences;
  });
  return sortedArr; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function calculateAveragePopularity(playlistTracks) {
  let totalPopularity = 0;
  for (let trackObj of Object.values(playlistTracks)) {
    totalPopularity += trackObj.popularity;
  }
  return Math.round(totalPopularity / playlistTracks.length);
}

function getPlaylistArtists(playlistTracks) {
  //collect how many times a artist appears in the playlist and returns it sorted
  let playlistArtists = {};
  for (let trackObj of Object.values(playlistTracks)) {
    let artists = JSON.parse(trackObj.artists)
    artists.forEach((artist) => {
      //iterate each artist credited on a song
      if (artist.name in playlistArtists) {
        //if artist has already appeared in list
        playlistArtists[artist.name].totalOccurences += 1;
      } else {
        //if artist's first time appearing

        let artistPropertiesObj = {};
        Object.defineProperty(artistPropertiesObj, "totalOccurences", {
          value: 1,
          writable: true,
          enumerable: true,
        });
        Object.defineProperty(artistPropertiesObj, "id", {
          value: artist.id,
          writable: true,
          enumerable: true,
        });
        Object.defineProperty(artistPropertiesObj, "href", {
          value: artist.external_urls.spotify,
          writable: true,
          enumerable: true,
        });
        Object.defineProperty(artistPropertiesObj, "imageURL", {
          value: null,
          writable: true,
          enumerable: true,
        });

        Object.defineProperty(playlistArtists, artist.name, {
          value: artistPropertiesObj,
          writable: true,
          enumerable: true,
        });
      }
    });
  }

  if (Object.keys(playlistArtists).length === 0) {
    return "No Data";
  }

  return playlistArtists;
}

function getPlaylistAlbums(playlistTracks) {
  //collect how many times a album appears in the playlist and returns it sorted - exclude singles with 1 songs
  let playlistAlbums = {};

  for (let trackObj of Object.values(playlistTracks)) {
    //iterate all tracks
    if (trackObj.album_name === null) {
      continue;
    } //skip albums with only 1 song(singles)

    if (trackObj.album_name in playlistAlbums) {
      playlistAlbums[trackObj.album_name].totalOccurences += 1;
    } else {
      playlistAlbums[trackObj.album_name] = {};
      Object.defineProperty( playlistAlbums[trackObj.album_name], "totalOccurences",{
        value: 1,
        writable: true,
      });
      Object.defineProperty(playlistAlbums[trackObj.album_name], "href", {
        value: trackObj.album_href,
        writable: true,
      });
      Object.defineProperty(playlistAlbums[trackObj.album_name], "imageURL",{
        value: trackObj.image_url,
        writable: true
      });
    }
  }
  

  return sortProperties(playlistAlbums);
}

export default function PlaylistAnalysis({token, statePlaylistData, updateStatePlaylistDataFunc}) {
  const [playlist, setPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState(null);
  const [playlistArtists, setPlaylistArtists] = useState(null);
  const [topArtistsInPlaylist, setTopArtistsInPlaylist] = useState(null); //{index: [artist, {id , href, imageURL, totalOccurences}]}
  const [topGenresInPlaylist, setTopGenresInPlaylist] = useState(null);
  const [topAlbumsInPlaylist, setTopAlbumsInPlaylist] = useState(null);
  const [averagePopularity, setAveragePopularity] = useState(null);
  const [playlistEvolutionDataset, setPlaylistEvolutionDataset] = useState(null);
  const [noData, setNoData] = useState(false);

  const { playlistID } = useParams(); //gets playlistID passed from router and in URL


  useEffect(() => {
    if (playlist != null) {return;}

    if (statePlaylistData.hasOwnProperty(playlistID)){//if playlist is already stored in state
      console.log("PLAYLSIT STORED")
      setPlaylist(statePlaylistData[playlistID].playlist)
      setPlaylistTracks(statePlaylistData[playlistID].playlistTracks)
      setTopArtistsInPlaylist(statePlaylistData[playlistID].topArtists)
      setTopAlbumsInPlaylist(statePlaylistData[playlistID].topAlbums)
      setTopGenresInPlaylist(statePlaylistData[playlistID].topGenres)
      setAveragePopularity(statePlaylistData[playlistID].averagePopularity)
      setPlaylistEvolutionDataset(statePlaylistData[playlistID].playlistEvolution)
      return
    }
    onGetPlaylist(playlistID);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    //runs when playlist is recieved
    if (playlist === null || statePlaylistData.hasOwnProperty(playlistID)) {return}
    if (playlist.total_tracks === 0){
      //if playlist is empty or only contains local songs
      setNoData(true);
      return;
    }

    onGetPlaylistTracks();
    // eslint-disable-next-line
  }, [playlist]);

  useEffect(() => {
    //runs when all playlist tracks have been recieved
    if (playlistTracks === null || statePlaylistData.hasOwnProperty(playlistID)) {
      return;
    }
    let playlistArtistsResult = getPlaylistArtists(playlistTracks);

    if (playlistArtistsResult === "No Data") {
      setNoData(true);
      return;
    }
    setPlaylistArtists(playlistArtistsResult)

    //playlistArtists is updated in getArtists so artist image can also be retrieved
    setTopAlbumsInPlaylist(getPlaylistAlbums(playlistTracks)); //set top albums
    setAveragePopularity(calculateAveragePopularity(playlistTracks)); //set average popularity
    onGetPlaylistEvolution()

    // eslint-disable-next-line
  }, [playlistTracks]);

  useEffect(() =>{
    if (playlistEvolutionDataset === null || statePlaylistData.hasOwnProperty(playlistID)){return;}

    //get artists last because takes longer and is at bottom of page
    onGetArtists(playlistArtists);
    // eslint-disable-next-line
  }, [playlistEvolutionDataset])

  useEffect(() => {//pass playlist data up to parent function to store in state
    if (topGenresInPlaylist === null || topArtistsInPlaylist === null || statePlaylistData.hasOwnProperty(playlistID)){
      return
    }
    console.log("A")
    let playlistDataObj = {
      playlist: playlist,
      playlistTracks: playlistTracks,
      topArtists: topArtistsInPlaylist,
      topGenres: topGenresInPlaylist,
      topAlbums: topAlbumsInPlaylist,
      playlistEvolution: playlistEvolutionDataset,
      averagePopularity: averagePopularity
    }

    let updatedStatePlaylistData = {...statePlaylistData}//copy all playlists already in state
    updatedStatePlaylistData[playlistID] = playlistDataObj//add new playlist
    updateStatePlaylistDataFunc(updatedStatePlaylistData)

    // eslint-disable-next-line
  }, [topArtistsInPlaylist, topGenresInPlaylist])//update parent state when evolution is recieved as it is the last endpoint to fetch

  function onGetPlaylistEvolution() {
    const promise = getPlaylistTopArtistsOverTime(playlist.id);
    promise.then(function (response) {
      setPlaylistEvolutionDataset(response)
    });
  }

  function onGetArtists(playlistArtists) {//gets artist genre and image
    const capitalizeFirstLetter = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
    
    let ids = [];
    for (let key in playlistArtists) {
      ids.push(playlistArtists[key].id);
    }

    let playlistGenres = {};

    const promise = getArtists(token, JSON.stringify(ids));
    promise.then(function (artistsObj) {//artistsObj contains object of artist names mapped to genres and imageURLs
      Object.entries(playlistArtists).forEach(([artistName, artistProperties]) => {
        //iterate through playlistArtists and add nesscary data by indexing artistsObj
        if (artistName.trim() === ""){return}//avoid random errors
        
        //add artist image, set to blank image if undefined
        artistProperties.imageURL = artistsObj[artistName]?.image_url ?? "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"
        
        let genres = artistsObj[artistName].genres;
        
        //iterate through artist genres and add increment genre occurences based on artist occurences
        for (let genre of genres) {
          let genreName = capitalizeFirstLetter(genre)
          if (genreName in playlistGenres) {
            playlistGenres[genreName].totalOccurences += artistProperties.totalOccurences;
          } else {
            playlistGenres[genreName] = { totalOccurences: artistProperties.totalOccurences };
          }
        }
      });

      //update state
      setTopGenresInPlaylist(sortProperties(playlistGenres))
      setTopArtistsInPlaylist(sortProperties(playlistArtists))
    });
  
  }

  function onGetPlaylistTracks() {
    const promise = getPlaylistTracks(token, playlist.id);
    promise.then(function (tracksObject) {
      setPlaylistTracks(tracksObject);
    });
  }

  function onGetPlaylist(playlistID) {
    //get playlist object and update state
    var promise;
    promise = getPlaylist(token, playlistID); //users liked songs endpoint

    promise.then(function (playlistObj) {
      setPlaylist(playlistObj);
    });
  }

  if (noData) {
    return (
      <div className="card-container">
        <PlaylistSummary
          playlist={playlist}
          topArtists={topArtistsInPlaylist}
          topAlbums={topAlbumsInPlaylist}
          topGenres={topGenresInPlaylist}
          averagePopularity={averagePopularity}
          noData={noData}
        />
        <div style={{ height: 20 }}></div>
      </div>
    );
  }
  return (
    <div className="card-container">
      <PlaylistSummary
        playlist={playlist}
        topArtists={topArtistsInPlaylist}
        topAlbums={topAlbumsInPlaylist}
        topGenres={topGenresInPlaylist}
        averagePopularity={averagePopularity}
        noData={noData}
      />
      <LineChart playlistEvolutionDataset={playlistEvolutionDataset} />
      <TopArtistsAlbums topArtists={topArtistsInPlaylist} topAlbums={topAlbumsInPlaylist}/>
      <GenreChart topGenres={topGenresInPlaylist} />
    </div>
  );
}
