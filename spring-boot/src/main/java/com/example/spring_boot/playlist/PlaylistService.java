package com.example.spring_boot.playlist;

import java.util.ArrayList;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.spring_boot.artist.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class PlaylistService {
  @Autowired
  private PlaylistRepository playlistRepository;

  @Autowired
  private TrackRepository trackRepository;
  private final HttpClient client = HttpClient.newHttpClient();

  private final Gson gson = new GsonBuilder()
      .serializeNulls() // Serializes null fields as well
      .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) // Custom serializer for LocalDateTime
      .excludeFieldsWithoutExposeAnnotation() // Only serialize fields annotated with @Expose
      .create();

  public Playlist getPlaylistById(String playlistId) {
    return playlistRepository.findById(playlistId)
        .orElseThrow(() -> new RuntimeException("Playlist not found"));
  }

  private URI playlistEndpointBuilder(String endpoint) throws Exception {
    // external_urls.spotify
    // followers.total,id,images.url,name,owner(external_urls,display_name,id)
    // snapshot_id
    // tracks(total,next)
    final String fieldsParam = "snapshot_id,followers.total,id,images.url,name,owner(external_urls,display_name,id),tracks(total,next),external_urls.spotify";
    // Create an HttpRequest with headers
    String encodedFieldsParam = URLEncoder.encode(fieldsParam, StandardCharsets.UTF_8);
    String fullEndpoint = endpoint + "?fields=" + encodedFieldsParam;

    return new URI(fullEndpoint);
  }

  private String getPlaylistEndpointResult(URI endpoint, String accessToken) throws Exception {// gets playlist
    HttpRequest request = HttpRequest.newBuilder()
        .uri(endpoint)
        .header("Authorization", "Bearer " + accessToken) // Set Authorization header
        .GET() // Use GET method
        .build();

    // Send the request and get the response
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    // System.out.println("Response Code: " + response.statusCode());
    return response.body().toString();
  }

  public String createLikedSongsResponse(String access_token, String playlistID) {
    String likedSongsEndpoint = "https://api.spotify.com/v1/me/tracks?limit=1";
    JsonObject likedSongsPlaylist;
    try {
      likedSongsPlaylist = JsonParser
          .parseString(getPlaylistEndpointResult(new URI(likedSongsEndpoint), access_token)).getAsJsonObject();
    } catch (Exception e) {
      e.printStackTrace();
      return "Error occurred while fetching the playlist.";
    }

    String playlistName = "Liked Songs";
    String playlistHref = "https://open.spotify.com/collection/tracks";
    String image_url = "https://misc.scdn.co/liked-songs/liked-songs-300.jpg";
    String owner_name = "";
    String owner_url = "https://open.spotify.com/collection/tracks";
    String snapshot_id = null;
    int followers = 0;
    int total_tracks = likedSongsPlaylist.get("total").getAsInt();

    Playlist likedSongs = new Playlist(playlistID, playlistName, playlistHref, image_url, owner_name, owner_url,
        snapshot_id, followers, total_tracks, null);
    return gson.toJson(likedSongs);
  }

  public Playlist createPlaylistResponse(String playlistAsStr, String playlistID) {
    JsonObject playlistResult = JsonParser.parseString(playlistAsStr).getAsJsonObject(); // Calling the method

    String playlistName = playlistResult.get("name").getAsString();
    String playlistHref = playlistResult.get("external_urls").getAsJsonObject().get("spotify").getAsString();
    String image_url;

    try {
      image_url = playlistResult.get("images").getAsJsonArray().get(0).getAsJsonObject().get("url").getAsString();
    } catch (Exception e) {
      image_url = null;
    }

    String owner_name = playlistResult.get("owner").getAsJsonObject().get("display_name").getAsString();
    String owner_url = playlistResult.get("owner").getAsJsonObject().get("external_urls").getAsJsonObject()
        .get("spotify").getAsString();
    String snapshot_id = playlistResult.get("snapshot_id").getAsString();
    int followers = playlistResult.get("followers").getAsJsonObject().get("total").getAsInt();
    int total_tracks = playlistResult.get("tracks").getAsJsonObject().get("total").getAsInt();

    Playlist playlist = new Playlist(playlistID, playlistName, playlistHref, image_url, owner_name, owner_url,
        snapshot_id, followers, total_tracks, new ArrayList<>());
    return playlist;
  }

  public boolean isPlaylistUpToDate(String lastSnapshot, String currentSnapshot){
    //diferent snapshot indicates a change to the playlist
    //null snapshot means playlist not in database
    if (lastSnapshot == null) {
      return false;
    }
    return lastSnapshot.equals(currentSnapshot);
  }

  public String getPlaylist(String access_token, String playlistID) {
    if (playlistID.equals("liked_songs")) {// liked songs arent saved to database yet
      return createLikedSongsResponse(access_token, playlistID);
    }
    
    String endpoint = String.format("https://api.spotify.com/v1/playlists/%s", playlistID);
    String playlistAsStr;
    try {
      playlistAsStr = getPlaylistEndpointResult(playlistEndpointBuilder(endpoint), access_token);
    } catch (Exception e) {
      // Handle the exception (log it, return a default value, etc.)
      e.printStackTrace();
      return "Error occurred while fetching the playlist.";
    }

    Playlist playlist = createPlaylistResponse(playlistAsStr, playlistID);
    if (isPlaylistUpToDate(playlistRepository.findSnapshotById(playlistID), playlist.getSnapshot_id())){
      //set tracks to the one in already stored in database
      System.out.println("------\nSAME SNAPSHOT\n------");
      playlist.setTracks(playlistRepository.getTracksById(playlistID));
    } else{
      //if not up to date dont set tracks and tracks will be empty
      //tracks will be fetched again in TracksService
      System.out.println("------\nNEW SNAPSHOT\n------");
      trackRepository.deleteAllTracksByPlaylistId(playlistID);//ensure all tracks are deleted from table
    }
 
    playlistRepository.save(playlist);
    return gson.toJson(playlist);
  }

  
}
