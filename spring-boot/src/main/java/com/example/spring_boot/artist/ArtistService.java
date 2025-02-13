package com.example.spring_boot.artist;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

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

  private static final HttpClient client = HttpClient.newHttpClient();
  private static final String SPOTIFY_API_ARTISTS_URL = "https://api.spotify.com/v1/artists?ids=";
  private static final Gson gson = new GsonBuilder().serializeNulls().create();

  private void saveArtistsToDatabase(List<Artist> artists){
    artistRepository.saveAll(artists);//save to database
  }

  private static List<String[]> splitArrayIntoChunks(String[] array, int chunkSize) {
    List<String[]> chunks = new ArrayList<>();

    for (int i = 0; i < array.length; i += chunkSize) {
      // Calculate the end index for the current chunk
      int end = Math.min(array.length, i + chunkSize);

      // Create a new array for the current chunk
      String[] chunk = new String[end - i];

      // Copy elements from the original array to the chunk
      System.arraycopy(array, i, chunk, 0, chunk.length);
      chunks.add(chunk);
    }
    return chunks;
  }

  private static String getArtists(String access_token, String[] artistIDsArr) {
    int chunkSize = 50;
    List<String[]> chunks = splitArrayIntoChunks(artistIDsArr, chunkSize);

    JsonArray artistsArray = new JsonArray();
    for (String[] ids : chunks) {
      String url = SPOTIFY_API_ARTISTS_URL + String.join(",", ids);
      try {
        System.out.println("Fetching artists ");
        String promise = getEndpointResult(access_token, url);
        for (JsonElement element : JsonParser.parseString(promise).getAsJsonObject().get("artists").getAsJsonArray()) {
          artistsArray.add(element);
        }
      } catch (Exception e) {
        // Handle the exception (log it, return a default value, etc.)
        e.printStackTrace();
        return "Error occurred while fetching Artists";
      }
    }
    return artistsArray.toString();
  }

  private String createArtistsObject(JsonArray artistsArrResult) {
    // creates an object containing all artists and nessecary properties from the
    // result from spotify api

    JsonObject artistsObject = new JsonObject();//returning to api
    List<Artist> artistsObjArr = new ArrayList<>();//saving to database

    for (JsonElement element : artistsArrResult) {
      JsonObject artistAPIResult = element.getAsJsonObject();

      String artistID = artistAPIResult.get("id").getAsString();
      String artistName =  artistAPIResult.get("name").getAsString();
      String href = artistAPIResult.get("href").getAsString();
      String[] genres = gson.fromJson(artistAPIResult.get("genres"), String[].class);
      String image_url;
 
      if (artistAPIResult.get("images").getAsJsonArray().size() == 0 || artistAPIResult.get("images").getAsJsonArray().isJsonNull()) {
        //image not available
        image_url = null;
      } else {
       image_url = artistAPIResult.get("images").getAsJsonArray().get(0).getAsJsonObject().get("url").getAsString();
      }

      Artist artist = new Artist(artistID, artistName, href, image_url, genres);
      artistsObject.add(artistName, gson.toJsonTree(artist));
      artistsObjArr.add(artist);
    }

    saveArtistsToDatabase(artistsObjArr);
    return artistsObject.toString();
  }

  private static String getEndpointResult(String accessToken, String url) throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .header("Authorization", "Bearer " + accessToken)
        .GET()
        .build();

    
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    return response.body().toString();
  }

  public String onGetGenres(String access_token, String artistIdsStr) {
    String[] artistIDs = gson.fromJson(artistIdsStr, String[].class);

    String artistDataStr = getArtists(access_token, artistIDs);

    return createArtistsObject(JsonParser.parseString(artistDataStr).getAsJsonArray());
  }
}