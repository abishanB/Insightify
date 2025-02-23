package com.example.spring_boot.playlist.PlaylistEvolution;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import com.example.spring_boot.LocalDateTimeAdapter;
import com.example.spring_boot.playlist.Track;
import com.example.spring_boot.playlist.TrackRepository;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

//track top artists over playlist lifetime by using the added_at field for tracks
@Service
public class EvolutionService {
  @Autowired
  private TrackRepository trackRepository;

  DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
  private final Gson gson = new GsonBuilder()
      .serializeNulls() // Serializes null fields as well
      .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter()) // Custom serializer for LocalDateTime
      .excludeFieldsWithoutExposeAnnotation() // Only serialize fields annotated with @Expose
      .create();

  private List<LocalDate> createEqualPeriods(LocalDate startDate, LocalDate endDate) {
    int numOfPeriods = 20;
    // Calculate the total number of days between the two dates
    long totalDays = ChronoUnit.DAYS.between(startDate, endDate);

    // Determine the length of each period (divide by 10)
    long periodLength = totalDays / numOfPeriods;

    List<LocalDate> periods = new ArrayList<>();

    // Add the start date as the first period
    // periods.add(startDate);

    // Generate the next 9 periods by adding periodLength days to the previous date
    for (int i = 1; i < numOfPeriods; i++) {
      LocalDate nextPeriod = startDate.plusDays(i * periodLength);
      periods.add(nextPeriod);
    }

    // Add the end date as the last period (to ensure it's included)
    periods.add(endDate);

    return periods;
  }

  private Map<String, Integer> countArtists(JsonArray playlistTracks) {
    Map<String, Integer> artistOccurences = new LinkedHashMap<String, Integer>();
    for (JsonElement element : playlistTracks) {
      // Convert each JsonElement to JsonObject
      JsonObject track = element.getAsJsonObject();
      JsonArray artistsArray = gson.fromJson(track.get("artists").getAsString(), JsonArray.class);
      String artistName = artistsArray.get(0)
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

  private Map<String, Integer> sliceArtistFrequency(Map<String, Integer> artistOccurences, int n) {// get only n top
                                                                                                   // aritsts
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

  private int countArtistFrequencyForTimePeriod(String artist, JsonArray playlistTracks, LocalDate period) {
    int count = 0;

    for (JsonElement element : playlistTracks) {
      JsonObject track = element.getAsJsonObject();
      LocalDate addedAt = LocalDate.parse(track.get("added_at").getAsString(), formatter);

      if (!addedAt.isAfter(period)) {// using !isAfter includes today as opposed to isBefore
        JsonArray artists = gson.fromJson(track.get("artists").getAsString(), JsonArray.class);
        for (JsonElement artistElement : artists) {// iterate all artists on a track
          String artistName = artistElement.getAsJsonObject().get("name").getAsString();
          if (artistName.equals(artist)) {
            count++;
          }
        }
      }
    }
    return count;
  }

  private JsonObject countArtistsOverTime(Set<String> topArtists, JsonArray playlistTracks, List<LocalDate> periods) {
    // maps artist to another object mapping dates and artist frequency at that date
    JsonObject topArtistsFrequency = new JsonObject();

    for (String artist : topArtists) {
      JsonObject artistFrequencyOverTime = new JsonObject();
      for (LocalDate period : periods) {
        int count = countArtistFrequencyForTimePeriod(artist, playlistTracks, period);
        artistFrequencyOverTime.addProperty(period.toString(), count);
      }
      topArtistsFrequency.add(artist, artistFrequencyOverTime);
    }

    return topArtistsFrequency;
  }

  public String getPlaylistEvolution(String playlistID) {
    final int numOfTopArtistsToTrack = 10;

    // get tracks ordered by last added
    StopWatch stopWatch = new StopWatch();
    stopWatch.start("Fetch Tracks for Evolution");
    List<Track> tracks = trackRepository.findTracksByPlaylistIdOrdered(playlistID);
    stopWatch.stop();

    Collections.reverse(tracks);// order by first added
    JsonArray playlistTracks = gson.toJsonTree(tracks).getAsJsonArray();

    if (playlistTracks.size() == 0) {
      return "Empty Playlist";
    }

    LocalDate startDate = LocalDate.parse(playlistTracks.get(0).getAsJsonObject().get("added_at").getAsString(),
        formatter);
    LocalDate endDate = LocalDate
        .parse(playlistTracks.get(playlistTracks.size() - 1).getAsJsonObject().get("added_at").getAsString(),
            formatter);

    stopWatch.start("Create equal periods");
    List<LocalDate> periods = createEqualPeriods(startDate, endDate);
    stopWatch.stop();

    stopWatch.start("Count Artists");
    Map<String, Integer> artistFrequency = countArtists(playlistTracks);
    artistFrequency = sliceArtistFrequency(artistFrequency, numOfTopArtistsToTrack);
    Set<String> topArtists = artistFrequency.keySet();
    stopWatch.stop();

    stopWatch.start("Count artists over time");
    JsonObject playlistAritstEvolution = countArtistsOverTime(topArtists, playlistTracks, periods);
    stopWatch.stop();
    System.out.println(stopWatch.prettyPrint());

    return playlistAritstEvolution.toString();
  }
}
