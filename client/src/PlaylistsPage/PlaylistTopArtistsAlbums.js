import React from "react";
import "./styles/PlaylistTopArtistsAlbums.css";
import LoadingIcon from "../components/LoadingIcon";
import spotifyIcon from "../Spotify_Primary_Logo_RGB_White.png";

function renderArtists(aritsts) {
  const myLst = Object.entries(aritsts).map(([artistIndex, artist]) => (
    <div key={artistIndex} className="playlist-top-items-listing">
      <table>
        <colgroup>
          <col width="32px" />
          <col width="55px" />
          <col width="340px" />
          <col width="200px" />
        </colgroup>

        <tbody>
          <tr>
            <td className="playlist-top-items-rank">
              {parseInt(artistIndex) + 1}
            </td>
            <td className="playlist-top-items-image">
              <a
                href={artist[1].href}
                target="_blank"
                rel="noopener noreferrer">
                <img
                  src={artist[1].imageURL}
                  className="playlist-artist-cover"
                  alt="artistImg"
                  loading="eager"
                />
              </a>
            </td>
            <td>
              <a
                href={artist[1].href}
                target="_blank"
                rel="noopener noreferrer">
                {artist[0]} {/* artist name */}
              </a>
            </td>
            <td className="item-occurences">
              {artist[1].totalOccurences} Songs
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ));
  return myLst;
}

function renderAlbums(albums) {
  const myLst = Object.entries(albums).map(([albumIndex, album]) => (
    <div key={albumIndex} className="playlist-top-items-listing">
      <table>
        <colgroup>
          <col width="32px" />
          <col width="55px" />
          <col width="405px" />
          <col width="135px" />
        </colgroup>

        <tbody>
          <tr>
            <td className="playlist-top-items-rank">
              {parseInt(albumIndex) + 1}
            </td>
            <td className="playlist-top-items-image">
              <a href={album[1].href} target="_blank" rel="noopener noreferrer">
                <img className="playlist-album-cover" src={album[1].imageURL} alt="artistImg" loading="eager" />
              </a>
            </td>
            <td>
              <a href={album[1].href} target="_blank" rel="noopener noreferrer">
                {album[0]} {/* name */}
              </a>
            </td>
            <td className="item-occurences">
              {album[1].totalOccurences} Songs
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ));
  return myLst;
}

export default function TopArtistsAlbums({ topArtists, topAlbums }) {
  if (topArtists === null || topAlbums === null) {
    return <LoadingIcon />;
  }

  const numOfTopItems = 25; //max amount of top artists and albums to display
  const slicedTopArtists = Object.fromEntries(
    Object.entries(topArtists).slice(0, numOfTopItems)
  );
  const slicedTopAlbums = Object.fromEntries(
    Object.entries(topAlbums).slice(0, numOfTopItems)
  );

  return (
    <div id="top-artists-albums-card" className="playlist-card">
      <div className="top-artists-albums-container">
        <div>
          <div className="top-items-title">
            <h2>Top Artists</h2>
            <img src={spotifyIcon} alt="SpotifyIcon"></img>
          </div>
          <div className="top-items-list">
            {renderArtists(slicedTopArtists)}
          </div>
        </div>

        <div>
          <div className="top-items-title">
            <h2>Top Albums</h2>
            <img src={spotifyIcon} alt="SpotifyIcon"></img>
          </div>
          <div className="top-items-list"> 
            {renderAlbums(slicedTopAlbums)}
          </div>
        </div>
      </div>
    </div>
  );
}
