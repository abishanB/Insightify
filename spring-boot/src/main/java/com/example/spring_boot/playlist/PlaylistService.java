package com.example.spring_boot.playlist;

import java.util.Map;

import java.net.URI;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class PlaylistService {
  public static URI playlistEndpointBuilder(String endpoint) throws Exception{
    //followers.total,id,images.url,name,owner(external_urls,display_name,id)
    //tracks(total,next)
    final String fieldsParam = "followers.total,id,images.url,name,owner(external_urls,display_name,id)";
    // Create an HttpRequest with headers 
    String encodedFieldsParam = URLEncoder.encode(fieldsParam, StandardCharsets.UTF_8);
    String fullEndpoint = endpoint + "?fields=" + encodedFieldsParam;
   
    return new URI(fullEndpoint);
  }

  public static URI playlistTracksEndpointBuilder(String endpoint) throws Exception{
    //next
    //items(added_at,is_local)
    //items.track.album(external_urls,images.url)
    //items.track.artists(external_urls,href,name,id)
    //items.track(external_urls,popularity)
    final String fieldsParam = "next,items(added_at,is_local),items.track.album(external_urls,images.url),items.track.artists(external_urls,href,name,id),items.track(external_urls,popularity,type)";
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
      String endpoint = String.format("https://api.spotify.com/v1/playlists/%s", playlistID);
      return getPlaylistEndpointResult(playlistEndpointBuilder(endpoint), access_token); // Calling the method
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
        return getPlaylistTracksResult(new JsonArray(), likedSongsEndpoint, access_token).toString(); // Calling the method
      }
      
      String endpoint = String.format("https://api.spotify.com/v1/playlists/%s/tracks?limit=100", playlistID);
      return getPlaylistTracksResult(new JsonArray(), endpoint, access_token).toString(); // Calling the method
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
