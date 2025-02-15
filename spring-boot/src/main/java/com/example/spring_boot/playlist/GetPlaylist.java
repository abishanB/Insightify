package com.example.spring_boot.playlist;

import java.util.ArrayList;
import java.util.List;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import java.util.Comparator;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

 
public class GetPlaylist { 
  DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
  public JsonArray readJSON(){
      
      String filePath = "playlistTracks.json";  // replace with the actual file path
      
      try (FileReader reader = new FileReader(filePath)) {
          // Parse the JSON content into a JsonArray
          JsonArray jsonArray = JsonParser.parseReader(reader).getAsJsonArray();

          return jsonArray;
      } catch (IOException e) {
          e.printStackTrace();
      }
      return null;
  }

  public JsonArray updateProperties(JsonArray jsonArray){
    
    return jsonArray;
  }
  
  
  public JsonArray orderPlaylists(JsonArray jsonArray){
    // Convert JsonArray to a List for easier manipulation
    List<JsonElement> elementList = new ArrayList<>();
    for (JsonElement element : jsonArray) {
        elementList.add(element);
    }

    // Sort the list based on the "added_at" date field
    elementList.sort(Comparator.comparing(e -> {
        JsonObject jsonObject = e.getAsJsonObject();
        String dateString = jsonObject.get("added_at").getAsString();
        return LocalDate.parse(dateString, formatter);  // Parse the date to LocalDate for comparison
    }));

    // Convert the sorted list back into a JsonArray
    JsonArray sortedJsonArray = new JsonArray();
    for (JsonElement element : elementList) {
        sortedJsonArray.add(element);
    }
    
    return sortedJsonArray;
  }
  
  public List<LocalDate> createEqualPeriods(LocalDate startDate, LocalDate endDate) {
    int numOfPeriods = 20;
    // Calculate the total number of days between the two dates
    long totalDays = ChronoUnit.DAYS.between(startDate, endDate);

    // Determine the length of each period (divide by 10)
    long periodLength = totalDays / numOfPeriods;

    List<LocalDate> periods = new ArrayList<>();

    // Add the start date as the first period
    //periods.add(startDate);

    // Generate the next 9 periods by adding periodLength days to the previous date
    for (int i = 1; i < numOfPeriods; i++) {
      LocalDate nextPeriod = startDate.plusDays(i * periodLength);
      periods.add(nextPeriod);
    }

    // Add the end date as the last period (to ensure it's included)
    periods.add(endDate);

    return periods;
    }
  public static void main(String[] args){
    
  }
}
