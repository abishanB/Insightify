package com.example.spring_boot.artist;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.spring_boot.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArtistService {
  @Autowired
  private ArtistRepository artistRepository;

  private final int artistDatabaseThresholdTime = 90;// days
  private final int artistPopularityThreshold = 30;// only save artists above this threshold

  private final HttpClient client = HttpClient.newHttpClient();
  private final String SPOTIFY_API_ARTISTS_URL = "https://api.spotify.com/v1/artists?ids=";
  private final Gson gson = new GsonBuilder().serializeNulls()
      .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()).create();

  private void saveArtistsToDatabase(List<Artist> artists) {

    // array of artists to save to database
    List<Artist> artistsToSaveArr = new ArrayList<>();

    for (Artist artist : artists) {
      if (artist.getPopularity() >= artistPopularityThreshold) {
        artistsToSaveArr.add(artist);
      }
    }

    artistRepository.saveAll(artistsToSaveArr);// save to database
  }

  public void deleteArtistFromDatabase() {
    LocalDateTime threshold = LocalDateTime.now().minusDays(artistDatabaseThresholdTime);
    artistRepository.deleteOldEntries(threshold);
    //System.out.println("Artists Deleted: " + artistsDroped);
  }

  private String getEndpointResult(String accessToken, String url) throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .header("Authorization", "Bearer " + accessToken)
        .GET()
        .build();

    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    return response.body().toString();
  }

  private List<List<String>> splitListIntoChunks(List<String> list, int chunkSize) {
    List<List<String>> chunks = new ArrayList<>();

    for (int i = 0; i < list.size(); i += chunkSize) {
      // Calculate the end index for the current chunk
      int end = Math.min(list.size(), i + chunkSize);

      // Create a new sublist for the current chunk
      List<String> chunk = list.subList(i, end);

      // Add the chunk to the list of chunks
      chunks.add(new ArrayList<>(chunk)); // Create a new ArrayList to avoid mutability issues
    }

    return chunks;
  }

  private String fetchArtistsFromAPI(String access_token, List<String> artistIDsList) {
    // max amount of aritsts per call to spotify is 50
    // get all artists from spotify
    int chunkSize = 50;
    List<List<String>> chunks = splitListIntoChunks(artistIDsList, chunkSize);

    int artistChunkCounter = 1;
    JsonArray artistsArray = new JsonArray();
    for (List<String> ids : chunks) {
      String url = SPOTIFY_API_ARTISTS_URL + String.join(",", ids);
      try {
        System.out.println("Fetching artists " + artistChunkCounter + "/" + chunks.size());

        String promise = getEndpointResult(access_token, url);
        for (JsonElement element : JsonParser.parseString(promise).getAsJsonObject().get("artists").getAsJsonArray()) {
          artistsArray.add(element);
        }
        artistChunkCounter++;
      } catch (Exception e) {
        // Handle the exception (log it, return a default value, etc.)
        e.printStackTrace();
        return "Error occurred while fetching Artists";
      }
    }
    return artistsArray.toString();
  }

  private List<Artist> parseArtistsJSON(JsonArray artistsArrResult) {
    // creates an array containing all artists objects and nessecary properties from
    // the result from spotify api
    // also saves to database
    List<Artist> artistsArr = new ArrayList<>();// full array of artists

    for (JsonElement element : artistsArrResult) {
      JsonObject artistAPIResult = element.getAsJsonObject();

      String artistID = artistAPIResult.get("id").getAsString();
      String artistName = artistAPIResult.get("name").getAsString();
      int artistPopularity = Integer.parseInt(artistAPIResult.get("popularity").getAsString());
      List<String> genres = List.of(gson.fromJson(artistAPIResult.get("genres"), String[].class));

      String image_url;
      if (artistAPIResult.get("images").getAsJsonArray().size() == 0
          || artistAPIResult.get("images").getAsJsonArray().isJsonNull()) {
        // image not available
        image_url = null;
      } else {
        image_url = artistAPIResult.get("images").getAsJsonArray().get(0).getAsJsonObject().get("url").getAsString();
      }

      Artist artist = new Artist(artistID, artistName, artistPopularity, image_url, genres);
      artistsArr.add(artist);
    }

    return artistsArr;
  }

  private JsonObject createArtistsObject(List<Artist> allArtists) {
    // create object that is returned to api
    // maps artist name to artist object
    JsonObject artistsObj = new JsonObject();
    for (Artist artist : allArtists) {
      artistsObj.add(artist.getName(), gson.toJsonTree(artist));
    }
    return artistsObj;
  }

  public String getArtists(String access_token, String artistIdsStr) {
    final List<String> ARTIST_IDS = List.of(gson.fromJson(artistIdsStr, String[].class));
    List<Artist> allArtists = new ArrayList<>();

    List<Artist> artistInDatabase = artistRepository.findAllById(ARTIST_IDS);
    System.out.println("Existing Artists: " + artistInDatabase.size());

    // compares lists of artist ids to find which are not stored in database
    Set<String> foundIds = artistInDatabase.stream()
        .map(Artist::getId)
        .collect(Collectors.toSet());
    List<String> missingIds = ARTIST_IDS.stream()
        .filter(id -> !foundIds.contains(id)) // Keep IDs not in the foundIds set
        .collect(Collectors.toList());
    System.out.println("Not Found Artists: " + missingIds.size());

    // fetch missing artists from spotify api
    String artistDataStr = fetchArtistsFromAPI(access_token, missingIds);

    List<Artist> fetchedArtists = parseArtistsJSON(JsonParser.parseString(artistDataStr).getAsJsonArray());
    saveArtistsToDatabase(fetchedArtists);

    allArtists.addAll(artistInDatabase);
    allArtists.addAll(fetchedArtists);
    // maps artist name to artist object
    return createArtistsObject(allArtists).toString();
  }
}