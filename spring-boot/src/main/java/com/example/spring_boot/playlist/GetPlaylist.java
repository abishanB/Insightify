package com.example.spring_boot.playlist;

import java.util.ArrayList;
import java.util.List;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import java.util.Comparator;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
 
public class GetPlaylist { 
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
    for (JsonElement element : jsonArray) {
      // Convert each JsonElement to JsonObject
      JsonObject jsonObject = element.getAsJsonObject();
      jsonObject.remove("added_by");
      jsonObject.remove("is_local");
      jsonObject.remove("primary_color");
      jsonObject.remove("video_thumbnail");
      jsonObject.get("track").getAsJsonObject().remove("album");
      jsonObject.get("track").getAsJsonObject().remove("available_markets");
      jsonObject.get("track").getAsJsonObject().remove("explicit");
      jsonObject.get("track").getAsJsonObject().remove("type");
      jsonObject.get("track").getAsJsonObject().remove("episode");
      jsonObject.get("track").getAsJsonObject().remove("external_ids");
      jsonObject.get("track").getAsJsonObject().remove("track_number");
      jsonObject.get("track").getAsJsonObject().remove("duration_ms");
      jsonObject.get("track").getAsJsonObject().remove("is_local");
      jsonObject.get("track").getAsJsonObject().remove("disc_number");
      jsonObject.get("track").getAsJsonObject().remove("popularity");
      jsonObject.get("track").getAsJsonObject().remove("uri");
      jsonObject.addProperty("added_at", jsonObject.get("added_at").getAsString().split("T")[0]);

    }
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
        return LocalDate.parse(dateString);  // Parse the date to LocalDate for comparison
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
    JsonArray jsonArray = new GetPlaylist().readJSON();
    GetPlaylist getPlaylist = new GetPlaylist();
    jsonArray = getPlaylist.updateProperties(jsonArray);
    jsonArray = getPlaylist.orderPlaylists(jsonArray);

    LocalDate startDate = LocalDate.parse(jsonArray.get(0).getAsJsonObject().get("added_at").getAsString());
    LocalDate endDate = LocalDate.parse(jsonArray.get(jsonArray.size()-1).getAsJsonObject().get("added_at").getAsString());;
    
    List<LocalDate> periods = getPlaylist.createEqualPeriods(startDate, endDate);

    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    try (FileWriter writer = new FileWriter("output.json")) {
      gson.toJson(jsonArray, writer);
      System.out.println("JSON Array saved to file successfully.");
    } catch (IOException e) {
        e.printStackTrace();
    }
  }
}
