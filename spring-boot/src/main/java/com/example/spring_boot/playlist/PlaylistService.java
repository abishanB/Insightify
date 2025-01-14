package com.example.spring_boot.playlist;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@Service
public class PlaylistService {
    public static List<String> jsonObjectToList(JsonObject jsonObject) {
        List<String> list = new ArrayList<>();
        // Iterate through JsonObject and add values to list
        for (String key : jsonObject.keySet()) {
            JsonElement element = jsonObject.get(key);
            list.add(element.getAsString()); // Add the value as a string
        }
        return list;
    }

    public Map<String, Map<String, Double>> getTopArtistsOverTime(String playlistTracks) {
        ParsePlaylist parseData = new ParsePlaylist();
        Map<String, Map<String, Double>> artists = parseData.parseTopArtistsOverTime(playlistTracks);
    
        return artists;
    }
}
