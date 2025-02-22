package com.example.spring_boot.playlist;

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
import org.springframework.util.StopWatch;

import com.example.spring_boot.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.transaction.Transactional;

@Service
public class TracksService {
  @Autowired
  private PlaylistRepository playlistRepository;

  private final HttpClient client = HttpClient.newHttpClient();

  private final Gson gson = new GsonBuilder().serializeNulls() // Serializes null fields as well
      .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) // Custom serializer for LocalDateTime
      .excludeFieldsWithoutExposeAnnotation() // Only serialize fields annotated with @Expose
      .create();

  @Transactional
  private Playlist getPlaylistById(String playlistId) {
    return playlistRepository.findById(playlistId)
        .orElseThrow(() -> new RuntimeException("Playlist not found"));
  }

  private URI playlistTracksEndpointBuilder(String endpoint) throws Exception {
    // next
    // items(added_at,is_local)
    // items.track.album(external_urls,images.url,name)
    // items.track.artists(external_urls,href,name,id)
    // items.track(external_urls,popularity)
    final String fieldsParam = "next,items(added_at,is_local),items.track.album(external_urls,images.url,name,total_tracks),items.track.artists(external_urls,href,name,id),items.track(external_urls,popularity,type,name)";
    // Create an HttpRequest with headers
    String encodedFieldsParam = URLEncoder.encode(fieldsParam, StandardCharsets.UTF_8);
    String fullEndpoint = endpoint + "&fields=" + encodedFieldsParam;

    return new URI(fullEndpoint);
  }

  private JsonArray filterPlaylistTracks(JsonArray playlistTracks) {
    // filter out local songs or songs that cant be found
    JsonArray filteredPlaylistTracks = new JsonArray();

    for (JsonElement element : playlistTracks) {
      JsonObject trackObj = element.getAsJsonObject();

      if (trackObj.get("track").isJsonNull())
        continue; // Skip if track is null
      if (!"track".equals(trackObj.get("track").getAsJsonObject().get("type").getAsString()))
        continue; // Skip if not a track
      if (trackObj.has("is_local") && trackObj.get("is_local").getAsBoolean())
        continue; // Skip local songs

      filteredPlaylistTracks.add(trackObj);
    }
    return filteredPlaylistTracks;
  }

  private String getPlaylistEndpointResult(URI endpoint, String accessToken) throws Exception {// makes api call

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

  private JsonArray getPlaylistTracksResult(JsonArray playlistTracks, String nextEndpoint, String token)
      throws Exception {
    // Only 100 songs can be retrieved at once, recursively call each endpoint
    // The initial playlist endpoint returns 100 tracks and a next endpoint for the
    // next 100
    // If next endpoint doesn't exist, return
    // Otherwise, make an API call to the endpoint then call the function again
    // while adding to the list of tracks

    if (nextEndpoint == null || playlistTracks.size() >= 2100) { // Don't scan over 2200 tracks
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
    if (nextEndpointElement.isJsonNull()) {// check if next is Jsonnull then set to null
      next = null;
    } else {
      next = nextEndpointElement.getAsString();
    }
    // Recursive call with the new list of tracks and the next endpoint
    return getPlaylistTracksResult(playlistTracks, next, token);
  }

  private List<Track> createTrackObjects(JsonArray playlistTracksJSON, Playlist playlist) {
    List<Track> tracks = new ArrayList<>();
    for (JsonElement element : playlistTracksJSON) {
      JsonObject track = element.getAsJsonObject();

      String trackName = track.get("track").getAsJsonObject().get("name").getAsString();
      String trackArtists = track.get("track").getAsJsonObject()
          .get("artists").getAsJsonArray().toString();// gets jsonArr as str

      // check if album is a single, only allow albums/eps
      String trackAlbumName;
      if (track.get("track").getAsJsonObject()
          .get("album").getAsJsonObject().get("total_tracks").getAsInt() == 1) {
        trackAlbumName = null;
      } else {
        trackAlbumName = track.get("track").getAsJsonObject().get("album").getAsJsonObject().get("name")
            .getAsString();
      }

      String trackAlbumHref = track.get("track").getAsJsonObject().get("album")
          .getAsJsonObject().get("external_urls").getAsJsonObject().get("spotify").getAsString();
      String image_url;
      try {
        image_url = track.get("track").getAsJsonObject().get("album").getAsJsonObject()
            .get("images").getAsJsonArray().get(0).getAsJsonObject().get("url").getAsString();
      } catch (Exception e) {
        image_url = null;
      }
      String trackHref = track.get("track").getAsJsonObject()
          .get("external_urls").getAsJsonObject().get("spotify").getAsString();
      String added_at = track.get("added_at").getAsString();

      int popularity = track.get("track").getAsJsonObject().get("popularity").getAsInt();

      tracks.add(new Track(trackName, trackArtists, trackAlbumName, trackAlbumHref, image_url, trackHref, added_at,
          popularity, playlist));
    }
    return tracks;
  }

  public String getPlaylistTracks(String access_token, String playlistID) {
    StopWatch stopWatch = new StopWatch();
    Playlist playlist = new Playlist();
    stopWatch.start("Fetch Playlist From Database");
    playlist = getPlaylistById(playlistID);
    stopWatch.stop();

    // Your function logic here
    if (playlist.getTracks().size() != 0) {// tracks are already stored no need to fetch again
      System.out.println(stopWatch.prettyPrint());
      return gson.toJson(playlist.getTracks());
    }
    stopWatch.start("Fetch Tracks From Spotify");
    JsonArray playlistTracks;
    try {
      if (playlist.getIsLikedSongs()) {
        final String likedSongsEndpoint = "https://api.spotify.com/v1/me/tracks?limit=50";
        playlistTracks = getPlaylistTracksResult(new JsonArray(), likedSongsEndpoint, access_token);
      } else {
        String standardPlaylistEndpoint = String.format("https://api.spotify.com/v1/playlists/%s/tracks?limit=100",
            playlistID);
        playlistTracks = getPlaylistTracksResult(new JsonArray(), standardPlaylistEndpoint, access_token);
      }
    } catch (Exception e) {
      e.printStackTrace();
      return "Error while fetching playlist tracks";
    }

    List<Track> tracks = createTrackObjects(playlistTracks, playlist);
    playlist.setTracks(tracks);
    stopWatch.stop();

    stopWatch.start("Save tracks to database");
    playlistRepository.save(playlist);
    stopWatch.stop();

    System.out.println(stopWatch.prettyPrint());
    return gson.toJson(tracks);
  }
}
