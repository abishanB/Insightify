package com.example.spring_boot.playlist;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class ParsePlaylist {
  public static Map<String, Integer> countArtists(JsonArray jsonArray) {
    Map<String, Integer> artistOccurences = new LinkedHashMap<String, Integer>();
    for (JsonElement element : jsonArray) {
      // Convert each JsonElement to JsonObject
      JsonObject jsonObject = element.getAsJsonObject();
      String artistName = jsonObject.get("track").getAsJsonObject().get("artists").getAsJsonArray().get(0)
          .getAsJsonObject().get("name").getAsString();
      if (artistOccurences.containsKey(artistName)) {
        artistOccurences.put(artistName, artistOccurences.get(artistName) + 1);
      } else {
        artistOccurences.put(artistName, 1);
      }
    }
    // Convert the Map to a List of entries
    List<Map.Entry<String, Integer>> entryList = new ArrayList<>(artistOccurences.entrySet());

    // Sort the List by the values
    entryList.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));
    // Create a new LinkedHashMap to maintain the order after sorting
    Map<String, Integer> sortedMap = new LinkedHashMap<>();
    for (Map.Entry<String, Integer> entry : entryList) {
      sortedMap.put(entry.getKey(), entry.getValue());
    }

    return sortedMap;
  }

  public static Map<String, Integer> sliceTopArtists(Map<String, Integer> artistOccurences, int n) {
    // Convert the map entries to a list
    List<Map.Entry<String, Integer>> entryList = new ArrayList<>(artistOccurences.entrySet());

    // Create a new map to store the sliced data
    Map<String, Integer> slicedMap = new LinkedHashMap<>();

    // Add the first N entries to the sliced map
    for (int i = 0; i < n && i < entryList.size(); i++) {
      Map.Entry<String, Integer> entry = entryList.get(i);
      slicedMap.put(entry.getKey(), entry.getValue());
    }
    return slicedMap;
  }

  public static JsonObject timeRanges(JsonArray playlistTracks, List<LocalDate> periods) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    JsonObject playlistOverTime = new JsonObject();
    for (LocalDate period : periods) {
      JsonArray tracksWithinPeriod = new JsonArray();

      for (JsonElement element : playlistTracks) {
        JsonObject jsonObject = element.getAsJsonObject();
        LocalDate addedAt = LocalDate.parse(jsonObject.get("added_at").getAsString());
        if (addedAt.isBefore(period)) {
          tracksWithinPeriod.add(jsonObject);
        }
      }

      playlistOverTime.add(period.format(formatter), tracksWithinPeriod);

    }
    return playlistOverTime;
  }

  public static JsonObject countArtistsOverTime(Set<String> topArtists, JsonArray playlistTracks, List<LocalDate> periods) {
    JsonObject artistOccurencesOverTime = new JsonObject();
    for (String artist : topArtists) {
      JsonObject artistOccurences = new JsonObject();
      for (LocalDate period : periods) {
        int count = 0;
        for (JsonElement element : playlistTracks) {
          JsonObject jsonObject = element.getAsJsonObject();
          LocalDate addedAt = LocalDate.parse(jsonObject.get("added_at").getAsString());
          if (addedAt.isBefore(period)) {
            JsonArray artists = jsonObject.get("track").getAsJsonObject().get("artists").getAsJsonArray();
            for (JsonElement artistElement : artists) {
              String artistName = artistElement.getAsJsonObject().get("name").getAsString();
              if (artistName.equals(artist)) {
                count++;
              }
            }
          }
        artistOccurences.addProperty(period.toString(), count);
        }
      artistOccurencesOverTime.add(artist, artistOccurences);
      }
    }
    return artistOccurencesOverTime;
  }


  public Map<String, Map<String, Double>> JsonToMap(JsonObject json) {
    Gson gson = new Gson();
    // Deserialize the JSON string into a Map
    return gson.fromJson(json.toString(), Map.class);
}

  public  Map<String, Map<String, Double>> parseTopArtistsOverTime(String tracks) {
    GetPlaylist getPlaylist = new GetPlaylist();
    JsonArray playlistTracks = JsonParser.parseString(tracks).getAsJsonArray();
    // Call the updateProperties method from GetPlaylist class
    playlistTracks = getPlaylist.updateProperties(playlistTracks);
    playlistTracks = getPlaylist.orderPlaylists(playlistTracks);
    // Print the updated JSON array

    LocalDate startDate = LocalDate.parse(playlistTracks.get(0).getAsJsonObject().get("added_at").getAsString());
    LocalDate endDate = LocalDate
        .parse(playlistTracks.get(playlistTracks.size() - 1).getAsJsonObject().get("added_at").getAsString());

    List<LocalDate> periods = getPlaylist.createEqualPeriods(startDate, endDate);
     
    Map<String, Integer> artistOccurences = countArtists(playlistTracks);

    artistOccurences = sliceTopArtists(artistOccurences, 5);
    Set<String> topArtists = artistOccurences.keySet();
    

    JsonObject artistOccurencesOverTime = countArtistsOverTime(topArtists, playlistTracks, periods);


    return JsonToMap(artistOccurencesOverTime);
  }
  public static void main(String[] args) {
    // Call the readJSON method from GetPlaylist class
    GetPlaylist getPlaylist = new GetPlaylist();
    JsonArray playlistTracks = getPlaylist.readJSON();
    // Call the updateProperties method from GetPlaylist class
    playlistTracks = getPlaylist.updateProperties(playlistTracks);
    // Print the updated JSON array

    LocalDate startDate = LocalDate.parse(playlistTracks.get(0).getAsJsonObject().get("added_at").getAsString());
    LocalDate endDate = LocalDate
        .parse(playlistTracks.get(playlistTracks.size() - 1).getAsJsonObject().get("added_at").getAsString());
  
    List<LocalDate> periods = getPlaylist.createEqualPeriods(startDate, endDate);

    Map<String, Integer> artistOccurences = countArtists(playlistTracks);

    artistOccurences = sliceTopArtists(artistOccurences, 10);
    Set<String> topArtists = artistOccurences.keySet();
  
    JsonObject artistOccurencesOverTime = countArtistsOverTime(topArtists, playlistTracks, periods);
  
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    try (FileWriter writer = new FileWriter("output.json")) {
      gson.toJson(artistOccurencesOverTime, writer);
      System.out.println("JSON Array saved to file successfully.");
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}
