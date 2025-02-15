package com.example.spring_boot.playlist;

import java.util.Map;

import java.net.URI;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.spring_boot.artist.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
 
@Service
public class PlaylistService {
  @Autowired
  private PlaylistRepository playlistRepository;
  @Autowired
  private TrackRepository trackRepository;
  private static final Gson gson = new GsonBuilder()
    .serializeNulls() // Serializes null fields as well
    .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) // Custom serializer for LocalDateTime
    .excludeFieldsWithoutExposeAnnotation() // Only serialize fields annotated with @Expose
    .create();

  public Playlist getPlaylistById(String playlistId) {
    return playlistRepository.findById(playlistId)
            .orElseThrow(() -> new RuntimeException("Playlist not found"));
  }

  public static URI playlistEndpointBuilder(String endpoint) throws Exception{
    //external_urls.spotify
    //followers.total,id,images.url,name,owner(external_urls,display_name,id)
    //snapshot_id
    //tracks(total,next)
    final String fieldsParam = "snapshot_id,followers.total,id,images.url,name,owner(external_urls,display_name,id),tracks(total,next),external_urls.spotify";
    // Create an HttpRequest with headers 
    String encodedFieldsParam = URLEncoder.encode(fieldsParam, StandardCharsets.UTF_8);
    String fullEndpoint = endpoint + "?fields=" + encodedFieldsParam;
   
    return new URI(fullEndpoint);
  }

  public static URI playlistTracksEndpointBuilder(String endpoint) throws Exception{
    //next
    //items(added_at,is_local)
    //items.track.album(external_urls,images.url,name)
    //items.track.artists(external_urls,href,name,id)
    //items.track(external_urls,popularity)
    final String fieldsParam = "next,items(added_at,is_local),items.track.album(external_urls,images.url,name,total_tracks),items.track.artists(external_urls,href,name,id),items.track(external_urls,popularity,type,name)";
    // Create an HttpRequest with headers 
    String encodedFieldsParam =URLEncoder.encode(fieldsParam, StandardCharsets.UTF_8);
    String fullEndpoint= endpoint + "&fields=" + encodedFieldsParam;
   
    return new URI(fullEndpoint);
  }
  
  public static JsonArray filterPlaylistTracks(JsonArray playlistTracks) {
    //filter out local songs or songs that cant be found
    JsonArray filteredPlaylistTracks = new JsonArray();

    for (JsonElement element : playlistTracks) {
        JsonObject trackObj = element.getAsJsonObject();
        
        if (trackObj.get("track").isJsonNull()) continue; // Skip if track is null
        if (!"track".equals(trackObj.get("track").getAsJsonObject().get("type").getAsString())) continue; // Skip if not a track
        if (trackObj.has("is_local") && trackObj.get("is_local").getAsBoolean()) continue; // Skip local songs

        filteredPlaylistTracks.add(trackObj);
    }
    return filteredPlaylistTracks;
}

  public static String getPlaylistEndpointResult(URI endpoint, String accessToken) throws Exception {
    //gets playlist and playlist tracks
    // Create an HttpClient instance
   
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(endpoint)
        .header("Authorization", "Bearer " + accessToken) // Set Authorization header
        .GET() // Use GET method
        .build();

    // Send the request and get the response
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    //System.out.println("Response Code: " + response.statusCode());
    return response.body().toString();
  }
 
  public static JsonArray getPlaylistTracksResult(JsonArray playlistTracks, String nextEndpoint, String token) throws Exception {
    // Only 100 songs can be retrieved at once, recursively call each endpoint
    // The initial playlist endpoint returns 100 tracks and a next endpoint for the
    // next 100
    // If next endpoint doesn't exist, return
    // Otherwise, make an API call to the endpoint then call the function again
    // while adding to the list of tracks
    if (nextEndpoint == null || playlistTracks.size() >= 2500) { // Don't scan over 2200 tracks
      System.out.println(playlistTracks.size());
      return filterPlaylistTracks(playlistTracks);
    }
    System.out.println("Fetching playlist tracks");
    // Make an API request to get the next set of tracks
    String tracksJsonStr = getPlaylistEndpointResult(playlistTracksEndpointBuilder(nextEndpoint), token);
    JsonObject tracksObj = JsonParser.parseString(tracksJsonStr).getAsJsonObject();
    
    for (JsonElement element : tracksObj.get("items").getAsJsonArray()) {
      playlistTracks.add(element);
    }
    
    JsonElement nextEndpointElement = tracksObj.get("next");
    String next;
    if (nextEndpointElement.isJsonNull()) {//check if next is Jsonnull then set to null
      next= null;
    } else {
      next = nextEndpointElement.getAsString(); 
    }
    //Recursive call with the new list of tracks and the next endpoint 
    return getPlaylistTracksResult(playlistTracks, next, token);
  }

  public String getPlaylist(String access_token, String playlistID) {
    try {
      if (playlistID.equals("liked_songs")){
        String likedSongsEndpoint = "https://api.spotify.com/v1/me/tracks?limit=1";
        JsonObject likedSongsPlaylist = JsonParser.parseString(getPlaylistEndpointResult(new URI(likedSongsEndpoint), access_token)).getAsJsonObject();
        
        String playlistName = "Liked Songs";
        String playlistHref =  "https://open.spotify.com/collection/tracks";
        String image_url ="https://misc.scdn.co/liked-songs/liked-songs-300.jpg";
  
        String owner_name = "";
        String owner_url = "https://open.spotify.com/collection/tracks";
        String snapshot_id = null;
        int followers = 0;
        int total_tracks = likedSongsPlaylist.get("total").getAsInt();
  
        Playlist playlist = new Playlist(playlistID, playlistName, playlistHref, image_url, owner_name, owner_url, snapshot_id, followers, total_tracks, null);
        return gson.toJson(playlist);
      }
      String endpoint = String.format("https://api.spotify.com/v1/playlists/%s", playlistID);

      String playlistAsStr = getPlaylistEndpointResult(playlistEndpointBuilder(endpoint), access_token);
      JsonObject playlistResult =  JsonParser.parseString(playlistAsStr).getAsJsonObject(); // Calling the method

      String playlistName = playlistResult.get("name").getAsString();
      String playlistHref = playlistResult.get("external_urls").getAsJsonObject().get("spotify").getAsString();
      String image_url;

      try {
        image_url = playlistResult.get("images").getAsJsonArray().get(0).getAsJsonObject().get("url").getAsString();
      } catch (Exception e)  {
        image_url = null;
      }

      String owner_name = playlistResult.get("owner").getAsJsonObject().get("display_name").getAsString();
      String owner_url = playlistResult.get("owner").getAsJsonObject().get("external_urls").getAsJsonObject().get("spotify").getAsString();
      String snapshot_id = playlistResult.get("snapshot_id").getAsString();
      int followers = playlistResult.get("followers").getAsJsonObject().get("total").getAsInt();
      int total_tracks = playlistResult.get("tracks").getAsJsonObject().get("total").getAsInt();

      Playlist playlist = new Playlist(playlistID, playlistName, playlistHref, image_url, owner_name, owner_url, snapshot_id, followers, total_tracks, null);
      playlistRepository.save(playlist);
      return gson.toJson(playlist);
    } catch (Exception e) {
      // Handle the exception (log it, return a default value, etc.)
      e.printStackTrace();
      return "Error occurred while fetching the playlist.";
    }
  }

  

  public String getPlaylistTracks(String access_token, String playlistID) {
    try {
      if (playlistID.equals("liked_songs")){
        String likedSongsEndpoint = "https://api.spotify.com/v1/me/tracks?limit=50";
        JsonArray playlistTracks = getPlaylistTracksResult(new JsonArray(), likedSongsEndpoint, access_token); // Calling the method

        List<Track> tracks = new ArrayList<>();
      for (JsonElement element : playlistTracks){
        JsonObject track = element.getAsJsonObject();

        String trackName = track.get("track").getAsJsonObject().get("name").getAsString();
        String trackArtists =  track.get("track").getAsJsonObject().get("artists").getAsJsonArray().toString();//gets jsonArr as str

        //check if album is a single, only allow albums/eps
        String trackAlbumName;
        if (track.get("track").getAsJsonObject().get("album").getAsJsonObject().get("total_tracks").getAsInt() == 1){
          trackAlbumName = null;
        } else {
          trackAlbumName =  track.get("track").getAsJsonObject().get("album").getAsJsonObject().get("name").getAsString();
        }
      
        String trackAlbumHref = track.get("track").getAsJsonObject().get("album")
          .getAsJsonObject().get("external_urls").getAsJsonObject().get("spotify").getAsString();
        String image_url;
        try {
          image_url = track.get("track").getAsJsonObject().get("album").getAsJsonObject()
            .get("images").getAsJsonArray().get(0).getAsJsonObject().get("url").getAsString();
        } catch (Exception e)  {
          image_url = null;
        }
        String trackHref = track.get("track").getAsJsonObject()
          .get("external_urls").getAsJsonObject().get("spotify").getAsString();
        String added_at = track.get("added_at").getAsString();

        int popularity = track.get("track").getAsJsonObject().get("popularity").getAsInt();
      
        tracks.add(new Track(trackName, trackArtists, trackAlbumName, trackAlbumHref, image_url, trackHref, added_at,popularity, null));

      }
      
      return gson.toJson(tracks); // Calling the method

      }
      
      String endpoint = String.format("https://api.spotify.com/v1/playlists/%s/tracks?limit=100", playlistID);

      JsonArray playlistTracks = getPlaylistTracksResult(new JsonArray(), endpoint, access_token);
      
      List<Track> tracks = new ArrayList<>();
      for (JsonElement element : playlistTracks){
        JsonObject track = element.getAsJsonObject();

        String trackName = track.get("track").getAsJsonObject().get("name").getAsString();
        String trackArtists =  track.get("track").getAsJsonObject().get("artists").getAsJsonArray().toString();//gets jsonArr as str

        //check if album is a single, only allow albums/eps
        String trackAlbumName;
        if (track.get("track").getAsJsonObject().get("album").getAsJsonObject().get("total_tracks").getAsInt() == 1){
          trackAlbumName = null;
        } else {
          trackAlbumName =  track.get("track").getAsJsonObject().get("album").getAsJsonObject().get("name").getAsString();
        }
      
        String trackAlbumHref = track.get("track").getAsJsonObject().get("album")
          .getAsJsonObject().get("external_urls").getAsJsonObject().get("spotify").getAsString();
        String image_url;
        try {
          image_url = track.get("track").getAsJsonObject().get("album").getAsJsonObject()
            .get("images").getAsJsonArray().get(0).getAsJsonObject().get("url").getAsString();
        } catch (Exception e)  {
          image_url = null;
        }
        String trackHref = track.get("track").getAsJsonObject()
          .get("external_urls").getAsJsonObject().get("spotify").getAsString();
        String added_at = track.get("added_at").getAsString();

        int popularity = track.get("track").getAsJsonObject().get("popularity").getAsInt();
        Playlist playlist = getPlaylistById(playlistID);
        tracks.add(new Track(trackName, trackArtists, trackAlbumName, trackAlbumHref, image_url, trackHref, added_at,popularity, playlist));

      }
      trackRepository.saveAll(tracks);
      return gson.toJson(tracks); 
    } catch (Exception e) {
      // Handle the exception (log it, return a default value, etc.)
      e.printStackTrace();
      return "Error occurred while fetching the playlist tracks.";
    }
  }

  public Map<String, Map<String, Double>> getTopArtistsOverTime(String playlistTracks) {
    ParsePlaylist parseData = new ParsePlaylist();
    Map<String, Map<String, Double>> artists = parseData.parseTopArtistsOverTime(playlistTracks);
    return artists;
  }

}
