package com.example.spring_boot.playlist;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class GetGenres {

  private static final HttpClient client = HttpClient.newHttpClient();
  private static final String SPOTIFY_API_URL = "https://api.spotify.com/v1/artists?ids=";

  // Simulated state update methods (replace with your actual logic)
  private static void setTopArtistsInPlaylist(List<Artist> artists) {
    // Update state with artists
  }

  private static void setTopGenresInPlaylists(Map<String, Genre> genres) {
    // Update state with genres
  }

  public static void getGenres(List<Artist> playlistArtists, String accessToken) {
    Map<String, Genre> playlistGenres = new HashMap<>();
    List<Artist> playlistsArtistsCopy = new ArrayList<>(playlistArtists);
    int numOfArtists = playlistArtists.size();
    int artistsSetsPerFifty = (int) Math.ceil((double) numOfArtists / 50);

    List<CompletableFuture<Void>> promises = new ArrayList<>();

    for (int i = 0; i < artistsSetsPerFifty; i++) {
      List<String> artistIds = new ArrayList<>();
      for (int artistIndex = 50 * i; artistIndex < 50 * (i + 1); artistIndex++) {
        if (artistIndex >= numOfArtists)
          break;
        artistIds.add(playlistArtists.get(artistIndex).getId());
      }

      String url = SPOTIFY_API_URL + String.join(",", artistIds);
      promises.add(getEndpointResult(accessToken, url, "fetching artists")
          .thenAccept(artistSet -> processArtistSet(artistSet, 1, playlistsArtistsCopy, playlistGenres)));
    }

    CompletableFuture.allOf(promises.toArray(new CompletableFuture[0])).join();

    // Update state after all promises are resolved
    setTopArtistsInPlaylist(playlistsArtistsCopy);
    setTopGenresInPlaylists(sortProperties(playlistGenres));
  }

  private static CompletableFuture<JsonObject> getEndpointResult(String accessToken, String url,
      String taskDescription) {
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .header("Authorization", "Bearer " + accessToken)
        .GET()
        .build();

    return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
        .thenApply(response -> {
          if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to fetch data: " + response.body());
          }
          return JsonParser.parseString(response.body()).getAsJsonObject();
        })
        .exceptionally(e -> {
          throw new RuntimeException("Error during " + taskDescription, e);
        });
  }

  private static void processArtistSet(JsonObject artistSet, int artistSetNum, List<Artist> playlistsArtistsCopy,
      Map<String, Genre> playlistGenres) {
    JsonArray artists = artistSet.getAsJsonArray("artists");
    for (int artistKey = 0; artistKey < artists.size(); artistKey++) {
      JsonObject artist = artists.get(artistKey).getAsJsonObject();
      int artistIndex = artistKey + (artistSetNum * 50);
      Artist artistCopy = playlistsArtistsCopy.get(artistIndex);

      // Set artist image URL
      if (artist.getAsJsonArray("images").size() == 0) {
        artistCopy.setImageUrl(
            "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999");
      } else {
        artistCopy.setImageUrl(artist.getAsJsonArray("images").get(0).getAsJsonObject().get("url").getAsString());
      }

      // Process genres
      JsonArray genres = artist.getAsJsonArray("genres");
      for (var genreElement : genres) {
        String genre = genreElement.getAsString();
        String genreCapitalized = capitalizeFirstLetter(genre);

        playlistGenres.computeIfAbsent(genreCapitalized, k -> new Genre())
            .incrementOccurrences(artistCopy.getTotalOccurrences());
      }
    }
  }

  private static String capitalizeFirstLetter(String str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

  private static Map<String, Genre> sortProperties(Map<String, Genre> playlistGenres) {
    // Sort genres by occurrences (replace with your sorting logic)
    return playlistGenres;
  }

  // Helper classes
  static class Artist {
    private String id;
    private int totalOccurrences;
    private String imageUrl;

    // Getters and setters
    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public int getTotalOccurrences() {
      return totalOccurrences;
    }

    public void setTotalOccurrences(int totalOccurrences) {
      this.totalOccurrences = totalOccurrences;
    }

    public String getImageUrl() {
      return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
      this.imageUrl = imageUrl;
    }
  }

  static class Genre {
    private int totalOccurrences;

    public void incrementOccurrences(int count) {
      this.totalOccurrences += count;
    }

    public int getTotalOccurrences() {
      return totalOccurrences;
    }
  }

  public static void main(String[] args) {
    // Example usage
    List<Artist> playlistArtists = new ArrayList<>();
    String accessToken = "your_access_token_here";
    getGenres(playlistArtists, accessToken);
  }
}