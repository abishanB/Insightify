package com.example.spring_boot.playlist;

import java.util.Map;

//import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(path = "api/playlist")
public class PlaylistController {
    private final PlaylistService playlistService;
    
    public PlaylistController (PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public String getUserPlaylist(@RequestParam String access_token, @RequestParam String playlistID) {
        System.out.println("getUserPlaylist Endpoint Hit");
        return playlistService.getPlaylist(access_token, playlistID);
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("tracks")
    public String getPlaylistTracks(@RequestParam String access_token, @RequestParam String playlistID) {
        System.out.println("getPlaylistTracks endpoint hit");
        return playlistService.getPlaylistTracks(access_token, playlistID);
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("top_artists")
    public  Map<String, Map<String, Double>> getPlaylistTopArtists(@RequestBody String playlistTracks) {
        return playlistService.getTopArtistsOverTime(playlistTracks);
    }

}
