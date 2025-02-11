import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPlaylist,
  getPlaylistTracks,
  getArtists,
} from "../apiCalls";
import LoadingIcon from "../components/LoadingIcon";
import GenreChart from "./GenreChart";
import "./styles/PlaylistAnalysis.css";
import PlaylistSummary from "./PlaylistSummaryCard";
import TopArtistsAlbums from "./PlaylistTopArtistsAlbums";
import LineChart from "./LineChart";

function sortProperties(obj) {
  //sorts artists, albums and genres from most occuring to least
  var sortable = [];

  for (var key in obj)
    if (obj.hasOwnProperty(key)) sortable.push([key, obj[key]]);

  sortable.sort(function (a, b) {
    return b[1].totalOccurences - a[1].totalOccurences;
  });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function calculateAveragePopularity(playlistTracks) {
  let totalPopularity = 0;
  for (let trackObj of Object.values(playlistTracks)) {
    totalPopularity += trackObj.track.popularity;
  }
  return Math.round(totalPopularity / playlistTracks.length);
}

function getPlaylistArtists(playlistTracks) {
  //collect how many times a artist appears in the playlist and returns it sorted
  let playlistArtists = {};
  for (let trackObj of Object.values(playlistTracks)) {
    trackObj.track.artists.forEach((artist) => {
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
    if (trackObj.track.album.total_tracks === 1) {
      continue;
    } //skip albums with only 1 song(singles)

    if (trackObj.track.album.name in playlistAlbums) {
      playlistAlbums[trackObj.track.album.name].totalOccurences += 1;
    } else {
      playlistAlbums[trackObj.track.album.name] = {};
      Object.defineProperty(
        playlistAlbums[trackObj.track.album.name],
        "totalOccurences",
        {
          value: 1,
          writable: true,
        }
      );
      Object.defineProperty(playlistAlbums[trackObj.track.album.name], "href", {
        value: trackObj.track.album.external_urls.spotify,
        writable: true,
      });
      Object.defineProperty(
        playlistAlbums[trackObj.track.album.name],
        "imageURL",
        {
          value: trackObj.track.album.images[0].url,
          writable: true,
        }
      );
    }
  }

  return sortProperties(playlistAlbums);
}

export default function PlaylistInfo(props) {
  const [playlist, setPlaylist] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [topArtistsInPlaylist, setTopArtistsInPlaylist] = useState([]); //{index: [artist, {id , href, imageURL, totalOccurences}]}
  const [topGenresInPlaylists, setTopGenresInPlaylists] = useState([]);
  const [topAlbumsInPlaylist, setTopAlbumsInPlaylist] = useState([]);
  const [averagePopularity, setAveragePopularity] = useState();
  const [noData, setNoData] = useState(false);

  const [error, setError] = useState(false);

  const [readyToRender, setReadyToRender] = useState(false);

  const { playlistID } = useParams(); //gets playlistID passed from router and in URL

  if (error) {
    throw new Error("Can't fetch playlist", playlistID);
  }

  useEffect(() => {
    //on page load
    if (playlist.length !== 0) {
      return;
    }
    onGetPlaylist(playlistID);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    //runs when playlist is recieved
    if (playlist.length === 0) {
      return;
    }
    if (
      (playlistID !== "liked_songs" && playlist.tracks.total === 0) ||
      (playlistID === "liked_songs" && playlist.total === 0)
    ) {
      //if playlist is empty or only contains local songs
      setNoData(true);
      setReadyToRender(true);
      return;
    }

    onGetPlaylistTracks();
    // eslint-disable-next-line
  }, [playlist]);

  useEffect(() => {
    //runs when all playlist tracks have been recieved
    if (playlistTracks.length === 0) {
      return;
    }
    let getPlaylistArtistsResult = getPlaylistArtists(playlistTracks);

    if (getPlaylistArtistsResult === "No Data") {
      setNoData(true);
      setReadyToRender(true);
      return;
    }

    //playlistArtists is updated in getGenres so artist image can also be retrieved
    getGenresEndpoint(getPlaylistArtistsResult);
    setTopAlbumsInPlaylist(getPlaylistAlbums(playlistTracks)); //set top albums
    setAveragePopularity(calculateAveragePopularity(playlistTracks)); //set average popularity
    // eslint-disable-next-line
  }, [playlistTracks]);

  useEffect(() => {
    //when playlist artists and ids are recieved to get genres
    if (topGenresInPlaylists.length === 0) {
      return;
    }
    setReadyToRender(true);
  }, [topGenresInPlaylists]);

  function getGenresEndpoint(playlistArtists) {
    const capitalizeFirstLetter = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
    

    let ids = [];
    for (let key in playlistArtists) {
      ids.push(playlistArtists[key].id);
    }

    let playlistGenres = {};

    const promise = getArtists(props.token, JSON.stringify(ids));
    promise.then(function (artistsObj) {
      Object.entries(playlistArtists).forEach(([artistName, artistProperties]) => {
        if (artistName.trim()==""){
          return;
        }
        artistProperties.imageURL = artistsObj[artistName].imageURL
      
        let genres = artistsObj[artistName].genres;
        
        for (let genre of genres) {
          let genreName = capitalizeFirstLetter(genre)
          if (genreName in playlistGenres) {
            playlistGenres[genreName].totalOccurences += artistProperties.totalOccurences;
          } else {
            playlistGenres[genreName] = { totalOccurences: artistProperties.totalOccurences };
          }
        }
      });
      setTopGenresInPlaylists(sortProperties(playlistGenres))
      setTopArtistsInPlaylist(sortProperties(playlistArtists))
    });
  
  }

 

  function onGetPlaylistTracks() {
    const promise = getPlaylistTracks(props.token, playlistID);
    promise.then(function (tracksObject) {
      //setPlaylistTracks(playlistTracks.concat(tracksObject.items))
      setPlaylistTracks(tracksObject);
    });
  }

  function onGetPlaylist(playlistID) {
    //get playlist object and update state
    var promise;
    promise = getPlaylist(props.token, playlistID); //users liked songs endpoint

    promise.then(function (playlistObj) {
      if (playlistObj === false) {
        setError(true);
        return;
      }

      //add properties to handle liked songs as a playlist

      setPlaylist(playlistObj);
    });
  }

  if (!readyToRender) {
    return <LoadingIcon />;
  }
  if (noData) {
    return (
      <div className="card-container">
        <PlaylistSummary
          playlist={playlist}
          topArtists={topArtistsInPlaylist}
          topAlbums={topAlbumsInPlaylist}
          topGenres={topGenresInPlaylists}
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
        topGenres={topGenresInPlaylists}
        averagePopularity={averagePopularity}
        noData={noData}
      />
      <TopArtistsAlbums
        topArtists={topArtistsInPlaylist}
        topAlbums={topAlbumsInPlaylist}
      />
      <LineChart playlistTracks={playlistTracks} token={props.token} />
      <GenreChart topGenres={topGenresInPlaylists} />
      <div style={{ height: 20 }}></div>
    </div>
  );
}
